import cv2
import numpy as np

def analyze_pothole_image(image_bytes: bytes) -> dict:
    """
    Analyzes an image to detect potholes using advanced OpenCV heuristics.
    Includes background asphalt verification, cavity shadow checks, and targeted color filtering
    to distinguish actual road defects from random images or objects.
    """
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Invalid image format")

        height, width = img.shape[:2]
        total_pixels = height * width

        hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 1. Background Asphalt Verification
        # Sample the border of the image (outer 15%) to check if it matches a road surface
        border_mask = np.ones((height, width), dtype=np.uint8)
        border_mask[int(height*0.15):int(height*0.85), int(width*0.15):int(width*0.85)] = 0
        
        border_hsv_mean = cv2.mean(hsv_img, mask=border_mask)
        border_saturation = border_hsv_mean[1]
        
        # Roads (asphalt/concrete) are typically gray, brown, or black (low to medium saturation).
        # A studio background, grass, or sky will fail this.
        if border_saturation > 220:
            return {
                "is_pothole": False,
                "confidence": 92.0,
                "estimated_size_sqm": 0.0,
                "message": "Invalid: Surrounding background lacks asphalt/concrete texture (too colorful)."
            }

        # 2. Contour Detection for potential cavities
        blurred = cv2.GaussianBlur(gray, (15, 15), 0)
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 21, 5
        )

        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        best_cnt = None
        max_area = 0

        for cnt in contours:
            area = cv2.contourArea(cnt)
            # Must be a reasonable size: not a speck, not the entire image
            if area < (total_pixels * 0.005) or area > (total_pixels * 0.8):
                continue

            perimeter = cv2.arcLength(cnt, True)
            if perimeter == 0:
                continue
                
            roughness = (perimeter * perimeter) / area
            # Real potholes have some jaggedness. Perfectly smooth shapes (like a ball) are rejected.
            if roughness < 2.5: 
                continue 

            if area > max_area:
                max_area = area
                best_cnt = cnt

        # 3. Analyze the most prominent anomaly
        if best_cnt is not None:
            anomaly_mask = np.zeros((height, width), dtype=np.uint8)
            cv2.drawContours(anomaly_mask, [best_cnt], -1, 255, thickness=cv2.FILLED)
            
            # Cavity Shadow Check: A hole goes into the ground, so it should be darker than the road.
            anomaly_mean_brightness = cv2.mean(gray, mask=anomaly_mask)[0]
            
            bg_mask = cv2.bitwise_not(anomaly_mask)
            bg_mean_brightness = cv2.mean(gray, mask=bg_mask)[0]
            
            # If the object is noticeably brighter than the road, it's likely debris, an animal, or a toy (e.g. a dinosaur)
            # Note: Relaxed this check slightly to allow for water reflections (puddles)
            if anomaly_mean_brightness > bg_mean_brightness + 40:
                return {
                    "is_pothole": False,
                    "confidence": 88.0,
                    "estimated_size_sqm": 0.0,
                    "message": "Invalid: Detected object is brighter than the background (not a cavity)."
                }
            
            # Targeted Color Filtering: The pothole itself shouldn't be bright yellow/red/purple
            anomaly_hsv_mean = cv2.mean(hsv_img, mask=anomaly_mask)
            anomaly_saturation = anomaly_hsv_mean[1]
            
            # Relaxed heavily: allows dirt, leaves, and muddy water to pass, while catching pure neon/toy colors
            if anomaly_saturation > 180:
                return {
                    "is_pothole": False,
                    "confidence": 95.0,
                    "estimated_size_sqm": 0.0,
                    "message": "Invalid: Detected anomaly is too colorful to be a road cavity."
                }

            # Passed all checks -> It's a real pothole
            confidence = min(99.0, 75.0 + (max_area / total_pixels * 100))
            estimated_size_sqm = round(max(0.1, (max_area / total_pixels) * 4.0), 2)
            
            return {
                "is_pothole": True,
                "confidence": round(confidence, 1),
                "estimated_size_sqm": estimated_size_sqm,
                "message": "Valid pothole cavity detected."
            }

        # 4. Fallback: Completely shattered road without a single clean contour
        median_val = np.median(gray)
        lower_canny = int(max(0, 0.66 * median_val))
        upper_canny = int(min(255, 1.33 * median_val))
        edges = cv2.Canny(gray, lower_canny, upper_canny)
        edge_density = np.sum(edges > 0) / edges.size
        
        # High edge density implies terrible road condition (cracks, gravel, deterioration).
        # Removed the arbitrary brightness check to allow sunlit roads.
        if edge_density > 0.04:
             return {
                "is_pothole": True,
                "confidence": min(95.0, 60 + edge_density*400),
                "estimated_size_sqm": 1.5,
                "message": "Widespread road surface deterioration detected."
            }

        return {
            "is_pothole": False,
            "confidence": 75.0,
            "estimated_size_sqm": 0.0,
            "message": "Low confidence: Surface appears too smooth or lacks defined cavities."
        }
    except Exception as e:
        return {
            "is_pothole": False,
            "confidence": 10.0,
            "estimated_size_sqm": 0.0,
            "message": f"Analysis failed: {str(e)}"
        }

def analyze_repaired_road_image(image_bytes: bytes) -> dict:
    """
    Analyzes an image to strictly verify it is a fully constructed/repaired road.
    Rejects anything that has high structural variance, is highly colorful, or contains pothole-like contours.
    """
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Invalid image format")

        # 1. Color Check - Must be largely grey/dark (Asphalt/Concrete)
        hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        mean_val = cv2.mean(hsv_img)
        mean_saturation = mean_val[1]
        
        # If the image is extremely saturated (colorful), reject it immediately.
        # Increased from 60 to 180 to allow dirt, sand, and gravel tones
        if mean_saturation > 180:
            return {
                "is_repaired": False,
                "confidence": 15.0,
                "message": "Invalid: Image contains colors not consistent with a repaired road."
            }

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 2. Edge Density Check - Repaired roads should be relatively smooth
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / edges.size
        
        # Increased from 0.15 to 0.45 to allow gravel and textured sand
        if edge_density > 0.45:
            # Too many edges = highly textured, complex background, or extreme damage
            return {
                "is_repaired": False,
                "confidence": 20.0,
                "message": "Invalid: High structural variance detected. Surface is not smooth."
            }

        # 3. Contour Check - Ensure no dark cavities exist
        blur = cv2.GaussianBlur(gray, (9, 9), 0)
        thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        total_pixels = img.shape[0] * img.shape[1]
        
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < (total_pixels * 0.05) or area > (total_pixels * 0.4): # Relaxed min area
                continue
                
            perimeter = cv2.arcLength(cnt, True)
            if perimeter == 0:
                continue
                
            circularity = 4 * np.pi * (area / (perimeter * perimeter))
            
            # If we find a significantly large and somewhat circular dark spot -> it's a pothole, NOT repaired
            if circularity > 0.6: # Relaxed from 0.3
                return {
                    "is_repaired": False,
                    "confidence": 10.0,
                    "message": "Invalid: Pothole cavity detected. Road is not fully repaired."
                }
                
        # If it passes color, edge density, and contour checks, it is a smooth, repaired road
        confidence = 98.0 - (edge_density * 50) # Smoother = higher confidence
        
        return {
            "is_repaired": True,
            "confidence": round(max(confidence, 85.0), 1),
            "estimated_size_sqm": 0.0,
            "message": "Valid repaired road surface detected."
        }

    except Exception as e:
        return {
            "is_repaired": False,
            "confidence": 5.0,
            "message": f"Analysis failed: {str(e)}"
        }

