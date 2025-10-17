
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  loading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ value, onChangeText, onSend, loading }) => {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <TextInput
        style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Chat with the Wise One..."
        placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        editable={!loading}
      />
      <TouchableOpacity onPress={onSend} style={styles.sendButton} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={Colors[colorScheme ?? 'light'].tint} />
        ) : (
          <IconSymbol name="arrow.up.circle.fill" size={32} color={Colors[colorScheme ?? 'light'].tint} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
  },
});
