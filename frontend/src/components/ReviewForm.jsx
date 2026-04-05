import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, Loader2 } from 'lucide-react';

const ReviewForm = ({ onSubmit, loading = false }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !feedback.trim()) return;
    onSubmit({ rating, feedback });
    setRating(0);
    setFeedback('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-colors"
            >
              <Star
                className={`w-6 h-6 transition-all duration-200 ${
                  star <= (hoverRating || rating)
                    ? 'fill-gold text-gold drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]'
                    : 'text-text-muted'
                }`}
              />
            </motion.button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gold font-medium self-center">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your experience with this auction..."
          rows={3}
          className="glass-input resize-none"
          id="review-feedback"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || rating === 0 || !feedback.trim()}
        className="btn-gold-outline w-full"
        id="submit-review-btn"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Review
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;