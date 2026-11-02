'use client';

import React, { useEffect, useState } from 'react';
import { getReviews, createReview } from '../../services/review.service';
import ReviewModal from '../../components/reviews/ReviewModal';
import GitHubCard from '../../components/reviews/GitHubCard';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (error) {
        console.error('Failed to load reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleAddReview = async (reviewData: any) => {
    try {
      const newReview = await createReview(reviewData);
      setReviews([newReview, ...reviews]);
    } catch (error) {
      console.error('Failed to submit review', error);
      alert('Failed to submit review. Try again.');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 text-yellow-500">
        {[1, 2, 3, 4, 5].map(star => (
          <svg key={star} className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-machined-700'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 interior-card bg-white shadow-sm">
        <div>
          <h1 className="text-3xl interior-heading mb-1">
            Peer Reviews
          </h1>
          <p className="interior-text font-sans text-sm">Feedback and skill endorsements from the community.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="interior-pill interior-pill-active shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Write a Review
        </button>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded-[24px] border border-gray-200"></div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[24px] border border-dashed border-gray-300">
            <p className="interior-text font-sans mb-4">No reviews have been written yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-gray-900 font-bold hover:underline">Be the first to review a project!</button>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="interior-panel hover:-translate-y-1 transition-all duration-300 p-6 md:p-8 flex flex-col md:flex-row gap-6 group bg-white">
              
              {/* Author Info Column */}
              <div className="flex-shrink-0 flex flex-row md:flex-col items-center gap-4 md:w-32">
                <div className="w-16 h-16 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center overflow-hidden shadow-sm group-hover:border-gray-200 transition-colors">
                  {review.reviewer?.avatar ? (
                    <img src={review.reviewer.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-gray-400 text-xl">{review.reviewer?.name?.charAt(0) || '?'}</span>
                  )}
                </div>
                <div className="text-left md:text-center">
                  <p className="text-sm font-bold text-gray-900">{review.reviewer?.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-grow flex flex-col border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
                
                {/* Target Project context */}
                <div className="mb-4 flex items-center gap-2 bg-gray-50 inline-flex px-3 py-1.5 rounded-lg border border-gray-200 w-fit">
                  <span className="text-xs text-gray-500 font-sans font-medium">Reviewing:</span>
                  <span className="text-sm font-bold text-gray-900">{review.project?.title}</span>
                </div>

                <div className="flex flex-wrap gap-4 items-center mb-3">
                  {renderStars(review.rating)}
                  <h3 className="font-bold text-xl text-gray-900">{review.title}</h3>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 font-sans">
                  &quot;{review.content}&quot;
                </p>

                {/* Skill Endorsements */}
                {review.skillEndorsements && review.skillEndorsements.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 font-sans">Endorsed Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {review.skillEndorsements.map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional GitHub Stats Card if project has github URL */}
                {review.project?.githubUrl && (
                  <div className="mt-auto w-full md:w-1/2">
                    <GitHubCard repoUrl={review.project.githubUrl} />
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>

      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddReview} 
      />
    </div>
  );
}
