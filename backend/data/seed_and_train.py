import os
import re
import csv
import json
import uuid
import numpy as np
import pickle
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import backend models
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.ward import Ward, Road, Contractor
from app.models.case import Case, CaseLocation
from app.models.work_order import WorkOrder
from app.models.evidence import EvidenceFile
from app.models.verification import VerificationResult, VerificationCheck
from app.models.audit import AuditLog

# Coordinate mappings for the 24 BMC Wards
WARD_COORDINATES = {
    "A": (18.9220, 72.8347),
    "B": (18.9515, 72.8375),
    "C": (18.9525, 72.8273),
    "D": (18.9667, 72.8167),
    "E": (18.9772, 72.8335),
    "F North": (19.0268, 72.8553),
    "F South": (18.9954, 72.8396),
    "G North": (19.0178, 72.8478),
    "G South": (19.0068, 72.8156),
    "H East": (19.0805, 72.8530),
    "H West": (19.0596, 72.8295),
    "K East": (19.1136, 72.8697),
    "K West": (19.1363, 72.8277),
    "L": (19.0726, 72.8845),
    "M East": (19.0560, 72.9126),
    "M West": (19.0345, 72.8953),
    "N": (19.0864, 72.9082),
    "P North": (19.1866, 72.8486),
    "P South": (19.1645, 72.8499),
    "R North": (19.2501, 72.8593),
    "R Central": (19.2307, 72.8567),
    "R South": (19.2045, 72.8360),
    "S": (19.1438, 72.9304),
    "T": (19.1723, 72.9565),
}

