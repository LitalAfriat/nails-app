import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useLogin } from "@/context/LoginContext";
import { save } from "../../utils/SecureStore";

export default function VerificationScreen() {
    const OTP_LENGTH = 6;
    const RESEND_DELAY_SECONDS = 30;

    const router = useRouter();

    const { email, connectionType } = useLogin();

    const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [resendTimer, setResendTimer] = useState(RESEND_DELAY_SECONDS);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const inputs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        if (resendTimer === 0) return;

        const timer = setTimeout(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendTimer]);

    const handleInput = (
        index: number,
        value?: string,
        e?: { nativeEvent: { key: string } },
    ) => {
        if (value !== undefined) {
            if (!/^\d?$/.test(value)) return;

            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < OTP_LENGTH - 1) {
                inputs.current[index + 1]?.focus();
            }
        }

        if (e?.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);

        try {
            const verificationCode = code.join("");

            const res = await fetch("http://192.168.1.128:3000/checkCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    verificationCode,
                    email,
                    connectionType,
                }),
            });

            if (!res.ok) {
                throw new Error("שליחת קוד האימייל נכשל");
            } else {
                if (connectionType.current === "client") {
                    const data = await res.json();
                    const token = data.token;

                    await save(token, email, connectionType.current);
                    router.push({ pathname: "../(tabs_client)/client" });
                } else if (connectionType.current === "business") {
                    const data = await res.json();
                    const token = data.token;

                    await save(token, email, connectionType.current);
                    router.push({
                        pathname: "./businessQuestionnaire",
                    });
                } else {
                    router.push({ pathname: "../index" });
                }
            }
        } catch (err) {
            const error = err instanceof Error ? err.message : "שגיאה לא ידועה";
            Alert.alert(`שגיאה: ${error}.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        try {
            const response = await fetch(
                "http://192.168.1.128:3000/sendEmailCode",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                },
            );

            if (!response.ok) {
                throw new Error("שליחת קוד האימייל נכשלה");
            }
        } catch (err) {
            const error = err instanceof Error ? err.message : "שגיאה לא ידועה";
            Alert.alert(`שגיאה: ${error}.`);
        }

        setResendTimer(RESEND_DELAY_SECONDS);
    };

    return (
        <View style={styles.container}>
            <View style={styles.back}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.buttonB}
                >
                    <Text style={styles.text}>←</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>הזן קוד אימות</Text>

            <Text style={styles.subtitle}>{email} קוד נשלח אל</Text>

            <View style={styles.inputContainer}>
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.input}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        ref={(ref) => {
                            if (ref) {
                                inputs.current[index] = ref;
                            }
                        }}
                        onChangeText={(value) => handleInput(index, value)}
                        onKeyPress={(e) => handleInput(index, undefined, e)}
                        returnKeyType="send"
                    />
                ))}
            </View>

            {/* 🔁 Resend Section */}
            <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
                <Text
                    style={[
                        styles.resendText,
                        resendTimer > 0 && styles.disabledText,
                    ]}
                >
                    {resendTimer > 0
                        ? `שלח שוב את הקוד ב ${resendTimer}s`
                        : "שלח קוד מחדש"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>אימות</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fdf2f8",
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
    title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: "600",
        color: "#be185d",
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 20,
    },
    emailText: {
        fontWeight: "600",
        color: "#be185d",
    },
    inputContainer: {
        flexDirection: "row",
        gap: 10,
    },
    input: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        fontSize: 22,
        textAlign: "center",
    },
    resendText: {
        marginTop: 20,
        fontSize: 14,
        color: "#db2777",
        fontWeight: "500",
    },
    disabledText: {
        textAlign: "right",
        color: "#9ca3af",
    },
    button: {
        marginTop: 30,
        backgroundColor: "#db2777",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
