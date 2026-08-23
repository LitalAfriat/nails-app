import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLogin } from "../../../../context/LoginContext";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert,
    Pressable,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { load } from "../../../../utils/SecureStore";

export default function SettingsScreen() {
    const router = useRouter();

    const [email, setEmail] = useState<string | null>(null);
    const { logout } = useLogin();

    useEffect(() => {
        const fetchUser = async () => {
            const test = await load();
            setEmail(test.email);
        };
        fetchUser();
    }, []);

    const openWhatsApp = async () => {
        const phoneNumber = "972544405452";
        const message = "Hello! I need help with...";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert("שגיאה", "לא ניתן לפתוח את WhatsApp");
        }
    };

    const handleLogout = () => {
        logout();
        router.replace("../client");
    };

    const HorizontalLine = ({
        color = "#b1b1b151",
        thickness = 1,
        marginVertical = 5,
    }) => {
        return (
            <View
                style={{
                    height: thickness,
                    width: "100%",
                    backgroundColor: color,
                    marginVertical,
                }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>הגדרות</Text>

            <View style={styles.userContainer}>
                <Text style={styles.menuText}>{email ?? "Loading..."}</Text>
                <FontAwesome name="user-o" size={24} color="#be185d" />
            </View>

            <View style={styles.details}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={openWhatsApp}
                >
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={20}
                        color="#858585"
                    />

                    <View style={styles.menuContent}>
                        <Text style={styles.menuText}>עזרה ותמיכה</Text>
                        <FontAwesome5
                            name="whatsapp"
                            size={24}
                            color="#be185d"
                        />
                    </View>
                </TouchableOpacity>
                <HorizontalLine />

                <Pressable
                    style={styles.menuItem}
                    onPress={() => router.push("./termsOfUse")}
                >
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={20}
                        color="#858585"
                    />
                    <View style={styles.menuContent}>
                        <Text style={styles.menuText}>
                            תנאי שימוש ומדיניות פרטיות
                        </Text>
                        <Ionicons
                            name="help-circle-outline"
                            size={28}
                            color="#be185d"
                        />
                    </View>
                </Pressable>
                <HorizontalLine />
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleLogout}
                >
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={20}
                        color="#858585"
                    />
                    <View style={styles.menuContent}>
                        <Text style={styles.menuText}>התנתק</Text>
                        <MaterialIcons
                            name="logout"
                            size={24}
                            color="#be185d"
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        paddingTop: 100,
    },
    titleText: {
        padding: 20,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#be185d",
    },

    userContainer: {
        backgroundColor: "#cccccc42",
        margin: 10,
        marginBottom: 20,
        height: 62,
        paddingHorizontal: 10,
        borderRadius: 15,
        borderColor: "#c6c6c6",
        borderWidth: 1,
        fontSize: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    details: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 5,
        shadowColor: "#be185d",
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },

    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 18,
    },

    menuContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    menuText: {
        marginLeft: 12,
        fontSize: 18,
        color: "#000",
    },
});
