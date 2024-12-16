import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore"; // Importando as funções necessárias
import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const username = await fetchUsernameFromFirestore(user.uid);
                setUser({...user, username});
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email, password, username) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await saveUsernameInFirestore(user.uid, username);
        } catch (error) {
            console.error("Erro ao criar conta:", error.message);
            throw new Error(error.message);
        }
    };

    const signIn = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
            throw new Error(error.message);
        }
    };

    const saveUsernameInFirestore = async (uid, username) => {
        try {
            await setDoc(doc(db, "users", uid), { username });
        } catch (error) {
            console.error("Erro ao salvar o username:", error);
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erro ao fazer logout:", error.message);
        }
    };

    const fetchUsernameFromFirestore = async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                return userDoc.data().username;
            } else {
                console.log("Usuário não encontrado no Firestore");
                return null;
            }
        } catch (error) {
            console.error("Erro ao buscar o username:", error);
            return null;
        }
    }

    const fetchMovieReviews = async (movieId) => {
        try {
            const reviewsRef = collection(db, "reviews");  // Definindo a coleção "reviews"
            const q = query(reviewsRef, where("movieId", "==", String(movieId))); // Filtro por movieId
            const querySnapshot = await getDocs(q); // Obtendo os documentos
    
            const reviews = [];
            querySnapshot.forEach((doc) => {
                reviews.push(doc.data());
            });
            
            console.log(typeof(movieId))
            return reviews;
        } catch (error) {
            console.error("Erro ao buscar as críticas:", error);
            return [];
        }
    };

    const sendMovieReview = async (movieId, userId, review, rating, createdAt) => {
        try {
            const reviewRef = collection(db, "reviews");
            await addDoc(reviewRef, {
                movieId: String(movieId),
                userId: userId.uid,
                username: userId.username,
                review: review,
                rating: parseFloat(rating),
                createdAt: createdAt,
            });

            console.log("Crítica enviada com sucesso");
        } catch (error) {
            console.error("Erro ao enviar a crítica: " + error.message);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, logOut, fetchMovieReviews, sendMovieReview }}>
            {children}
        </AuthContext.Provider>
    );
    
};
