// screens/RoleSelectScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLogin } from "@/context/LoginContext";

export default function RoleSelectScreen() {
    const router = useRouter();
    const { connection } = useLogin();

    const userType = () => {
        if (connection.current === "client") {
            router.push({
                pathname: "../login",
            });
        } else if (connection.current === "business") {
            router.push({
                pathname: "../login",
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inner}>
                {/* Logo / Header */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Ionicons
                            name="storefront-outline"
                            size={32}
                            color="#be185d"
                        />
                    </View>
                    <Text style={styles.title}>Welcome to Niles</Text>
                    <Text style={styles.subtitle}>
                        Who are you signing in as?
                    </Text>
                </View>
                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            connection.current = "client"; // ← set first
                            userType();
                        }}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.iconBox,
                                { backgroundColor: "#EBF4FF" },
                            ]}
                        >
                            <Ionicons
                                name="person-outline"
                                size={26}
                                color="#3B82F6"
                            />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>client</Text>
                            <Text style={styles.cardSubtitle}>
                                Make an Appointment & manage your orders
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#ccc"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            connection.current = "business";
                            userType();
                        }}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.iconBox,
                                { backgroundColor: "#EDFBF1" },
                            ]}
                        >
                            <Ionicons
                                name="briefcase-outline"
                                size={26}
                                color="#22C55E"
                            />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Employee</Text>
                            <Text style={styles.cardSubtitle}>
                                View schedule & manage your jobs
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#ccc"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.hint}>
                    You can switch roles anytime from settings
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        gap: 32,
    },
    header: {
        alignItems: "center",
        gap: 8,
    },
    logoCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#fdf2f8",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#be185d",
    },
    subtitle: {
        fontSize: 15,
        color: "#888",
    },
    buttonsContainer: {
        width: "100%",
        gap: 14,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#fff",
        gap: 14,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cardText: {
        flex: 1,
        gap: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
    },
    cardSubtitle: {
        fontSize: 13,
        color: "#888",
    },
    hint: {
        fontSize: 12,
        color: "#aaa",
        textAlign: "center",
    },
});
