import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Server, CheckCircle2, X, RefreshCw } from 'lucide-react-native';
import { API_BASE_URL, SERVER_HOST, setCustomApiBaseUrl, checkBackendHealth } from '../api/client';

interface ServerConfigModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({ visible, onClose, onSaved }) => {
  const [hostInput, setHostInput] = useState(SERVER_HOST || 'http://localhost:8000');
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTestAndSave = async () => {
    setTesting(true);
    setTestStatus('idle');
    setCustomApiBaseUrl(hostInput);
    const ok = await checkBackendHealth();
    setTesting(false);
    if (ok) {
      setTestStatus('success');
      setTimeout(() => {
        onSaved();
        onClose();
      }, 600);
    } else {
      setTestStatus('error');
    }
  };

  const handleQuickSet = (url: string) => {
    setHostInput(url);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Server size={20} color="#0F766E" />
              <Text style={styles.title}>FastAPI Backend Settings</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            CivicFix AI mobile client connects to FastAPI backend and SQLite DB on port 8000.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Backend Server Host / IP:</Text>
            <TextInput
              style={styles.input}
              value={hostInput}
              onChangeText={setHostInput}
              placeholder="http://192.168.1.15:8000"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.presetsRow}>
            <TouchableOpacity
              style={styles.presetChip}
              onPress={() => handleQuickSet('http://localhost:8000')}
            >
              <Text style={styles.presetText}>localhost:8000</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.presetChip}
              onPress={() => handleQuickSet('http://10.0.2.2:8000')}
            >
              <Text style={styles.presetText}>10.0.2.2 (Android)</Text>
            </TouchableOpacity>
          </View>

          {testStatus === 'success' && (
            <View style={styles.successBanner}>
              <CheckCircle2 size={16} color="#047857" />
              <Text style={styles.successText}>Connected successfully to FastAPI Backend!</Text>
            </View>
          )}

          {testStatus === 'error' && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>
                ⚠️ Connection failed. Ensure `uvicorn app.main:app` is running and your phone is on the same Wi-Fi.
              </Text>
            </View>
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, testing && { opacity: 0.7 }]}
              onPress={handleTestAndSave}
              disabled={testing}
            >
              {testing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <RefreshCw size={14} color="#FFFFFF" />
                  <Text style={styles.saveText}>Test & Connect</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  hint: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#0F766E',
  },
  saveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
