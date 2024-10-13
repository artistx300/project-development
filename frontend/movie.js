import React, { useEffect, useState } from "react";
import "./movie.css";
import { useParams } from "react-router-dom";
import Rating from "../../components/ratingsys/Rating";
import ReviewSection from "../../components/reviewsec/ReviewSection"; // Importing the ReviewSection component
import Watchlist from "../../components/watchlist/watchlist"; // Importing the Watchlist component

const Movie = () => {
    const [currentMovieDetail, setMovie] = useState();
    const [availablePlatforms, setAvailablePlatforms] = useState({});
    const [userRating, setUserRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [isWatched, setIsWatched] = useState(false);
    const [isToWatch, setIsToWatch] = useState(false);
    const { id } = useParams();
    const userId = "currentUserId"; // Replace with actual user ID from auth context or state

    // Assuming you have a method to determine if the user is authenticated
    const isAuthenticated = true; // Replace with actual authentication logic

    useEffect(() => {
        getData();
        window.scrollTo(0, 0);
    }, []);

    const getData = () => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
            .then(res => res.json())
            .then(data => {
                setMovie(data);
                getAvailablePlatforms(data.id);
            });
    };

    const getAvailablePlatforms = (movieId) => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=4e44d9029b1270a757cddc766a1bcb63`)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results.IN) {
                    setAvailablePlatforms(data.results.IN);
                } else {
                    setAvailablePlatforms(null);
                }
            });
    };

    return (
        <div className="movie">
            <div className="movie__intro">
                <img
                    className="movie__backdrop"
                    src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.backdrop_path : ""}`}
                    alt="Movie Backdrop"
                />
            </div>
            <div className="movie__detail">
                <div className="movie__detailLeft">
                    <div className="movie__posterBox">
                        <img
                            className="movie__poster"
                            src={`https://image.tmdb.org/t/p/original${currentMovieDetail ? currentMovieDetail.poster_path : ""}`}
                            alt="Movie Poster"
                        />
                    </div>
                </div>
                <div className="movie__detailRight">
                    <div className="movie__detailRightTop">
                        <div className="movie__name">{currentMovieDetail ? currentMovieDetail.original_title : ""}</div>
                        <div className="movie__tagline">{currentMovieDetail ? currentMovieDetail.tagline : ""}</div>
                        <div className="movie__rating">
                            {currentMovieDetail ? currentMovieDetail.vote_average.toFixed(1) : ""} <i className="fas fa-star" />
                            <span className="movie__voteCount">{currentMovieDetail ? "(" + currentMovieDetail.vote_count + ") votes" : ""}</span>
                        </div>
                        <div className="movie__runtime">{currentMovieDetail ? currentMovieDetail.runtime + " mins" : ""}</div>
                        <div className="movie__releaseDate">{currentMovieDetail ? "Release date: " + currentMovieDetail.release_date : ""}</div>
                        <div className="movie__genres">
                            {currentMovieDetail && currentMovieDetail.genres
                                ? currentMovieDetail.genres.map(genre => (
                                    <span className="movie__genre" key={genre.id}>{genre.name}</span>
                                ))
                                : ""
                            }
                        </div>
                    </div>
                    <div className="movie__detailRightBottom">
                        <div className="synopsisText">Synopsis</div>
                        <div>{currentMovieDetail ? currentMovieDetail.overview : ""}</div>
                    </div>

                    <div className="movie__platforms">
                        <div className="platforms__heading">Available Platforms:</div>
                        <div className="platforms__list">
                            {availablePlatforms && availablePlatforms.flatrate ? (
                                availablePlatforms.flatrate.map(platform => (
                                    <span key={platform.provider_id} className="platform__item">
                                        <img src={`https://image.tmdb.org/t/p/original${platform.logo_path}`} alt={platform.provider_name} className="platform__logo" />
                                        <span>{platform.provider_name}</span>
                                    </span>
                                ))
                            ) : (
                                <div>No platforms available for this movie in India</div>
                            )}
                        </div>
                    </div>

                    <Rating userRating={userRating} setUserRating={setUserRating} />

                    {/* Updated Watchlist component with authentication check */}
                    <Watchlist
                        isWatched={isWatched}
                        setIsWatched={setIsWatched} // Pass setIsWatched
                        isToWatch={isToWatch}
                        setIsToWatch={setIsToWatch} // Pass setIsToWatch
                        isAuthenticated={isAuthenticated} // Pass isAuthenticated prop
                    />

                    {/* Review Section component added here */}
                    <ReviewSection reviews={reviews} setReviews={setReviews} />

                </div>
            </div>
        </div>
    );
};

export default Movie;
