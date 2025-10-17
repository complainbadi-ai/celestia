
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface MessageBubbleProps {
  message: {
    text: string;
    sender: 'user' | 'ai';
  };
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const colorScheme = useColorScheme();
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.container, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
      <ThemedView
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].card,
            alignSelf: isUser ? 'flex-end' : 'flex-start',
          },
        ]}>
        <ThemedText style={{ color: isUser ? 'white' : Colors[colorScheme ?? 'light'].text }}>{message.text}</ThemedText>
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '70%',
  },
});
