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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <Text
                    variant={"displayMedium"}
                    style={styles.title}
                >
                    Filmes em Alta!
                </Text>
                <View style={styles.cards}>
                    {popularMovies && popularMovies.map((movie) => (
                        <View style={styles.card} key={movie.id}>
                            <CardComponent
                                title={movie.title}
                                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                id={movie.id}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 10,
    },
    title: {
        textAlign: "center",
        marginBottom: 10,
        marginTop: 5,
    },
    cards: {
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center"
    },
    card: {
        width: '100%',
        marginBottom: 10,
        alignItems: "center",
    },
});