def parse_and_seed_data(data_dir: str):
    print("[INFO] Starting Database Ingestion & AI Model Training...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Read Wards CSV
    wards_path = os.path.join(data_dir, "wards.csv")
    ward_objs = {}
    if os.path.exists(wards_path):
        with open(wards_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                code = row["ward"].strip()
                zone = row.get("zone", "").strip()
                name = f"Ward {code} ({zone})"
                lat, lng = WARD_COORDINATES.get(code, (19.0178, 72.8478))

                ward = db.query(Ward).filter((Ward.code == code) | (Ward.id == code)).first()
                if not ward:
                    ward = Ward(
                        id=code,
                        name=name,
                        code=code,
                        city="Mumbai",
                        center_lat=lat,
                        center_lng=lng
                    )
                    db.add(ward)
                    db.flush()
                else:
                    ward.name = name
                    ward.center_lat = lat
                    ward.center_lng = lng
                ward_objs[code] = ward
        db.commit()
        print(f"✅ Synced {len(ward_objs)} official BMC Wards.")

    # 2. Read Contractors CSV
    contractors_path = os.path.join(data_dir, "contractors.csv")
    contractor_objs = {}
    if os.path.exists(contractors_path):
        with open(contractors_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                c_id = row["contractor_id"].strip()
                c_name = row["contractor_name"].strip()
                reg_no = row.get("registration_no", "").strip()
                ward_code = row.get("ward", "").strip()
                perf_score = float(row.get("performance_score", 75)) / 20.0 # scale to 5.0

                c = db.query(Contractor).filter(Contractor.id == c_id).first()
                if not c:
                    c = Contractor(
                        id=c_id,
                        name=c_name,
                        company_name=c_name,
                        phone=f"+91 98200 {c_id.replace('C', '').zfill(5)}",
                        email=f"{c_id.lower()}@bmc.contractor.internal",
                        rating=round(perf_score, 1),
                        active_orders=0
                    )
                    db.add(c)
                else:
                    c.name = c_name
                    c.company_name = c_name
                    c.rating = round(perf_score, 1)
                contractor_objs[c_id] = c

                # Also create User record for contractor login
                u_email = f"{c_id.lower()}@civicfix.org"
                user = db.query(User).filter((User.email == u_email) | (User.contractor_id == c_id) | (User.id == c_id.lower())).first()
                if not user:
                    db.add(User(
                        id=c_id.lower(),
                        contractor_id=c_id,
                        email=u_email,
                        full_name=c_name,
                        role=UserRole.CONTRACTOR,
                        phone=f"+91 98200 {c_id.replace('C', '').zfill(5)}",
                        hashed_password=hash_password("Contractor@123"),
                        is_active=True
                    ))
                else:
                    user.contractor_id = c_id
                    user.full_name = c_name
                    user.role = UserRole.CONTRACTOR
                    user.hashed_password = hash_password("Contractor@123")
                    user.is_active = True
        db.commit()
        print(f"✅ Synced {len(contractor_objs)} Contractors & Login Credentials.")

    # 3. Read Roads CSV
    roads_path = os.path.join(data_dir, "roads.csv")
    road_objs = {}
    if os.path.exists(roads_path):
        with open(roads_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                r_id = row["road_id"].strip()
                r_name = row["road_name"].strip()
                w_code = row.get("ward", "G North").strip()
                r_type = row.get("road_type", "Main Road").strip()

                ward = ward_objs.get(w_code)
                ward_id = ward.id if ward else w_code

                r = db.query(Road).filter(Road.id == r_id).first()
                if not r:
                    r = Road(
                        id=r_id,
                        name=r_name,
                        ward_id=ward_id,
                        road_type=r_type
                    )
                    db.add(r)
                else:
                    r.name = r_name
                    r.ward_id = ward_id
                    r.road_type = r_type
                road_objs[r_id] = r
        db.commit()
        print(f"✅ Synced {len(road_objs)} Municipal Roads.")

    # 4. Read Contracts CSV and create Work Orders / Cases
    contracts_path = os.path.join(data_dir, "contracts.csv")
    contracts_count = 0
    if os.path.exists(contracts_path):
        with open(contracts_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                ct_id = row["contract_id"].strip()
                r_id = row.get("road_id", "").strip()
                r_name = row.get("road_name", "").strip()
                w_code = row.get("ward", "G North").strip()
                c_id = row.get("contractor_id", "").strip()
                c_name = row.get("contractor_name", "").strip()
                status_raw = row.get("status", "Ongoing").strip()

                ward = ward_objs.get(w_code)
                lat, lng = WARD_COORDINATES.get(w_code, (19.0178, 72.8478))
                gen_lat = lat + np.random.uniform(-0.008, 0.008)
                gen_lng = lng + np.random.uniform(-0.008, 0.008)

                # Create or update WorkOrder
                wo = db.query(WorkOrder).filter(WorkOrder.id == ct_id).first()
                status_mapped = "Verified" if status_raw == "Completed" else ("In Progress" if status_raw == "Ongoing" else "Assigned")

                if not wo:
                    # Create corresponding case first
                    case_id = f"CASE-{ct_id}"
                    c_case = db.query(Case).filter(Case.id == case_id).first()
                    if not c_case:
                        c_case = Case(
                            id=case_id,
                            title=f"Repair on {r_name}",
                            description=f"Surface defect scheduled under contract {ct_id} for {w_code} zone.",
                            severity="High" if "Main" in r_name else "Medium",
                            status="VERIFIED_CLOSED" if status_mapped == "Verified" else ("IN_PROGRESS" if status_mapped == "In Progress" else "ASSIGNED"),
                            channel="MUNICIPAL",
                            ward_id=ward.id if ward else w_code,
                            road_id=r_id if r_id in road_objs else None
                        )
                        db.add(c_case)
                        db.flush()

                        loc = CaseLocation(
                            case_id=case_id,
                            latitude=gen_lat,
                            longitude=gen_lng,
                            address=f"{r_name}, Ward {w_code}",
                            landmark="Municipal Road Corridor"
                        )
                        db.add(loc)

                    wo = WorkOrder(
                        id=ct_id,
                        case_id=case_id,
                        contractor_id=c_id if c_id in contractor_objs else "C001",
                        assigned_latitude=gen_lat,
                        assigned_longitude=gen_lng,
                        status=status_mapped,
                        priority="High" if "Main" in r_name else "Medium",
                        deadline=datetime.utcnow() + timedelta(days=2)
                    )
                    db.add(wo)
                    contracts_count += 1
                else:
                    wo.status = status_mapped
                    wo.contractor_id = c_id if c_id in contractor_objs else "C001"

        db.commit()
        print(f"✅ Synced {contracts_count} Contracts & Work Orders.")

    # 5. Train AI Decision Verification Model on 10,000 cases dataset
    train_ai_model(data_dir)

    db.close()
    print("🎉 Ingestion & Model Training Complete!")

def train_ai_model(data_dir: str):
    """
    Trains an ML verification classifier & confidence regressor on the 10,000 verification cases.
    Features: [gps_match, perspective_match, landmark_match, surface_analysis, evidence_integrity]
    Target: confidence_score
    """
    print("\n🧠 Training AI Verification Model on 10,000 cases...")
    cases_path = os.path.join(data_dir, "ai_verification_cases.csv")
    if not os.path.exists(cases_path):
        print("❌ ai_verification_cases.csv not found, skipping training.")
        return

    X = []
    y = []

    with open(cases_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            gps = 1.0 if row["gps_match"].strip().upper() == "PASS" else 0.0
            persp = 1.0 if row["perspective_match"].strip().upper() == "PASS" else 0.0
            landm = 1.0 if row["landmark_match"].strip().upper() == "PASS" else 0.0
            surf = 1.0 if row["surface_analysis"].strip().upper() == "PASS" else 0.0
            integ = 1.0 if row["evidence_integrity"].strip().upper() == "PASS" else 0.0
            conf = float(row["confidence_score"].strip())

            X.append([gps, persp, landm, surf, integ])
            y.append(conf)

    X = np.array(X)
    y = np.array(y)

    print(f"📊 Training dataset loaded: {len(X)} samples with 5 verification features.")

    # Calculate optimal statistical regression weights via Non-Negative Least Squares
    try:
        from scipy.optimize import nnls
        w_raw, _ = nnls(X, y)
    except ImportError:
        w_raw = np.linalg.lstsq(X, y, rcond=None)[0]
        w_raw = np.maximum(w_raw, 0.0)

    # Normalize weights so they represent proportional feature importance summing to 1.0 (100%)
    w_sum = np.sum(w_raw) if np.sum(w_raw) > 0 else 1.0
    w_norm = w_raw / w_sum

    weights = {
        "GPS": float(w_norm[0]),
        "PERSPECTIVE": float(w_norm[1]),
        "LANDMARK": float(w_norm[2]),
        "POTHOLE": float(w_norm[3]),
        "INTEGRITY": float(w_norm[4]),
    }

    # Model evaluation: calculate predictions based on check scores scaled to dataset range
    y_pred = X @ w_raw
    mae = float(np.mean(np.abs(y - y_pred)))
    rmse = float(np.sqrt(np.mean((y - y_pred) ** 2)))
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    ss_res = np.sum((y - y_pred) ** 2)
    r2 = float(max(0.0, 1 - (ss_res / ss_tot)))

    # Calculate calibrated passing thresholds
    pass_scores = y[np.sum(X, axis=1) >= 4]
    optimal_pass_threshold = float(np.percentile(pass_scores, 15)) if len(pass_scores) > 0 else 72.0

    model_metadata = {
        "trained_at": datetime.utcnow().isoformat(),
        "total_samples": len(X),
        "r2_score": round(r2, 4),
        "mean_absolute_error": round(mae, 2),
        "root_mean_squared_error": round(rmse, 2),
        "raw_feature_coefficients": [round(float(v), 4) for v in w_raw],
        "feature_weights": {k: round(v, 4) for k, v in weights.items()},
        "pass_threshold": round(optimal_pass_threshold, 1),
        "feature_names": ["GPS", "PERSPECTIVE", "LANDMARK", "POTHOLE", "INTEGRITY"]
    }

    # Save trained model weights as JSON and pickle
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app', 'verification'))
    os.makedirs(out_dir, exist_ok=True)
    json_path = os.path.join(out_dir, "ai_verification_model.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(model_metadata, f, indent=2)

    pkl_path = os.path.join(out_dir, "ai_verification_model.pkl")
    with open(pkl_path, "wb") as f:
        pickle.dump({"weights": w_norm, "raw_coefficients": w_raw, "metadata": model_metadata}, f)

    print(f"🎯 AI Verification Model Trained Successfully!")
    print(f"   • Samples Trained: {model_metadata['total_samples']}")
    print(f"   • Mean Absolute Error: {model_metadata['mean_absolute_error']} points")
    print(f"   • Normalized Feature Weights: {model_metadata['feature_weights']}")
    print(f"   • Calibrated Pass Threshold: {model_metadata['pass_threshold']}")
    print(f"   • Model saved to {json_path} and {pkl_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parse_and_seed_data(current_dir)
