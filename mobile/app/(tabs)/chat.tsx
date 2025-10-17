import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Stack } from "expo-router";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

export default function ChatScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => <ThemeToggleButton />,
          title: "Chat",
        }}
      />
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText type="title">Chat</ThemedText>
      </ThemedView>
    </>
  );
}
