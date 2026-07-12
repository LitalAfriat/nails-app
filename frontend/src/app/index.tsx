import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLogin } from "@/context/LoginContext";

export default function RoleSelectScreen() {
    const router = useRouter();
    const { connectionType } = useLogin();

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
                    <Text style={styles.title}>Nailsit</Text>
                </View>
                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            connectionType.current = "client";
                            router.push({
                                pathname: "../auth/login",
                            });
                        }}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.iconBox,
                                { backgroundColor: "#fff7eb" },
                            ]}
                        >
                            <Ionicons
                                name="person-outline"
                                size={26}
                                color="#6b3f05"
                            />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>לקוח</Text>
                            <Text style={styles.cardSubtitle}>
                                לקביעת תורים
                            </Text>
                        </View>
                        <Ionicons name="chevron-back" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            connectionType.current = "business";
                            router.push({
                                pathname: "../auth/login",
                            });
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
                                color="#1c7a6a"
                            />
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>בעל העסק</Text>
                            <Text style={styles.cardSubtitle}>
                                צפה בלוח הזמנים ונהל את המשימות שלך
                            </Text>
                        </View>
                        <Ionicons name="chevron-back" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.hint}>
                    ניתן להחליף תפקידים בכל עת דרך ההגדרות
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

    buttonsContainer: {
        width: "100%",
        gap: 14,
    },
    card: {
        flexDirection: "row-reverse",
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
        textAlign: "right",
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
    },
    cardSubtitle: {
        textAlign: "right",
        fontSize: 13,
        color: "#888",
    },
    hint: {
        fontSize: 12,
        color: "#aaa",
        textAlign: "center",
    },
});
