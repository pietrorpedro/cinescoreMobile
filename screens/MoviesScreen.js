import { useEffect, useRef, useState } from "react";
import { Animated, Button, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchMovieGenres, fetchMoviesByGenre, fetchMoviesByTitle } from "../services/api";
import CardComponent from './../components/CardComponent';

export default function MoviesScreen() {

    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const genresData = await fetchMovieGenres();
                setGenres(genresData);
            } catch (error) {
                console.log("Erro ao buscar os gêneros: ", error.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleSearchByGenre(genreId) {
        setLoading(true);
        try {
            const search = await fetchMoviesByGenre(genreId);
            setMovies(search);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch() {
        setLoading(true);
        try {
            const search = await fetchMoviesByTitle(searchInput);
            setMovies(search);
        } catch (error) {
            console.log("erro ao buscar: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    function toggleDrawer() {
        setIsDrawerOpen(!isDrawerOpen);
        Animated.timing(animatedHeight, {
            toValue: isDrawerOpen ? 0 : genres.length * 50, // ajuste a altura conforme necessário
            duration: 300,
            useNativeDriver: false,
        }).start();
    }

    if (loading) {
        return (
            <View style={styles.loading}>
                <Image source={require("../assets/loading.gif")} style={styles.loadingGif} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <Text variant="displayMedium">Buscar Filme</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        keyboardType="default"
                        style={styles.inputSearch}
                        placeholder="Pesquisar Filme"
                        value={searchInput}
                        onChangeText={setSearchInput}
                    />
                    <Button
                        title="Pesquisar"
                        style={styles.searchButton}
                        onPress={handleSearch}
                    />
                </View>

                {genres && (
                    <View>
                        <TouchableOpacity onPress={toggleDrawer} style={styles.drawerToggle}>
                            <Text>{isDrawerOpen ? "Fechar Gêneros" : "Abrir Gêneros"}</Text>
                        </TouchableOpacity>

                        <Animated.View style={[styles.drawer, { height: animatedHeight }]}>
                            {genres.map((genre, index) => (
                                <Button
                                    title={genre.name}
                                    key={index}
                                    onPress={() => handleSearchByGenre(genre.id)}
                                    style={styles.genreButton}
                                />
                            ))}
                        </Animated.View>
                    </View>
                )}

                {movies && (
                    <View style={styles.cardsContainer}>
                        {movies.map((movie) => (
                            <CardComponent
                                id={movie.id}
                                title={movie.title}
                                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                key={movie.id}
                                style={styles.card}
                            />
                        ))}
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
    drawerToggle: {
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: "#ddd",
        alignItems: "center",
        marginVertical: 10,
    },
    drawer: {
        overflow: "hidden",
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 10,
        flexDirection: "column",
        gap: 5,
    },
    genreButton: {
        width: "100%",
        marginVertical: 5,
    },
    inputSearch: {
        backgroundColor: "white",
        margin: 10
    },
    inputContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 10,
    },
    inputSearch: {
        flex: 2,
        marginRight: 10,
        backgroundColor: "white",
    },
    searchButton: {
        flex: 1,
    },
    cardsContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "100%",
        marginBottom: 10,
        alignItems: "center",
    },
});
