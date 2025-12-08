import { useState } from 'react';
import { useReviews } from '../context/ReviewContext';
import { useToast } from '../context/ToastContext';

const ReviewForm = ({ auctionId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const { createReview, loading } = useReviews();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      addToast('Please provide feedback for your review', 'warning');
      return;
    }

    try {
      await createReview({ rating, feedback, auctionId });
      addToast('Review submitted successfully!', 'success');
      setRating(5);
      setFeedback('');
      if (onSubmit) onSubmit();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit review', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1A1A1A] backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6">
      <h3 className="text-2xl font-bold text-[#F7F7F7] mb-6 tracking-wide">Leave a Review</h3>
      
      <div className="mb-6">
        <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
          RATING *
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-3xl focus:outline-none"
            >
              {star <= rating ? '★' : '☆'}
            </button>
          ))}
          <span className="ml-3 text-lg text-[#D4AF37] font-bold">{rating}/5</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-bold text-[#F7F7F7] mb-3 tracking-wide">
          YOUR FEEDBACK *
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your experience with this auction..."
          required
          rows={4}
          className="w-full px-6 py-4 bg-[#0D0D0D] border-2 border-[#D4AF37]/30 rounded-xl text-[#F7F7F7] text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all duration-300 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] rounded-xl font-bold text-lg tracking-wider hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50"
      >
        {loading ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
      </button>
    </form>
  );
};

export default ReviewForm;