import React, { useState } from "react";
import { router } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import { useLogin } from "@/context/LoginContext";

const NailsAuthScreen: React.FC = () => {
    const { email, setEmail } = useLogin();

    const [errors, setErrors] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { connection } = useLogin();

    const validateForm = (): boolean => {
        let newErrors: string = "";
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors = "נדרש אימייל";
        } else if (!emailRegex.test(email)) {
            newErrors = "אימייל לא חוקי";
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch(
                "http://192.168.1.128:3000/sendEmailCode",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, connection }),
                },
            );

            if (!response.ok) {
                throw new Error("שליחת קוד אימייל נכשלה");
            }

            const data = await response.json();
            console.log("Success:", data);

            router.push({
                pathname: "../verification-code",
            });
            console.log(connection);
        } catch (err) {
            const error = err instanceof Error ? err.message : "שגיאה לא ידועה";
            alert(`${error} משהו השתבש. שגיאה:`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (value: string) => {
        setEmail(value);
        setErrors("");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.back}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.buttonB}
                    >
                        <Text style={styles.text}>←</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>כניסה</Text>
                    <Text style={styles.subtitle}>
                        כדי להתחבר יש להכניס את כתובת המייל שלך
                    </Text>

                    <TextInput
                        placeholder="הכנס את אימייל שלך"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, { textAlign: "right" }]}
                        value={email}
                        onChangeText={handleChange}
                    />
                    {errors ? <Text style={styles.error}>{errors}</Text> : null}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>התחבר</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default NailsAuthScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        backgroundColor: "#fdf2f8",
        padding: 20,
    },
    back: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 55,
        paddingLeft: 16,
        zIndex: 10,
    },
    buttonB: {
        alignSelf: "flex-start",
    },
    text: {
        fontSize: 28,
        color: "#be185d",
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color: "#be185d",
        marginBottom: 8,
    },
    subtitle: {
        textAlign: "center",
        marginBottom: 20,
        color: "#555",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    error: {
        textAlign: "right",
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#db2777",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
