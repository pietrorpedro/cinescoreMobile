import { useContext, useEffect, useState } from "react";
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";
import { fetchMovieDetails } from "../services/api";

import { serverTimestamp } from "firebase/firestore";

export default function MovieScreen({ route }) {
    const { user, fetchMovieReviews, sendMovieReview } = useContext(AuthContext);
    const { id } = route.params;

    const [movieDetails, setMovieDetails] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [reviewInput, setReviewInput] = useState("");
    const [ratingInput, setRatingInput] = useState("");

    const [loading, setLoading] = useState(false);

    const [reviewError, setReviewError] = useState("");
    const [ratingError, setRatingError] = useState("");

    useEffect(() => {
        async function loadMovieDetails() {
            setLoading(true);
            try {
                const details = await fetchMovieDetails(id);
                setMovieDetails(details);
            } catch (error) {
                console.log("Error " + error.message);
            } finally {
                setLoading(false);
            }
        }

        async function loadMovieReviews() {
            try {
                const movieReviews = await fetchMovieReviews(id);
                setReviews(movieReviews);
            } catch (error) {
                console.log("Error " + error.message);
            }
        }

        loadMovieDetails();
        loadMovieReviews();
    }, [id]);

    function validateInputs() {
        let valid = true;

        const reviewRegex = /^[A-Za-z0-9][A-Za-z0-9\s\S]{9,}$/;  // Critica de pelo menos 10 caracteres e não começando com caracteres especiais
        const ratingRegex = /^[1-5]$/;  // Nota de 1 a 5

        if (!reviewRegex.test(reviewInput)) {
            setReviewError("A crítica deve ter pelo menos 10 caracteres e não pode começar com caracteres especiais.");
            valid = false;
        } else {
            setReviewError("");
        }

        if (!ratingRegex.test(ratingInput)) {
            setRatingError("A nota deve ser um número entre 1 e 5.");
            valid = false;
        } else {
            setRatingError("");
        }

        console.log(reviews)
        return valid;
    }

    async function handleSubmit() {
        if (validateInputs()) {
            console.log("Crítica e nota válidas, enviando...");
            await sendMovieReview(id, user, reviewInput, ratingInput, serverTimestamp());

            // Criar a nova crítica para adicionar ao estado sem recarregar
            const newReview = {
                review: reviewInput,
                rating: ratingInput,
                username: user.username, // ou o nome correto do usuário
                createdAt: serverTimestamp(), // data da crítica
            };

            // Atualiza a lista de críticas com a nova
            setReviews(prevReviews => [...prevReviews, newReview]);

            // limpar os campos de entrada
            setReviewInput("");
            setRatingInput("");
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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }}
                        style={styles.image}
                    />
                    <Text variant={"displayMedium"} style={styles.title}>
                        {movieDetails.title}
                    </Text>
                    <Text variant={"bodyLarge"}>
                        {movieDetails.overview}
                    </Text>
                </View>

                <View style={styles.reviews}>
                    <Text variant="displaySmall" style={styles.title}>Críticas</Text>
                    {user ? (
                        <>
                            <View style={styles.inputs}>
                                <TextInput
                                    label={"Crítica"}
                                    style={[styles.input, reviewError ? styles.inputError : null]}
                                    value={reviewInput}
                                    onChangeText={setReviewInput}
                                />
                                {reviewError && <Text style={styles.errorText}>{reviewError}</Text>}
                                <TextInput
                                    label={"Nota"}
                                    keyboardType="numeric"
                                    style={[styles.input, ratingError ? styles.inputError : null]}
                                    value={ratingInput}
                                    onChangeText={setRatingInput}
                                />
                                {ratingError && <Text style={styles.errorText}>{ratingError}</Text>}
                            </View>
                            <Button
                                title="Publicar"
                                style={styles.button}
                                onPress={handleSubmit}
                            />
                        </>
                    ) : (
                        <></>
                    )}

                    <View>
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <View key={index} style={styles.reviewItem}>
                                    <View>
                                        <Text variant="bodySmall">{review.username}</Text>
                                        <Text variant="bodySmall">
                                            {review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).toLocaleDateString("pt-BR") : "Data inválida"}
                                        </Text>
                                    </View>
                                    <Text variant="bodyLarge">{review.review}</Text>
                                    <Text variant="bodyMedium">Nota: {review.rating}</Text>
                                </View>
                            ))
                        ) : (
                            <Text variant="bodyLarge" style={styles.title}>Nenhuma crítica disponível. Publique uma!</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        marginTop: 70,
        flex: 1,
    },
    scrollContent: {
        padding: 10,
    },
    image: {
        width: "100%",
        height: 500,
        resizeMode: "cover",
    },
    title: {
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10,
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
    input: {
        backgroundColor: "white",
    },
    inputs: {
        flexDirection: "column",
        gap: 10,
        marginBottom: 10,
    },
    button: {
        padding: 10,
    },
    reviews: {
        marginTop: 20
    },
    reviewItem: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        marginVertical: 10,
    },
});
