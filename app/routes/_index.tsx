import React from "react";
import { Router, Route } from "~/contexts/router-context";
import { ServiceProvider } from "~/contexts/service-context";
import { PlanningProvider } from "~/contexts/planning-context";
import { Navigation } from "~/components/layout";
import { ProtectedRoute } from "~/components/common/protected-route";
import { AuthPage } from "~/components/pages/auth-page";
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
} from "~/components/pages";

export default function App() {
  return (
    <Router>
      <PlanningProvider>
        <ServiceProvider>
          <div className="relative flex min-h-screen w-full flex-col bg-pink-50 font-sans antialiased">
            <main className="flex-1 lg:ml-64 xl:ml-72">
                  {/* Public Routes */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={<ProtectedRoute requireRole="couple"><HomePage /></ProtectedRoute>} />
                  <Route path="/vendors" element={<ProtectedRoute><VendorsPage /></ProtectedRoute>} />
                  <Route path="/venues" element={<ProtectedRoute><VenuesPage /></ProtectedRoute>} />
                  <Route
                    path="/venues/:id"
                    render={(params) => (
                      <ProtectedRoute><VenueDetailsPage venueId={params.id} /></ProtectedRoute>
                    )}
                  />
                  <Route path="/photo-video" element={<ProtectedRoute><PhotoVideoPage /></ProtectedRoute>} />
                  <Route
                    path="/photo-video/:id"
                    render={(params) => (
                      <ProtectedRoute><PhotographerDetailsPage photographerId={params.id} /></ProtectedRoute>
                    )}
                  />
                  <Route path="/music-dj" element={<ProtectedRoute><MusicDJPage /></ProtectedRoute>} />
                  <Route
                    path="/music-dj/:id"
                    render={(params) => (
                      <ProtectedRoute><MusicianDetailsPage musicianId={params.id} /></ProtectedRoute>
                    )}
                  />
                  <Route path="/decorations" element={<ProtectedRoute><DecorationsPage /></ProtectedRoute>} />
                  <Route
                    path="/decorations/:id"
                    render={(params) => (
                      <ProtectedRoute><DecorationDetailsPage decorationId={params.id} /></ProtectedRoute>
                    )}
                  />
                  <Route path="/invitations" element={<ProtectedRoute><InvitationsPage /></ProtectedRoute>} />
                  <Route
                    path="/invitations/:id"
                    render={(params) => (
                      <ProtectedRoute><InvitationDetailsPage invitationId={params.id} /></ProtectedRoute>
                    )}
                  />
                  <Route path="/sweets" element={<ProtectedRoute><SweetsPage /></ProtectedRoute>} />
                  <Route
                    path="/sweets/:id"
                    render={(params) => (
                      <ProtectedRoute><SweetDetailsPage sweetId={params.id} /></ProtectedRoute>
                    )}
                  />
                  <Route path="/join-vendor" element={<ProtectedRoute><JoinVendorStep1 /></ProtectedRoute>} />
                  <Route
                    path="/join-vendor/step-2"
                    element={<ProtectedRoute><JoinVendorStep2 /></ProtectedRoute>}
                  />
                  <Route
                    path="/join-vendor/step-3"
                    element={<ProtectedRoute><JoinVendorStep3 /></ProtectedRoute>}
                  />
                  <Route
                    path="/join-vendor/success"
                    element={<ProtectedRoute><JoinVendorSuccess /></ProtectedRoute>}
                  />
                  <Route
                    path="/vendor-dashboard"
                    element={<ProtectedRoute requireRole="vendor"><VendorDashboard /></ProtectedRoute>}
                  />
                  <Route
                    path="/vendor-dashboard/edit-profile"
                    element={<ProtectedRoute requireRole="vendor"><VendorEditProfile /></ProtectedRoute>}
                  />
                  <Route
                    path="/vendor-dashboard/public-profile"
                    element={<ProtectedRoute requireRole="vendor"><VendorPublicProfile /></ProtectedRoute>}
                  />
                  <Route
                    path="/add-service/step-1"
                    element={<ProtectedRoute requireRole="vendor"><AddServiceStep1 /></ProtectedRoute>}
                  />
                  <Route
                    path="/add-service/step-2"
                    element={<ProtectedRoute requireRole="vendor"><AddServiceStep2 /></ProtectedRoute>}
                  />
                  <Route
                    path="/add-service/step-3"
                    element={<ProtectedRoute requireRole="vendor"><AddServiceStep3 /></ProtectedRoute>}
                  />
                  <Route
                    path="/add-service/step-4"
                    element={<ProtectedRoute requireRole="vendor"><AddServiceStep4 /></ProtectedRoute>}
                  />
                  <Route path="/ai-planner" element={<ProtectedRoute><AIPlanner /></ProtectedRoute>} />
                  <Route path="/my-wedding" element={<ProtectedRoute requireRole="couple"><MyWeddingPage /></ProtectedRoute>} />
                  <Route path="/more" element={<ProtectedRoute><MorePage /></ProtectedRoute>} />
                  <Route path="/planning/step-1" element={<ProtectedRoute requireRole="couple"><PlanningStep1 /></ProtectedRoute>} />
                  <Route path="/planning/step-2" element={<ProtectedRoute requireRole="couple"><PlanningStep2 /></ProtectedRoute>} />
                  <Route path="/planning/step-3" element={<ProtectedRoute requireRole="couple"><PlanningStep3 /></ProtectedRoute>} />
                  <Route path="/planning/step-4" element={<ProtectedRoute requireRole="couple"><PlanningStep4 /></ProtectedRoute>} />
                  <Route
                    path="/planning/success"
                    element={<ProtectedRoute requireRole="couple"><PlanningSuccess /></ProtectedRoute>}
                  />
                  <Route path="/guest-list" element={<ProtectedRoute requireRole="couple"><GuestListPage /></ProtectedRoute>} />
                  <Route
                    path="/seating-planner"
                    element={<ProtectedRoute requireRole="couple"><SeatingPlannerPage /></ProtectedRoute>}
                  />
                  <Route
                    path="/budget-details"
                    element={<ProtectedRoute requireRole="couple"><BudgetDetailsPage /></ProtectedRoute>}
                  />
                  <Route
                    path="/contact-vendor/:id"
                    render={(params) => (
                      <ProtectedRoute><ContactVendorWrapper vendorId={params.id} /></ProtectedRoute>
                    )}
                  />
                  <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                  <Route
                    path="/chat/:id"
                    render={(params) => <ProtectedRoute><ChatWrapper vendorId={params.id} /></ProtectedRoute>}
                  />
                  <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                </main>
                <Navigation />
              </div>
            </ServiceProvider>
      </PlanningProvider>
    </Router>
  );
}
