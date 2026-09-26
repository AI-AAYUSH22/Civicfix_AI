import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CivicStatus } from '../types';

interface StatusPillProps {
  status: CivicStatus | string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'sm' }) => {
  const norm = (status || 'REPORTED').toUpperCase();

  let bg = '#F1F5F9';
  let text = '#475569';
  let border = '#CBD5E1';
  let label = status;

  if (norm === 'REPORTED') {
    bg = '#EFF6FF';
    text = '#1D4ED8';
    border = '#BFDBFE';
    label = 'Reported';
  } else if (norm === 'VALIDATED') {
    bg = '#F5F3FF';
    text = '#6D28D9';
    border = '#DDD6FE';
    label = 'Validated';
  } else if (norm === 'ASSIGNED') {
    bg = '#FEF3C7';
    text = '#B45309';
    border = '#FDE68A';
    label = 'Assigned';
  } else if (norm === 'REPAIRING' || norm === 'IN PROGRESS' || norm === 'UNDER REPAIR') {
    bg = '#FFF7ED';
    text = '#C2410C';
    border = '#FFEDD5';
    label = 'In Progress';
  } else if (norm === 'VERIFICATION' || norm === 'EVIDENCE SUBMITTED' || norm === 'AI VERIFICATION') {
    bg = '#F0FDFA';
    text = '#0F766E';
    border = '#99F6E4';
    label = 'AI Verification';
  } else if (norm === 'VERIFIED' || norm === 'VERIFIED_CLOSED' || norm === 'RESOLVED' || norm === 'CLOSED') {
    bg = '#ECFDF5';
    text = '#047857';
    border = '#A7F3D0';
    label = 'Verified & Closed';
  } else if (norm === 'NEEDS_REVIEW' || norm === 'NEEDS REVIEW') {
    bg = '#FEF2F2';
    text = '#B91C1C';
    border = '#FECACA';
    label = 'Needs Review';
  }

  const isSmall = size === 'sm';

  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: border, paddingVertical: isSmall ? 2 : 4, paddingHorizontal: isSmall ? 8 : 12 }]}>
      <Text style={[styles.text, { color: text, fontSize: isSmall ? 10 : 12 }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
