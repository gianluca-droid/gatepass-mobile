import { Pressable, StyleSheet, Text } from 'react-native';

import { GatePassColors } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'default' | 'large';
};

export function PrimaryButton({ label, onPress, variant = 'primary', size = 'default' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === 'large' ? styles.large : undefined,
        styles[variant],
        pressed ? styles.pressed : undefined,
      ]}>
      <Text
        style={[
          styles.label,
          size === 'large' ? styles.largeLabel : undefined,
          variant === 'neutral' ? styles.neutralLabel : undefined,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  large: {
    minHeight: 70,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  largeLabel: {
    fontSize: 20,
    fontWeight: '900',
  },
  neutralLabel: {
    color: GatePassColors.ink,
  },
  primary: {
    backgroundColor: GatePassColors.primary,
  },
  success: {
    backgroundColor: GatePassColors.success,
  },
  warning: {
    backgroundColor: GatePassColors.warning,
  },
  danger: {
    backgroundColor: GatePassColors.danger,
  },
  neutral: {
    backgroundColor: GatePassColors.surfaceSoft,
    borderColor: GatePassColors.border,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
