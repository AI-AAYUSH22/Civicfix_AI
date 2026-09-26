import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChannelBadgeProps {
  channel?: 'APP' | 'WHATSAPP' | 'REDDIT' | 'PORTAL' | 'TELEGRAM' | string;
  size?: 'sm' | 'md';
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({ channel = 'PORTAL', size = 'sm' }) => {
  const norm = (channel || 'PORTAL').toUpperCase();

  let bg = '#F1F5F9';
  let text = '#475569';
  let border = '#E2E8F0';
  let label = norm;

  if (norm === 'WHATSAPP') {
    bg = '#F0FDF4';
    text = '#15803D';
    border = '#BBF7D0';
    label = 'WhatsApp Bot';
  } else if (norm === 'APP' || norm === 'MOBILE') {
    bg = '#F0FDFA';
    text = '#0F766E';
    border = '#99F6E4';
    label = 'Mobile App';
  } else if (norm === 'REDDIT') {
    bg = '#FFF1F2';
    text = '#BE123C';
    border = '#FECDD3';
    label = 'Reddit Bot';
  } else if (norm === 'TELEGRAM') {
    bg = '#F0F9FF';
    text = '#0369A1';
    border = '#BAE6FD';
    label = 'Telegram Bot';
  } else {
    bg = '#F8FAFC';
    text = '#334155';
    border = '#CBD5E1';
    label = 'Citizen Portal';
  }

  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border, paddingVertical: isSmall ? 2 : 4, paddingHorizontal: isSmall ? 6 : 10 }]}>
      <Text style={[styles.text, { color: text, fontSize: isSmall ? 9 : 11 }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
