import React from "react";
import { StarRating } from "./star-rating";

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface VenueReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export const VenueReviews = ({
  rating,
  reviewCount,
  reviews,
}: VenueReviewsProps) => {
  // Calculate rating distribution (simplified)
  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Reviews</h3>

      {/* Rating Summary */}
      <div className="flex flex-wrap gap-6 items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col items-center gap-1">
          <p className="text-5xl font-black text-rose-600">
            {rating.toFixed(1)}
          </p>
          <StarRating rating={rating} />
          <p className="text-gray-600 text-sm">{reviewCount} reviews</p>
        </div>

        <div className="flex-1 min-w-[200px] grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 text-sm">
          {ratingDistribution.map((item) => (
            <React.Fragment key={item.stars}>
              <span className="text-gray-900">{item.stars}</span>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-rose-600"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-gray-600 text-right">
                {item.percentage}%
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${review.avatar})` }}
              />
              <div>
                <p className="font-bold text-gray-900">{review.author}</p>
                <p className="text-sm text-gray-600">{review.date}</p>
              </div>
            </div>
            <StarRating rating={review.rating} />
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
