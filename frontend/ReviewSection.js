import React, { useState, useEffect } from "react";
import "./ReviewSection.css";

const ReviewSection = ({ reviews, setReviews }) => {
    const [reviewText, setReviewText] = useState("");
    const [isSpoiler, setIsSpoiler] = useState(false); // Tracks if the review is marked as a spoiler
    const [reportCounts, setReportCounts] = useState(Array(reviews.length).fill(0)); // Tracks report count for each review
    const [spoilerVisible, setSpoilerVisible] = useState(Array(reviews.length).fill(false)); // Tracks spoiler visibility for each review
    const [isSignedIn, setIsSignedIn] = useState(false); // Tracks if the user is signed in

    useEffect(() => {
        // Check if user is signed in by looking for a JWT token in localStorage
        const token = localStorage.getItem("token");
        setIsSignedIn(!!token); // If token exists, the user is signed in
    }, []);

    const handleReviewSubmit = () => {
        if (reviewText.trim() === "") return; // Prevent empty reviews

        const newReview = { text: reviewText, spoiler: isSpoiler, reports: 0 };

        // Update reviews
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);

        // Update report counts and spoiler visibility array
        const updatedReportCounts = [...reportCounts, 0]; // Add a new entry for the new review
        const updatedSpoilerVisibility = [...spoilerVisible, false]; // Add a new entry for spoiler visibility

        setReportCounts(updatedReportCounts);
        setSpoilerVisible(updatedSpoilerVisibility);

        setReviewText(""); // Reset the input field
        setIsSpoiler(false); // Reset spoiler option
    };

    const handleReportReview = (index) => {
        const updatedReports = [...reportCounts];
        updatedReports[index] += 1; // Increment report count for the review
        setReportCounts(updatedReports);
    };

    const toggleSpoilerVisibility = (index) => {
        const updatedVisibility = [...spoilerVisible];
        updatedVisibility[index] = !updatedVisibility[index]; // Toggle spoiler visibility
        setSpoilerVisible(updatedVisibility);
    };

    return (
        <div className="reviewSection">
            <div className="reviewText">Reviews</div>
            
            {/* Conditionally show review form only if user is signed in */}
            {isSignedIn ? (
                <>
                    <textarea
                        className="reviewInput"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                    />
                    <div className="spoilerOption">
                        <label>
                            <input
                                type="radio"
                                checked={isSpoiler}
                                onChange={() => setIsSpoiler(!isSpoiler)}
                            />
                            Mark as Spoiler
                        </label>
                    </div>
                    <button className="submitReview" onClick={handleReviewSubmit}>
                        Submit
                    </button>
                </>
            ) : (
                <div className="loginPrompt">
                    Please <a href="/sign-in">sign in</a> to write and submit reviews.
                </div>
            )}

            <div className="reviewsList">
                {reviews.map((review, index) => (
                    <div key={index} className="reviewItem">
                        {/* Display the review text, either blurred or visible based on spoiler setting */}
                        <div className={review.spoiler && !spoilerVisible[index] ? "spoilerBlur" : ""}>
                            {review.text}
                        </div>
                        {review.spoiler && !spoilerVisible[index] && (
                            <button className="showSpoilerButton" onClick={() => toggleSpoilerVisibility(index)}>
                                Show Spoiler
                            </button>
                        )}
                        
                        {/* Conditionally show report button only if user is signed in */}
                        {isSignedIn && (
                            <button
                                className="reportButton"
                                onClick={() => handleReportReview(index)}
                            >
                                Report
                            </button>
                        )}

                        <span className="reportCount">Reports: {reportCounts[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;
