import { useContext, useState } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { AuthContext } from './../context/AuthContext';

export default function AuthScreen() {
    const { signUp, signIn } = useContext(AuthContext);
    const navigation = useNavigation();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");

    const [passwordSecure, setPasswordSecure] = useState(true);
    const [repeatPasswordSecure, setRepeatPasswordSecure] = useState(true);

    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    
    let valid = true;

    function validateInputs() {
        // reset
        valid = true;

        // - usernames can contain characters a-z, 0-9, underscores and periods.
        // - the username cannot start with a period nor end with a period.
        // - min length 5, max length is 16 chars.
        // - it must also not have more than one period sequentially.
        const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,16}$/;

        // - normal email regex
        const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

        // - at least 8 characters
        // - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
        // - can contain special characters
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        

        if (!usernameRegex.test(username) && !isLogin) {
            setUsernameError("Username inválido");
            valid = false;
        } else {
            setUsernameError("");
        }

        if (!emailRegex.test(email)) {
            setEmailError("Email inválido");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!passwordRegex.test(password)) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!isLogin && password !== repeatPassword) {
            setRepeatPasswordError("As senhas devem ser iguais");
            valid = false;
        } else {
            setRepeatPasswordError("");
        }

        return valid;
    }

    async function handleAuthentication() {
        if (validateInputs()) {
            setLoading(true);
            try {
                console.log([email, password, username])
                if (isLogin) {
                    await signIn(email, password);
                    alert("Login bem-sucedido");
                } else {
                    await signUp(email, password, username);
                    alert("Conta criada e login bem-sucedido");
                }
            } catch (error) {
                alert("Erro ao autenticar: " + error.message);
            } finally {
                setLoading(false);
                navigation.navigate("Home");
            }
        }
    }

    if (loading) {
        return (
            <View style={styles.loading}>
                <Image source={require("../assets/loading.gif")} style={styles.loadingGif} />
            </View>
        );
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text
                    variant="displayMedium"
                    style={styles.title}
                >
                    {isLogin ? "Entrar" : "Criar Conta"}
                </Text>
                <View style={styles.inputs}>
                    {!isLogin && (
                        <TextInput
                            label={"Nome de Usuário"}
                            style={[styles.input, usernameError ? styles.inputError : null]}
                            value={username}
                            onChangeText={setUsername}
                        />
                    )}
                    {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

                    <TextInput
                        label={"E-mail"}
                        style={[styles.input, emailError ? styles.inputError : null]}
                        value={email}
                        onChangeText={setEmail}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    
                    <TextInput
                        label={"Senha"}
                        secureTextEntry={passwordSecure}
                        style={[styles.input, passwordError ? styles.inputError : null]}
                        right={
                            <TextInput.Icon
                                icon={passwordSecure ? "eye-off" : "eye"}
                                onPress={() => setPasswordSecure(!passwordSecure)}
                            />
                        }
                        value={password}
                        onChangeText={setPassword}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    {!isLogin && (
                        <TextInput
                            label={"Confirmar Senha"}
                            secureTextEntry={repeatPasswordSecure}
                            style={[styles.input, repeatPasswordError ? styles.inputError : null]}
                            right={
                                <TextInput.Icon
                                    icon={repeatPasswordSecure ? "eye-off" : "eye"}
                                    onPress={() => setRepeatPasswordSecure(!repeatPasswordSecure)}
                                />
                            }
                            value={repeatPassword}
                            onChangeText={setRepeatPassword}
                        />
                    )}
                    {repeatPasswordError ? <Text style={styles.errorText}>{repeatPasswordError}</Text> : null}
                </View>

                <View style={styles.buttons}>
                    <Button
                        title={isLogin ? "Entrar" : "Criar Conta"}
                        onPress={handleAuthentication}
                    />

                    <Button
                        title={isLogin ? "Não tem uma conta?" : "Já possui uma conta?"}
                        onPress={() => setIsLogin(!isLogin)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    inputs: {
        flexDirection: "column",
        gap: 10,
        marginBottom: 10,
        padding: 10,
    },
    input: {
        backgroundColor: "white",
    },
    inputError: {
        borderBottomColor: "red",
        borderBottomWidth: 2,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 2,
    },
    title: {
        textAlign: "center",
        marginBottom: 10,
        marginTop: 5
    },
    buttons: {
        padding: 10,
        flexDirection: "column",
        gap: 10
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingGif: {
        width: 100,
        height: 100,
    },
});
