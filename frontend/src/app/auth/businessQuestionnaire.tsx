import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function BusinessQuestionnaire() {
    const [name, onChangeName] = useState<string>("לדוגמה: לק ג'ל ליטל");
    const [address, onChangeAddress] = useState(
        "לדוגמה: רחוב הרצל 123, תל אביב",
    );
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>שאלון לבנית עמוד העסק</Text>
            <Text style={styles.baseText}>ספרו לנו קצת על העסק שלכם.</Text>
            <SafeAreaProvider>
                <SafeAreaView>
                    <Text style={styles.subtitle}>מה שם העסק שלך?</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeName}
                        value={name}
                    />
                    <Text style={styles.subtitle}>מה כתובת העסק?</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeAddress}
                        value={address}
                        placeholder="useless placeholder"
                        keyboardType="numeric"
                    />
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        alignItems: "center",
        backgroundColor: "#ffffff",
        flex: 1,
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    baseText: {
        padding: 8,
        marginBottom: 12,
        color: "#6B7280",
    },
    subtitle: {
        fontSize: 15,
        color: "#201f1f",
        marginBottom: 8,
        textAlign: "right",
        writingDirection: "rtl",
    },
    input: {
        height: 40,
        width: 300,
        marginBottom: 12,
        marginTop: 12,

        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        color: "#a6a6a8",
    },
});
