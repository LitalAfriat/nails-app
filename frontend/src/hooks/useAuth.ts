import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";

const TOKEN_KEY = "auth_token";

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading

    // Check token on app start
    useEffect(() => {
        const checkToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            setIsLoggedIn(!!token);
        };
        checkToken();
    }, []);

    const login = async (token: string) => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setIsLoggedIn(false);
    };

    return { isLoggedIn, login, logout };
}
