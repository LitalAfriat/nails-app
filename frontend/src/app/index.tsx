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

import { useEmail } from "@/context/EmailContext"; 

const NailsAuthScreen: React.FC = () => {
    const {email, setEmail} = useEmail()

    // const [email, setEmail] = useState<string>("");
    const [errors, setErrors] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateForm = (): boolean => {
        let newErrors: string = "";
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors = "Invalid email";
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch("http://192.168.1.128:3000/sendEmailCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to send email code");
            }

            const data = await response.json(); 
            console.log("Success:", data);

            router.push({
                pathname: "../verification-code",
                params: { email },
            });

        } catch (err) {
            const error = err instanceof Error ? err.message : "Unknown error";
            alert(`Something went wrong. Error: ${error}`);
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
             
            <View style={styles.card}>
                <Text style={styles.title}>NailsPro</Text>
                <Text style={styles.subtitle}>Your beauty, our passion</Text>

                <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    value={email}
                    onChangeText={handleChange}
                />
                {errors ? (
                    <Text style={styles.error}>{errors}</Text>
                ) : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
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