import React from "react";
import { Text, StyleSheet, View } from "react-native";

const business = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>hello business</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    baseText: {
        fontFamily: "Cochin",
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default business;
