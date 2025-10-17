
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { ParallaxScrollView } from '@/components/parallax-scroll-view';
import { MessageBubble } from '@/components/message-bubble';
import { MessageInput } from '@/components/message-input';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const ChatScreen = () => {
  const colorScheme = useColorScheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial message from the AI
    setMessages([
      { text: 'Welcome to the Wise One! I am here to help you.', sender: 'ai' },
    ]);
  }, []);

  const handleSend = async () => {
    if (message.trim() === '' || loading) return;

    const newMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [newMessage, ...prevMessages]); // Add to the beginning
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const aiMessage = { text: data.reply, sender: 'ai' };
      setMessages((prevMessages) => [aiMessage, ...prevMessages]); // Add to the beginning
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Sorry, something went wrong.', sender: 'ai' };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]); // Add to the beginning
    } finally {
      setLoading(false);
    }
  };

  const renderItem = useCallback(({ item }: { item: any }) => <MessageBubble message={item} />, []);
  const keyExtractor = useCallback((item: any, index: number) => index.toString(), []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <ThemedView style={styles.header}>
            <IconSymbol name="brain.head.profile" size={120} color={Colors[colorScheme ?? 'light'].tint} />
          </ThemedView>
        }>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>Chat with the Wise One</ThemedText>
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            inverted // Invert the list
          />
          <MessageInput value={message} onChangeText={setMessage} onSend={handleSend} loading={loading} />
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default ChatScreen;
