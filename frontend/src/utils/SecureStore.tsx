import * as SecureStore from "expo-secure-store";

export { save, load };

async function save(
    token: string,
    email: string,
    connectionType: string,
): Promise<void> {
    await SecureStore.setItemAsync("1", token);
    await SecureStore.setItemAsync("2", email);
    await SecureStore.setItemAsync("3", connectionType);
}

async function load(): Promise<{
    token: string | null;
    email: string | null;
    connectionType: string | null;
}> {
    let token = await SecureStore.getItemAsync("1");
    let email = await SecureStore.getItemAsync("2");
    let connectionType = await SecureStore.getItemAsync("3");

    return { token, email, connectionType };
}
