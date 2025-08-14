import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth/signup"
        options={{
          title: "Signup",
        }}
      />
      <Stack.Screen
        name="auth/login"
        options={{
          title: "Login",
        }}
      />
    </Stack>
  );
}
