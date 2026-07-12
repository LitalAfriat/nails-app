import { useRouter } from "expo-router";
import { View, Button, Text } from "react-native";

export default function ProfileScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        router.replace("./login");
    };

    return (
        <View>
            <Text>Profile Page</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}
