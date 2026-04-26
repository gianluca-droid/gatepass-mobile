import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GatePassColors } from '@/constants/theme';

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function GatePassScreen({ title, subtitle, children }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.brand}>GatePass</ThemedText>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {subtitle ? <ThemedText style={styles.subtitle}>{subtitle}</ThemedText> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GatePassColors.surfaceSoft,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 18,
  },
  header: {
    gap: 5,
    paddingTop: 8,
  },
  brand: {
    color: GatePassColors.primary,
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: GatePassColors.ink,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  subtitle: {
    color: GatePassColors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
});
