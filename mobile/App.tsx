import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {
  ShieldCheck,
  HardHat,
  Camera,
  Server,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MapPin,
  CheckCircle2,
} from 'lucide-react-native';
import { ReportPotholeScreen } from './src/screens/citizen/ReportPotholeScreen';
import { ContractorScreen } from './src/screens/contractor/ContractorScreen';
import { ServerConfigModal } from './src/components/ServerConfigModal';
import { checkBackendHealth, SERVER_HOST } from './src/api/client';

export default function App() {
  const [currentMode, setCurrentMode] = useState<'LANDING' | 'CITIZEN' | 'CONTRACTOR'>('LANDING');
  const [serverModalOpen, setServerModalOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const checkHealth = async () => {
    const ok = await checkBackendHealth();
    setBackendOnline(ok);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Citizen Portal Screen
  if (currentMode === 'CITIZEN') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
        <View style={styles.screenHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setCurrentMode('LANDING')}
            activeOpacity={0.7}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <Text style={styles.backBtnText}>← Back to Home</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerScreenTitle}>Citizen Portal</Text>
          </View>
          <TouchableOpacity
            style={styles.serverHeaderBtn}
            onPress={() => setServerModalOpen(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Server size={15} color="#0F766E" />
          </TouchableOpacity>
        </View>

        <ReportPotholeScreen onBack={() => setCurrentMode('LANDING')} />

        <ServerConfigModal
          visible={serverModalOpen}
          onClose={() => setServerModalOpen(false)}
          onSaved={checkHealth}
        />
      </SafeAreaView>
    );
  }

  // Contractor Screen
  if (currentMode === 'CONTRACTOR') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
        <View style={styles.screenHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setCurrentMode('LANDING')}
            activeOpacity={0.7}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <Text style={styles.backBtnText}>← Back to Home</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={[styles.headerScreenTitle, { color: '#D97706' }]}>Contractor Field Crew</Text>
          </View>
          <TouchableOpacity
            style={styles.serverHeaderBtn}
            onPress={() => setServerModalOpen(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Server size={15} color="#0F766E" />
          </TouchableOpacity>
        </View>

        <ContractorScreen onBack={() => setCurrentMode('LANDING')} />

        <ServerConfigModal
          visible={serverModalOpen}
          onClose={() => setServerModalOpen(false)}
          onSaved={checkHealth}
        />
      </SafeAreaView>
    );
  }

  // Landing / Role Selection Screen (CIVICFIX AI)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.landingHeader}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <ShieldCheck color="#0F766E" size={24} />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>CIVICFIX AI</Text>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: backendOnline ? '#10B981' : '#F59E0B' },
                ]}
              />
            </View>
            <Text style={styles.brandSubtitle}>
              Decentralized Road Repair & AI Vision Verification
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.serverSettingsBtn}
          onPress={() => setServerModalOpen(true)}
        >
          <Server size={14} color="#0F766E" />
          <Text style={styles.serverSettingsText}>Server</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.landingContent} showsVerticalScrollIndicator={false}>
        {/* Hero Announcement Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroBadge}>
              <Sparkles size={13} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>AI Vision Active</Text>
            </View>
            <Text style={styles.heroSub}>FastAPI & SQLite Sync</Text>
          </View>
          <Text style={styles.heroTitle}>Municipal Infrastructure & Pothole Tracking</Text>
          <Text style={styles.heroDescription}>
            Every road cavity is verified with SIFT Perspective Homography, CLAHE Lighting Normalization, and strict GPS spatial bounds.
          </Text>
        </View>

        {/* Role Selection Heading */}
        <View style={styles.chooseSection}>
          <Text style={styles.sectionHeading}>Choose Your Role to Log In</Text>
          <Text style={styles.sectionSubheading}>
            Select whether you are reporting road issues as a citizen or repairing roads as a contractor field crew.
          </Text>
        </View>

        {/* Button 1: Citizen Portal */}
        <TouchableOpacity
          style={styles.roleCardCitizen}
          onPress={() => setCurrentMode('CITIZEN')}
          activeOpacity={0.85}
        >
          <View style={styles.roleCardHeader}>
            <View style={styles.citizenIconCircle}>
              <Camera color="#0F766E" size={26} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.roleTitleCitizen}>Citizen Portal</Text>
              <Text style={styles.roleSubBadge}>Report & Track Potholes</Text>
            </View>
          </View>

          <Text style={styles.roleDesc}>
            Snap road defects with live GPS lock and camera photo. Automatically saves your mobile number in the database and tracks repair progress in real time.
          </Text>

          <View style={styles.enterBtnCitizen}>
            <Text style={styles.enterBtnTextCitizen}>Open Citizen Portal</Text>
            <ArrowRight color="#FFFFFF" size={16} />
          </View>
        </TouchableOpacity>

        {/* Button 2: Contractor Portal */}
        <TouchableOpacity
          style={styles.roleCardContractor}
          onPress={() => setCurrentMode('CONTRACTOR')}
          activeOpacity={0.85}
        >
          <View style={styles.roleCardHeader}>
            <View style={styles.contractorIconCircle}>
              <HardHat color="#D97706" size={26} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.roleTitleContractor}>Contractor Field Crew</Text>
              <Text style={styles.roleSubBadgeContractor}>Work Orders & AI Evidence</Text>
            </View>
          </View>

          <Text style={styles.roleDesc}>
            View assigned work orders, verify ground lock distance (±50m), capture verified Before/After photos, and generate cryptographic expense memos.
          </Text>

          <View style={styles.enterBtnContractor}>
            <Text style={styles.enterBtnTextContractor}>Open Contractor Portal</Text>
            <ArrowRight color="#FFFFFF" size={16} />
          </View>
        </TouchableOpacity>

        {/* Bottom Footer Info */}
        <View style={styles.footerBox}>
          <Text style={styles.footerText}>
            CivicFix AI Mobile Client • Connects to FastAPI Backend on Port 8000
          </Text>
          <Text style={styles.footerSubText}>
            Host: {SERVER_HOST} ({backendOnline ? 'Online' : 'Checking...'})
          </Text>
        </View>
      </ScrollView>

      {/* Server Configuration Modal */}
      <ServerConfigModal
        visible={serverModalOpen}
        onClose={() => setServerModalOpen(false)}
        onSaved={checkHealth}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 14 : 38) : 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerScreenTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F766E',
    letterSpacing: -0.2,
  },
  serverHeaderBtn: {
    padding: 8,
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  landingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 14 : 38) : 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  serverSettingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  serverSettingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  landingContent: {
    padding: 18,
    gap: 18,
    paddingBottom: 36,
  },
  heroCard: {
    backgroundColor: '#0F766E',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#0F766E',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 100,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 10,
    color: '#CCFBF1',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroDescription: {
    fontSize: 11,
    color: '#CCFBF1',
    lineHeight: 17,
  },
  chooseSection: {
    marginTop: 4,
    gap: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSubheading: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  roleCardCitizen: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#99F6E4',
    gap: 12,
    shadowColor: '#0F766E',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  citizenIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitleCitizen: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
  },
  roleSubBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#14B8A6',
    marginTop: 1,
  },
  roleDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  enterBtnCitizen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    borderRadius: 12,
  },
  enterBtnTextCitizen: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  roleCardContractor: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 12,
    shadowColor: '#D97706',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  contractorIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitleContractor: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D97706',
  },
  roleSubBadgeContractor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 1,
  },
  enterBtnContractor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 12,
  },
  enterBtnTextContractor: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  footerBox: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerSubText: {
    fontSize: 10,
    color: '#CBD5E1',
    fontWeight: '500',
  },
});
