import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { LoginProvider } from "../context/LoginContext";
import { load } from "../utils/SecureStore";

export default function Layout() {
    const router = useRouter();

    useEffect(() => {
        load().then(async (loginInfo) => {
            if (
                loginInfo.email &&
                loginInfo.token &&
                loginInfo.connectionType
            ) {
                const body = JSON.stringify({
                    email: loginInfo.email,
                    token: loginInfo.token,
                    connectionType: loginInfo.connectionType,
                });
                const res = await fetch(
                    "http://192.168.1.128:3000/checkTokenEmail",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: body,
                    },
                );

                const respond = await res.json();

                if (res.ok && respond.success) {
                    if (respond.connectionType === "client") {
                        router.push({ pathname: "../(tabs_client)/client" });
                    } else if (respond.connectionType === "business") {
                        router.push({
                            pathname: "../(tabs_business)/businessOwner",
                        });
                    } else {
                        console.log("Wrong password.");
                    }
                } else {
                    return;
                }
            } else {
                router.push({
                    pathname: "./app/index",
                });
            }
        });
        //TODO plz understand the router below.
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
