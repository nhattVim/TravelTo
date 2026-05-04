"use client";

import { useState, useEffect } from "react";
import { ReviewResponse, PagedResponse } from "@/types/travel";
import { getTourReviews } from "@/lib/api/public";
import { createTourReview } from "@/lib/api/private";
import { Star, UserCircle2, Reply, MessageSquare } from "lucide-react";
import { formatDateVi } from "@/lib/format";

export function TourReviews({ tourId, token }: { tourId: number; token?: string }) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form states (Root Review)
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reply states
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyComment, setReplyComment] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const fetchReviews = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await getTourReviews(tourId, pageNum, 5);
      setReviews(data.items);
      setTotalElements(data.totalElements);
      setPage(data.page);
    } catch (err) {
      console.error("Lỗi khi tải đánh giá", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(0);
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Vui lòng đăng nhập để gửi");
      return;
    }

    if (!comment.trim()) {
      setErrorMsg("Vui lòng nhập nội dung");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload: any = { comment };
      if (rating !== null) {
        payload.rating = rating;
      }
      await createTourReview(token, tourId, payload);
      setSuccessMsg("Gửi thành công!");
      setComment("");
      setRating(null);
      fetchReviews(0);
    } catch (err: any) {
      setErrorMsg(err.message || "Đã có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!token) return;
    if (!replyComment.trim()) return;

    setIsReplying(true);
    try {
      await createTourReview(token, tourId, { comment: replyComment, parentId });
      setReplyComment("");
      setReplyingTo(null);
      fetchReviews(page);
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi khi gửi trả lời.");
    } finally {
      setIsReplying(false);
    }
  };

  const renderReview = (review: ReviewResponse, isReply = false) => (
    <div key={review.id} className={`bg-white p-6 rounded-2xl border border-gray-100 flex gap-4 ${isReply ? 'ml-0 md:ml-12 mt-4 bg-gray-50/50' : ''}`}>
      <div className="flex-shrink-0">
        {review.user.avatarUrl ? (
          <img src={review.user.avatarUrl} alt={review.user.fullName} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0a7d59] text-white rounded-full flex items-center justify-center font-bold text-lg">
            {review.user.fullName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-bold text-gray-900">{review.user.fullName}</h4>
            {!isReply && review.rating && (
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500">{formatDateVi(review.createdAt)}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
        
        {!isReply && token && (
          <div className="mt-3">
            <button 
              onClick={() => {
                setReplyingTo(replyingTo === review.id ? null : review.id);
                setReplyComment("");
              }}
              className="text-sm font-medium text-[#0a7d59] hover:text-[#085a41] flex items-center gap-1.5"
            >
              <Reply className="w-4 h-4" />
              {replyingTo === review.id ? "Hủy trả lời" : "Trả lời"}
            </button>
            
            {replyingTo === review.id && (
              <form onSubmit={(e) => handleReplySubmit(e, review.id)} className="mt-3 flex gap-2">
                <input 
                  type="text" 
                  value={replyComment}
                  onChange={(e) => setReplyComment(e.target.value)}
                  placeholder="Viết câu trả lời..." 
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#0a7d59] focus:border-transparent outline-none bg-white"
                  disabled={isReplying}
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={isReplying || !replyComment.trim()}
                  className="bg-[#0a7d59] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#085a41] disabled:opacity-50 transition"
                >
                  Gửi
                </button>
              </form>
            )}
          </div>
        )}

        {/* Render Replies */}
        {review.replies && review.replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-4 md:pl-6">
            {review.replies.map(reply => renderReview(reply, true))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-[#0a7d59]" /> 
        <h3 className="text-2xl font-bold text-gray-900">
          Đánh giá & Hỏi đáp ({totalElements})
        </h3>
      </div>

      {/* Review Form - Only show if logged in */}
      {token ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 mb-8">
          <h4 className="font-semibold text-lg text-gray-900 mb-6">Viết đánh giá hoặc đặt câu hỏi</h4>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <span className="text-sm font-medium text-gray-700">Chất lượng:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        rating && star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-200"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>
            {rating !== null && (
              <button 
                type="button" 
                onClick={() => setRating(null)}
                className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline"
              >
                Bỏ đánh giá sao (Chỉ bình luận)
              </button>
            )}
          </div>

          <textarea
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:bg-white focus:ring-2 focus:ring-[#0a7d59] focus:border-transparent outline-none transition-all resize-none text-gray-800 placeholder:text-gray-400 mb-2"
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn hoặc đặt câu hỏi về tour này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />

          {errorMsg && <p className="text-red-500 text-sm font-medium mb-4">{errorMsg}</p>}
          {successMsg && <p className="text-[#0a7d59] text-sm font-medium mb-4">{successMsg}</p>}

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0a7d59] hover:bg-[#085a41] text-white font-medium px-8 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-8 rounded-2xl text-center mb-8 border border-gray-100">
          <p className="text-gray-600 font-medium">Vui lòng đăng nhập để có thể đánh giá và bình luận.</p>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {loading && <div className="text-center text-gray-500 py-8 font-medium">Đang tải đánh giá...</div>}
        
        {!loading && reviews.length === 0 && (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
            <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-base font-medium">Chưa có đánh giá nào.</p>
            <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên chia sẻ trải nghiệm về tour này!</p>
          </div>
        )}

        {reviews.map((review) => renderReview(review, false))}

        {/* Pagination */}
        {totalElements > 5 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => fetchReviews(page - 1)}
              disabled={page === 0}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Trang trước
            </button>
            <button
              onClick={() => fetchReviews(page + 1)}
              disabled={(page + 1) * 5 >= totalElements}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
