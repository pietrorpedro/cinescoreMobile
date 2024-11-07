import axios from "axios";

const apiAuth = process.env.API_AUTH;

export async function fetchMovieGenres() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=pt-br';
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiAuth}`
        }
    };

    try {
        const response = await axios.get(url, options);
        return response.data.genres;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

// TODO: Colocar na main depois
export async function fetchPopularMovies(limit = 10) {
    const url = 'https://api.themoviedb.org/3/movie/popular';
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiAuth}`
        }
    };

    try {
        const response = await axios.get(url, options);
        const results = response.data.results;

        return results.slice(0, limit);
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export async function fetchMoviesByGenre(genreId) {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=pt-br&page=1&sort_by=popularity.desc&with_genres=${genreId}`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiAuth}`
        }
    };

    try {
        const response = await axios.get(url, options);
        return response.data.results;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export async function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=pt-br`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiAuth}`
        }
    };

    try {
        const response = await axios.get(url, options);
        return response.data;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export async function fetchMoviesByTitle(title) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiAuth}`
        }
    };

    try {
        const response = await axios.get(url, options);
        const movies = response.data.results;

        // cria um objeto com os dados do filme buscado e coloca a url da img
        const moviesWithImages = await Promise.all(movies.map(async (movie) => {
            const imagesResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images`, options);
            return {
                ...movie,
                images: imagesResponse.data.backdrops,
            };
        }));

        return moviesWithImages;
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}

export async function fetchMovieTitle(movieId) {
    const movieDetails = await fetchMovieDetails(movieId);
    return movieDetails.title;
}