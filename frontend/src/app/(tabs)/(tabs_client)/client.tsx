import React, { forwardRef } from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchProps {
    func: (value: string) => void;
    focus?: boolean;
}

const Search = forwardRef<TextInput, SearchProps>(
    ({ func, focus = false }, ref) => {
        return (
            <View
                style={{
                    paddingTop: 100,
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    flex: 1,
                }}
            >
                <View
                    style={{
                        width: "85%",
                        shadowColor: "#be185d",

                        shadowRadius: 4,
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 5 },
                        backgroundColor: "#ffffff",

                        flexDirection: "row",
                        alignItems: "center",
                        height: 48,
                        paddingHorizontal: 24,
                        borderRadius: 999,
                    }}
                >
                    <Ionicons
                        name="search"
                        size={24}
                        color="gray"
                        style={{ marginRight: 8 }}
                    />
                    <TextInput
                        ref={ref}
                        style={{
                            flex: 1,
                            fontSize: 18,
                            textAlign: "auto",
                        }}
                        placeholder=" חיפוש בית עסק"
                        placeholderTextColor="gray"
                        onChangeText={func}
                        autoFocus={focus}
                    />
                </View>
            </View>
        );
    },
);

Search.displayName = "Search";
export default Search;
