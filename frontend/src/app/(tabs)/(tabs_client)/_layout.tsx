import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#be185d",
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="client"
                options={{
                    title: "ראשי",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="setting/Settings"
                options={{
                    title: "הגדרות",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="cog" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="setting/termsOfUse"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
