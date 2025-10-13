import React from "react";
import { Router, Route } from "~/contexts/router-context";
import { ServiceProvider } from "~/contexts/service-context";
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
  DecorationsPage,
  DecorationDetailsPage,
  InvitationsPage,
  InvitationDetailsPage,
  SweetsPage,
  SweetDetailsPage,
  JoinVendorStep1,
  JoinVendorStep2,
  JoinVendorStep3,
  JoinVendorSuccess,
  VendorDashboard,
  AddServiceStep1,
  AddServiceStep2,
  AddServiceStep3,
  AddServiceStep4,
  AIPlanner,
  MyWeddingPage,
  MorePage,
} from "~/components/pages";

export default function App() {
  return (
    <Router>
      <ServiceProvider>
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
              render={(params) => (
                <MusicianDetailsPage musicianId={params.id} />
              )}
            />
            <Route path="/decorations" element={<DecorationsPage />} />
            <Route
              path="/decorations/:id"
              render={(params) => (
                <DecorationDetailsPage decorationId={params.id} />
              )}
            />
            <Route path="/invitations" element={<InvitationsPage />} />
            <Route
              path="/invitations/:id"
              render={(params) => (
                <InvitationDetailsPage invitationId={params.id} />
              )}
            />
            <Route path="/sweets" element={<SweetsPage />} />
            <Route
              path="/sweets/:id"
              render={(params) => <SweetDetailsPage sweetId={params.id} />}
            />
            <Route path="/join-vendor" element={<JoinVendorStep1 />} />
            <Route path="/join-vendor/step-2" element={<JoinVendorStep2 />} />
            <Route path="/join-vendor/step-3" element={<JoinVendorStep3 />} />
            <Route
              path="/join-vendor/success"
              element={<JoinVendorSuccess />}
            />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/add-service/step-1" element={<AddServiceStep1 />} />
            <Route path="/add-service/step-2" element={<AddServiceStep2 />} />
            <Route path="/add-service/step-3" element={<AddServiceStep3 />} />
            <Route path="/add-service/step-4" element={<AddServiceStep4 />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/my-wedding" element={<MyWeddingPage />} />
            <Route path="/more" element={<MorePage />} />
          </main>
          <Navigation />
        </div>
      </ServiceProvider>
    </Router>
  );
}
