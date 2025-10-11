import React from "react";
import { Router, Route } from "~/contexts/router-context";
import { Navigation } from "~/components/layout";
import {
  HomePage,
  VendorsPage,
  VenuesPage,
  VenueDetailsPage,
  PhotoVideoPage,
  PhotographerDetailsPage,
  MusicDJPage,
  MusicianDetailsPage,
  AIPlanner,
  MyWeddingPage,
  MorePage,
} from "~/components/pages";

export default function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen w-full flex-col bg-pink-50 font-sans antialiased">
        <main className="flex-1">
          <Route path="/" element={<HomePage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route
            path="/venues/:id"
            render={(params) => <VenueDetailsPage venueId={params.id} />}
          />
          <Route path="/photo-video" element={<PhotoVideoPage />} />
          <Route
            path="/photo-video/:id"
            render={(params) => (
              <PhotographerDetailsPage photographerId={params.id} />
            )}
          />
          <Route path="/music-dj" element={<MusicDJPage />} />
          <Route
            path="/music-dj/:id"
            render={(params) => <MusicianDetailsPage musicianId={params.id} />}
          />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/my-wedding" element={<MyWeddingPage />} />
          <Route path="/more" element={<MorePage />} />
        </main>
        <Navigation />
      </div>
    </Router>
  );
}
