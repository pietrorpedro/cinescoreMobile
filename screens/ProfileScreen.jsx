import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
    const { user, logOut } = useContext(AuthContext);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            if (!user) {
                navigation.navigate("Auth");
            }
        }, [user, navigation])
    );

    async function handleLogout() {
        await logOut();
        navigation.navigate("Auth");
    }

    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text>
            {user ? (
                <>
                    <Text>Username: {user.username}</Text>
                    <Button title="Logout" onPress={handleLogout} />
                </>
            ) : (
                <Text>Carregando...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
