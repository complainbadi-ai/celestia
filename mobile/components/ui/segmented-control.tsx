
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';

interface SegmentedControlProps {
  segments: string[];
  currentIndex: number;
  onChange: (index: number) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ segments, currentIndex, onChange }) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();

  const segmentWidth = (width - 32) / segments.length;

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      {segments.map((segment, index) => (
        <TouchableOpacity
          key={segment}
          onPress={() => onChange(index)}
          style={[
            styles.segment,
            {
              backgroundColor: currentIndex === index ? Colors[colorScheme ?? 'light'].tint : 'transparent',
              width: segmentWidth,
            },
          ]}>
          <ThemedText style={{ color: currentIndex === index ? 'white' : Colors[colorScheme ?? 'light'].text }}>
            {segment}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    marginVertical: 16,
  },
  segment: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
});
