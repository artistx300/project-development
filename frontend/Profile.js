import React, { useEffect, useState } from 'react';
import './Profile.css';
import Cards from '../../components/card/card'; // Assuming you already have a Cards component to display movies.

const Profile = () => {
    const [toWatch, setToWatch] = useState([]);
    const [watched, setWatched] = useState([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('toWatch'); // State to toggle between lists

    useEffect(() => {
        const fetchUserMovies = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('You need to sign in to view your profile.');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/user/movies', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const data = await response.json();
                setToWatch(data.toWatch);
                setWatched(data.watched);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserMovies();
    }, []);

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {error && <p className="error">{error}</p>}
            
            <div className="buttons">
                <button
                    className={activeTab === 'toWatch' ? 'active' : ''}
                    onClick={() => setActiveTab('toWatch')}
                >
                    To-Watch
                </button>
                <button
                    className={activeTab === 'watched' ? 'active' : ''}
                    onClick={() => setActiveTab('watched')}
                >
                    Watched
                </button>
            </div>

            <div className="movie-lists">
                {activeTab === 'toWatch' && (
                    <div className="list">
                        <h3>To Watch</h3>
                        {toWatch.length === 0 ? (
                            <p>No movies to watch.</p>
                        ) : (
                            <div className="movie-grid">
                                {toWatch.map((movie) => (
                                    <Cards key={movie.id} movie={movie} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'watched' && (
                    <div className="list">
                        <h3>Watched</h3>
                        {watched.length === 0 ? (
                            <p>No watched movies.</p>
                        ) : (
                            <div className="movie-grid">
                                {watched.map((movie) => (
                                    <Cards key={movie.id} movie={movie} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
