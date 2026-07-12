import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { LoginProvider } from "../context/LoginContext";
import { load } from "../utils/SecureStore";

export default function Layout() {
    const router = useRouter();

    useEffect(() => {
        load().then(async (test) => {
            if (test.email && test.token) {
                const token = test.token;
                const email = test.email;

                const res = await fetch(
                    "http://192.168.1.128:3000/checkTokenEmail",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email,
                            token,
                        }),
                    },
                );

                if (res.ok) {
                    router.push({ pathname: "../(tabs_client)/client" });
                }
            } else {
                router.push({ pathname: "../index" });
            }
        });
    }, [router]);

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
