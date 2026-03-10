import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import OnboardingPage from "./pages/OnboardingPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ScanPage from "./pages/ScanPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import AchievementsPage from "./pages/AchievementsPage";
import ObservationMapPage from "./pages/ObservationMapPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import SimilarSpeciesPage from "./pages/SimilarSpeciesPage";
import SpeciesWikiPage from "./pages/SpeciesWikiPage";
import RecordDetailPage from "./pages/RecordDetailPage";
import EditRecordPage from "./pages/EditRecordPage";
import SearchPage from "./pages/SearchPage";
import SearchFilterPage from "./pages/SearchFilterPage";
import CommunityPage from "./pages/CommunityPage";
import PublishPage from "./pages/PublishPage";
import PostDetailPage from "./pages/PostDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/observation-map" element={<ObservationMapPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/similar-species" element={<SimilarSpeciesPage />} />
          <Route path="/species-wiki" element={<SpeciesWikiPage />} />
          <Route path="/record-detail" element={<RecordDetailPage />} />
          <Route path="/edit-record" element={<EditRecordPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search-filter" element={<SearchFilterPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/post-detail" element={<PostDetailPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
