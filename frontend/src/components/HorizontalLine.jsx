import React from "react";
import { View, StyleSheet } from "react-native";

const HorizontalLine = () => {
    return <View style={styles.line} />;
};

const styles = StyleSheet.create({
    line: {
        height: 1,
        width: "100%",
        backgroundColor: "#b1b1b151",
        marginVertical: 5,
        alignSelf: "center",
    },
});

export default HorizontalLine;

//TODO delete this file and apply whats in it in the right code.
