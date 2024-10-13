import React, { useState } from "react";
import "./Rating.css";

const Rating = ({ userRating, setUserRating, isSignedIn }) => { // Accepting isSignedIn as a prop
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleEmojiClick = (rating) => {
        if (isSignedIn) {
            setUserRating(userRating === rating ? 0 : rating);
        } else {
            alert("Please sign in to rate this movie. \n\nClick OK to go to the sign-in page.");
            // Redirect to sign-in page
            window.location.href = "/sign-in"; // Adjust this if your sign-in page is located elsewhere
        }
    };

    const renderEmojis = () => {
        const emojiUrl = "https://static-00.iconduck.com/assets.00/popcorn-emoji-327x512-4wgylinf.png";
        return (
            <div className="emojiRating">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <img
                        key={rating}
                        src={emojiUrl}
                        alt={`Rate ${rating}`}
                        className={`emoji ${userRating >= rating ? "selected" : ""}`}
                        style={{
                            opacity: userRating === 0 ? 0.3 : userRating >= rating ? 1 : hoveredRating >= rating ? 0.7 : 0.3,
                        }}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => handleEmojiClick(rating)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="userRatingSection">
            <div className="ratingTitle">Rate this Movie:</div>
            {renderEmojis()}
        </div>
    );
};

export default Rating;
