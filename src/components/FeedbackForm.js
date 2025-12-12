import React, { useState } from "react";

const FeedbackForm = () => {
  const [feedbackData, setFeedbackData] = useState({
    category: "Feedback",
    rating: 5,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFeedbackData({ category: "Feedback", rating: 5, message: "" });
    }, 1500);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl mt-12">
      {submitted ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Thanks for your Feedback!
          </h3>
          <p className="text-gray-400">
            We value your input and will use it to improve ServerPe.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Submit another response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Share Your Feedback
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              What is this about?
            </label>
            <select
              value={feedbackData.category}
              onChange={(e) =>
                setFeedbackData({ ...feedbackData, category: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="Feedback">General Feedback</option>
              <option value="Suggestion">Feature Suggestion</option>
              <option value="Bug">Report a Bug</option>
              <option value="Improvement">Improvement Idea</option>
              <option value="Query">Other Query</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Rate your experience
            </label>
            <div className="flex gap-4 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFeedbackData({ ...feedbackData, rating: star })
                  }
                  className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${
                    star <= feedbackData.rating
                      ? "text-yellow-400"
                      : "text-gray-600"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Your Message
            </label>
            <textarea
              required
              rows="4"
              value={feedbackData.message}
              onChange={(e) =>
                setFeedbackData({ ...feedbackData, message: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell us what you think..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-wait text-white py-3.5 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
