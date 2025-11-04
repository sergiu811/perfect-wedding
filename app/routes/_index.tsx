import React from "react";
import { Router, Route } from "~/contexts/router-context";
import { ServiceProvider } from "~/contexts/service-context";
import { PlanningProvider } from "~/contexts/planning-context";
import { GuestListProvider } from "~/contexts/guest-list-context";
import { SeatingProvider } from "~/contexts/seating-context";
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
  VendorEditProfile,
  VendorPublicProfile,
  AddServiceStep1,
  AddServiceStep2,
  AddServiceStep3,
  AddServiceStep4,
  AIPlanner,
  MyWeddingPage,
  MorePage,
  PlanningStep1,
  PlanningStep2,
  PlanningStep3,
  PlanningStep4,
  PlanningSuccess,
  GuestListPage,
  SeatingPlannerPage,
  BudgetDetailsPage,
  ContactVendorWrapper,
  MessagesPage,
  ChatWrapper,
  MyBookingsPage,
  LoginPage,
  SignupPage,
} from "~/components/pages";

export default function App() {
  return (
    <Router>
      <PlanningProvider>
        <GuestListProvider>
          <SeatingProvider>
            <ServiceProvider>
              <div className="relative flex min-h-screen w-full flex-col bg-pink-50 font-sans antialiased">
                <main className="flex-1 lg:ml-64 xl:ml-72">
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/vendors" element={<VendorsPage />} />
                  <Route path="/venues" element={<VenuesPage />} />
                  <Route
                    path="/venues/:id"
                    render={(params) => (
                      <VenueDetailsPage venueId={params.id} />
                    )}
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
                    render={(params) => (
                      <SweetDetailsPage sweetId={params.id} />
                    )}
                  />
                  <Route path="/join-vendor" element={<JoinVendorStep1 />} />
                  <Route
                    path="/join-vendor/step-2"
                    element={<JoinVendorStep2 />}
                  />
                  <Route
                    path="/join-vendor/step-3"
                    element={<JoinVendorStep3 />}
                  />
                  <Route
                    path="/join-vendor/success"
                    element={<JoinVendorSuccess />}
                  />
                  <Route
                    path="/vendor-dashboard"
                    element={<VendorDashboard />}
                  />
                  <Route
                    path="/vendor-dashboard/edit-profile"
                    element={<VendorEditProfile />}
                  />
                  <Route
                    path="/vendor-dashboard/public-profile"
                    element={<VendorPublicProfile />}
                  />
                  <Route
                    path="/add-service/step-1"
                    element={<AddServiceStep1 />}
                  />
                  <Route
                    path="/add-service/step-2"
                    element={<AddServiceStep2 />}
                  />
                  <Route
                    path="/add-service/step-3"
                    element={<AddServiceStep3 />}
                  />
                  <Route
                    path="/add-service/step-4"
                    element={<AddServiceStep4 />}
                  />
                  <Route path="/ai-planner" element={<AIPlanner />} />
                  <Route path="/my-wedding" element={<MyWeddingPage />} />
                  <Route path="/more" element={<MorePage />} />
                  <Route path="/planning/step-1" element={<PlanningStep1 />} />
                  <Route path="/planning/step-2" element={<PlanningStep2 />} />
                  <Route path="/planning/step-3" element={<PlanningStep3 />} />
                  <Route path="/planning/step-4" element={<PlanningStep4 />} />
                  <Route
                    path="/planning/success"
                    element={<PlanningSuccess />}
                  />
                  <Route path="/guest-list" element={<GuestListPage />} />
                  <Route
                    path="/seating-planner"
                    element={<SeatingPlannerPage />}
                  />
                  <Route
                    path="/budget-details"
                    element={<BudgetDetailsPage />}
                  />
                  <Route
                    path="/contact-vendor/:id"
                    render={(params) => (
                      <ContactVendorWrapper vendorId={params.id} />
                    )}
                  />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route
                    path="/chat/:id"
                    render={(params) => <ChatWrapper vendorId={params.id} />}
                  />
                  <Route path="/my-bookings" element={<MyBookingsPage />} />
                </main>
                <Navigation />
              </div>
            </ServiceProvider>
          </SeatingProvider>
        </GuestListProvider>
      </PlanningProvider>
    </Router>
  );
}
