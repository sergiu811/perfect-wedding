import React, { useState } from "react";
import { ArrowLeft, Heart, Share, Music, Play } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StarRating } from "~/components/venues";
import { MUSICIANS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

interface MusicianDetailsPageProps {
  musicianId: string;
}

export const MusicianDetailsPage = ({
  musicianId,
}: MusicianDetailsPageProps) => {
  const { navigate } = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const musician = MUSICIANS.find((m) => m.id === parseInt(musicianId));

  if (!musician) {
    return (
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Musician Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The musician you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/music-dj")}>
            Back to Music/DJ
          </Button>
        </div>
      </div>
    );
  }

  // Calculate rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-pink-50">
      <div className="pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between bg-pink-50/95 px-4 py-3 backdrop-blur-sm">
          <button
            onClick={() => navigate("/music-dj")}
            className="flex size-10 items-center justify-center rounded-full text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <button className="flex size-10 items-center justify-center rounded-full text-gray-900">
              <Share className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex size-10 items-center justify-center rounded-full text-gray-900"
            >
              <Heart
                className="w-6 h-6"
                fill={isFavorite ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>
        </header>

        <main>
          {/* Hero Image */}
          <div
            className="h-64 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${musician.image})` }}
          />

          {/* Description */}
          <div className="px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {musician.name}
            </h1>
            <p className="mt-2 text-gray-600">{musician.description}</p>
          </div>

          {/* Musical Genres */}
          <div className="px-4 pb-6">
            <h3 className="text-xl font-bold text-gray-900">Musical Genres</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {musician.genres.map((genre, index) => (
                <span
                  key={index}
                  className="rounded-full bg-rose-600/10 px-3 py-1 text-sm font-medium text-rose-600"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Service Packages */}
          <div className="space-y-6 px-4 pb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Service Packages
            </h3>
            {musician.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{pkg.name}</p>
                    <p className="font-bold text-gray-900">{pkg.title}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {pkg.description}
                    </p>
                    <p className="mt-2 text-lg font-bold text-rose-600">
                      {pkg.price}
                    </p>
                  </div>
                  <div
                    className="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${pkg.image})` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Availability */}
          <div className="px-4 pb-6">
            <h3 className="text-xl font-bold text-gray-900">Availability</h3>
            <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
              <p className="text-center text-gray-600">
                Contact vendor for availability
              </p>
            </div>
          </div>

          {/* Client Reviews */}
          <div className="px-4 pb-6">
            <h3 className="text-xl font-bold text-gray-900">Client Reviews</h3>
            <div className="mt-4 flex items-start gap-6">
              <div className="flex flex-col items-center">
                <p className="text-5xl font-bold text-gray-900">
                  {musician.rating.toFixed(1)}
                </p>
                <StarRating rating={musician.rating} size="sm" />
                <p className="mt-1 text-sm text-gray-600">
                  {musician.reviewCount} reviews
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.stars}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full bg-rose-600"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          {musician.reviews.length > 0 && (
            <div className="space-y-6 px-4 pb-6">
              {musician.reviews.map((review) => (
                <div key={review.id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${review.avatar})` }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {review.author}
                      </p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Audio Samples */}
          <div className="px-4 pb-6">
            <h3 className="text-xl font-bold text-gray-900">Audio Samples</h3>
            <div className="mt-4 space-y-2">
              {musician.audioSamples.map((sample) => (
                <div
                  key={sample.id}
                  className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-600/10 text-rose-600">
                    <Music className="w-6 h-6" />
                  </div>
                  <p className="flex-1 truncate font-medium text-gray-800">
                    {sample.name}
                  </p>
                  <button className="shrink-0 text-gray-600">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Fixed Footer */}
      <footer className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-pink-50/95 backdrop-blur-sm">
        <div className="flex flex-col justify-end bg-pink-50">
          <div className="flex gap-4 p-4">
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-lg border-2 border-rose-600 text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              Request a Demo
            </Button>
            <Button 
              onClick={() => navigate(`/contact-vendor/${musician.id}?name=${encodeURIComponent(musician.name)}&category=music-dj`)}
              className="h-12 flex-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-sm font-bold text-white"
            >
              Check Availability
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};
