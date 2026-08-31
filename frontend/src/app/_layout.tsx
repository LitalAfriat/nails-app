import { Stack } from "expo-router";
import { LoginProvider } from "../context/LoginContext";

export default function Layout() {
    return (
        <LoginProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </LoginProvider>
    );
}
