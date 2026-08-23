import React from "react";
import { Text, StyleSheet, View } from "react-native";

const business = () => {
    return (
        <View>
            <Text style={styles.titleText}>hello business</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
