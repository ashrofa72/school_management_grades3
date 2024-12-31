// pages/review.js
import { useState } from 'react';
import ReactStars from 'react-rating-stars-component';

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [opinion, setOpinion] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          opinion,
        }),
      });

      if (response.ok) {
        setMessage('Review submitted successfully!');
        setRating(0);
        setOpinion('');
      } else {
        setMessage('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Submit Your Review
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="rating"
              className="block text-gray-700 font-semibold mb-2"
            >
              Rating (out of 5):
            </label>
            <div className="flex items-center space-x-2">
              <ReactStars
                count={5}
                value={rating}
                onChange={(newRating) => setRating(newRating)}
                size={30}
                isHalf={true} // Ensures 0.5 ratings are selectable
                activeColor="#ffd700"
              />
              <span className="text-gray-700 font-semibold">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="opinion"
              className="block text-gray-700 font-semibold mb-2"
            >
              Your Opinion:
            </label>
            <textarea
              id="opinion"
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share your thoughts..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
