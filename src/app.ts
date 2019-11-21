// @ts-ignore
import movieIds from './data.json';

interface movieId {
    imdb: string;
    youtube: string;
}

interface Movie {
    Actors: String;
    Awards: String;
    BoxOffice: String;
    Country: String;
    DVD: String;
    Director: String;
    Genre: String;
    Language: String;
    Metascore: String;
    Plot: String;
    Poster: String;
    Production: String;
    Rated: String;
    Ratings: object[];
    Released: String;
    Response: String;
    Runtime: String;
    Title: String;
    Type: String;
    Website: String;
    Writer: String;
    Year: String;
    imdbID: String;
    imdbRating: String;
    imdbVotes: String;
    YouTube: String;
    ReleasedAgo: String;
}

/**
 * Fetch movie data from IMDB yet keep YouTube Id
 *
 * @param movies Array of movieId
 */
function fetchMovieData(movies: movieId[]): Promise<ImdbMovie[]> {
    const relativeTime = new Intl.RelativeTimeFormat('da');

    const getMovieData = movie =>
        fetch(
            `https://www.omdbapi.com/?i=${movie.imdb}&apikey=${process.env.OMDB_API}`
        )
            .then(res => res.json())
            .then(data => ({
                ...data,
                YouTube: movie.youtube,
                ReleasedAgo: relativeTime.format(
                    new Date(data.Released).getFullYear() -
                        new Date().getFullYear(),
                    'years'
                ),
            }));

    return Promise.all(movies.map(movie => getMovieData(movie)));
}

/**
 * Populate movies to DOM
 *
 * @param movies Array of Movie
 */
function populateMoviesToDOM(movies: Movie[]) {
    const placeholder = document.querySelector('[data-movies]');

    const template = `
        <img src="{{ Poster }}" class="movie__image" />
        <div class="movie__description">
            <h2>{{ Title }}</h2>
            <p>{{ Plot }}</p>
            <p>IMDB rating: {{ imdbRating }}</p>
            <p>Released {{ ReleasedAgo }}</p>
            <p>{{ Actors }}</p>
            <p>{{ Awards }}</p>
        </div>
        <iframe
            class="movie__trailer"
            width="100%"
            height="auto"
            src="https://www.youtube-nocookie.com/embed/{{ YouTube }}"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
        `;

    movies.map((movie: Movie) => {
        const article = document.createElement('article');
        article.classList.add('movie');
        article.innerHTML = template.replace(
            /{{ (.+) }}/g,
            (match, name) => movie[name].toString() || null
        );
        placeholder.append(article);
    });
}

// Kick off once page's ready!
document.addEventListener('DOMContentLoaded', () => {
    fetchMovieData(movieIds).then(movies => populateMoviesToDOM(movies));
});
