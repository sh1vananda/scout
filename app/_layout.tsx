import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#111" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="request/index"
          options={{ presentation: "modal", gestureEnabled: true }}
        />
        <Stack.Screen name="task/[id]" />
      </Stack>
    </>
  );
}
