import { Dimensions, Image, Pressable, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

export default function CardComponent({image, title, id}) {

    const navigation = useNavigation();

    function handleTouch() {
        navigation.navigate("Movie", {id})

    }

    return (
        <Pressable onPress={handleTouch}>
            <Card style={styles.card} >
                <Card.Content>
                    <Image
                        style={styles.cardImage}
                        source={{uri: image}}
                    />
                    <Text
                        variant={"titleLarge"}
                        style={styles.cardTitle}
                    >
                        {title}
                    </Text>
                </Card.Content>
            </Card>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get("window").width / 2 - 15,
        height: 400,
        marginBottom: 16,
    },
    cardImage: {
        width: "100%",
        height: 300,
        resizeMode: "contain",
    },
    cardTitle: {
        textAlign: "center",
    },
});