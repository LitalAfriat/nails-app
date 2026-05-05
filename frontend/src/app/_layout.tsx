// app/_layout.tsx
import { Stack } from "expo-router";
import { EmailProvider } from '../context/EmailContext';

export default function Layout() {
    
  return  <EmailProvider>
  <Stack
        screenOptions={{
            headerShown: false,
        }}
    />
    </EmailProvider>
}
