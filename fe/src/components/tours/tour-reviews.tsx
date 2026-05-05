"use client";

import { useState, useEffect } from "react";
import { ReviewResponse, PagedResponse } from "@/types/travel";
import { getTourReviews } from "@/lib/api/public";
import { createTourReview } from "@/lib/api/private";
import { Star, Reply, MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import { formatDateVi } from "@/lib/format";

export function TourReviews({ tourId, token }: { tourId: number; token?: string }) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const currentUserId = currentUser?.id;
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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
    if (token) {
      import('@/lib/api/private').then(({ getUserProfile }) => {
        getUserProfile(token).then(user => setCurrentUser(user)).catch(() => {});
      });
    }
  }, [tourId, token]);

  const handleDelete = async (reviewId: number) => {
    if (!token || !confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    try {
      const { deleteTourReview } = await import('@/lib/api/private');
      await deleteTourReview(token, tourId, reviewId);
      fetchReviews(page);
    } catch (err: any) {
      alert(err.message || "Lỗi khi xóa bình luận");
    }
  };

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

  const Avatar = ({ user, isReply }: { user: any, isReply: boolean }) => {
    const [imgError, setImgError] = useState(false);
    const sizeClass = isReply ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base';
    
    if (user.avatarUrl && !imgError) {
      return (
        <img 
          src={user.avatarUrl} 
          alt={user.fullName} 
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          className={`rounded-full object-cover flex-shrink-0 bg-white z-10 relative ${sizeClass}`} 
        />
      );
    }
    
    return (
      <div className={`bg-[#0a7d59] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 ring-2 ring-white z-10 relative ${sizeClass}`}>
        {(user?.fullName || user?.name || "?").charAt(0).toUpperCase()}
      </div>
    );
  };

  const ReviewNode = ({ review, depth = 0, isLast = true }: { review: ReviewResponse, depth?: number, isLast?: boolean }) => {
    const isReply = depth > 0;
    const curveWidth = depth === 1 ? 32 : 28;
    const contentMargin = isReply ? 'ml-[44px]' : 'ml-[52px]';

    return (
      <div className={`relative ${isReply ? 'mt-3' : 'mt-6'}`}>
        
        {isReply && (
          <div 
            className="absolute border-l-2 border-b-2 border-gray-200 rounded-bl-xl z-0"
            style={{
               left: `-${curveWidth}px`, 
               width: `${curveWidth}px`, 
               top: '-12px',
               height: '28px'
            }}
          />
        )}
        
        {isReply && !isLast && (
          <div 
            className="absolute border-l-2 border-gray-200 z-0"
            style={{
               left: `-${curveWidth}px`,
               top: '16px',
               bottom: '-12px'
            }}
          />
        )}

        <div className="flex gap-3 relative z-10">
          {review.replies && review.replies.length > 0 && (
            <div 
              className="absolute w-[2px] bg-gray-200 z-0"
              style={{
                top: isReply ? '32px' : '40px',
                bottom: '-12px',
                left: isReply ? '16px' : '20px',
                transform: 'translateX(-50%)'
              }}
            />
          )}

          <div className="flex flex-col items-center flex-shrink-0 relative">
            <Avatar user={review.user} isReply={isReply} />
          </div>
          
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex justify-between items-start">
              <div className="flex items-baseline gap-2">
                <span className={`font-semibold text-gray-900 ${isReply ? 'text-sm' : 'text-[15px]'}`}>@{review.user.fullName.replace(/\s+/g, '')}</span>
                <span className="text-xs text-gray-500">{formatDateVi(review.createdAt)}</span>
              </div>
              
              {currentUserId === review.user.id && (
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === review.id ? null : review.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {openMenuId === review.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                      <button 
                        onClick={() => {
                          setOpenMenuId(null);
                          handleDelete(review.id);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            
            <p className={`text-gray-800 leading-relaxed whitespace-pre-wrap mt-1 ${isReply ? 'text-sm' : 'text-[15px]'}`}>{review.comment}</p>
            
            {review.rating ? (
              <div className="flex gap-1 mt-1.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < review.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
            ) : null}
            
            {token && (
              <div className="mt-2">
                <button 
                  onClick={() => {
                    setReplyingTo(replyingTo === review.id ? null : review.id);
                    setReplyComment("");
                  }}
                  className="text-[13px] font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition"
                >
                  Phản hồi
                </button>
                
                {replyingTo === review.id && (
                  <form onSubmit={(e) => handleReplySubmit(e, review.id)} className="mt-2 flex gap-2">
                    <input 
                      type="text" 
                      value={replyComment}
                      onChange={(e) => setReplyComment(e.target.value)}
                      placeholder="Viết phản hồi..." 
                      className="flex-1 border-b border-gray-300 bg-transparent px-2 py-1 text-sm focus:border-gray-900 outline-none transition-colors"
                      disabled={isReplying}
                      autoFocus
                    />
                    <button 
                      type="submit" 
                      disabled={isReplying || !replyComment.trim()}
                      className="text-white bg-gray-900 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                      Gửi
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {review.replies && review.replies.length > 0 && (
          <div className={contentMargin}>
            {review.replies.map((reply, index) => 
              <ReviewNode 
                key={reply.id} 
                review={reply} 
                depth={depth + 1} 
                isLast={index === review.replies!.length - 1} 
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-[#0a7d59]" /> 
        <h3 className="text-2xl font-bold text-gray-900">
          Đánh giá & Hỏi đáp ({totalElements})
        </h3>
      </div>

      {/* Review Form - Compact YouTube style */}
      {token && currentUser ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex gap-4">
            <Avatar user={{ avatarUrl: currentUser.avatarUrl, fullName: currentUser.fullName }} isReply={false} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[13px] font-medium text-gray-500">Đánh giá:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          rating && star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-200"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                {rating !== null && (
                  <button 
                    type="button" 
                    onClick={() => setRating(null)}
                    className="text-[12px] font-medium text-red-500 hover:text-red-700 hover:underline ml-1"
                  >
                    Bỏ sao
                  </button>
                )}
              </div>
              
              <input
                className="w-full bg-transparent border-b border-gray-300 px-2 py-1.5 text-[15px] text-gray-800 focus:border-gray-900 focus:outline-none transition-colors placeholder:text-gray-500 disabled:opacity-50"
                placeholder="Viết bình luận... (Nhấn Enter để gửi)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (comment.trim()) handleSubmit(e);
                  }
                }}
              />
            </div>
          </div>
          
          {errorMsg && <p className="text-red-500 text-sm font-medium mt-2 ml-14">{errorMsg}</p>}
          {successMsg && <p className="text-[#0a7d59] text-sm font-medium mt-2 ml-14">{successMsg}</p>}
        </form>
      ) : !token ? (
        <div className="bg-gray-50 p-8 rounded-2xl text-center mb-8 border border-gray-100">
          <p className="text-gray-600 font-medium">Vui lòng đăng nhập để có thể đánh giá và bình luận.</p>
        </div>
      ) : null}

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

        {reviews.map((review) => <ReviewNode key={review.id} review={review} />)}

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
