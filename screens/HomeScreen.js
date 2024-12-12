import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import CardComponent from "../components/CardComponent";

import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPopularMovies } from "../services/api";

export default function HomeScreen() {

    const [popularMovies, setPopularMovies] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const movies = await fetchPopularMovies(10);
            setPopularMovies(movies);
        };
        fetchData();
    }, []);

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <Text
                    variant={"displayMedium"}
                    style={styles.title}
                >
                    Filmes em Alta
                </Text>
                <View
                    style={styles.cards}
                >
                    {popularMovies && (
                        popularMovies.map((movie) => (
                            <CardComponent
                                title={movie.title}
                                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                id={movie.id}
                                key={movie.id}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        textAlign: "center",
        marginBottom: 10,
        marginTop: 5
    },
    cards: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
});