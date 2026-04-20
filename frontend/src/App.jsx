import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HabitsPage from "./pages/HabitsPage";
import HabitDetailPage from "./pages/HabitDetailPage";
import ProfilePage from "./pages/ProfilePage";
import XPNotification from "./components/XPNotification";
import LandingPage from "./pages/LandingPage";

// A layout component for routes that need the sidebar
function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-200">
      <Navbar />
      <main className="pl-64 p-8">
        {children}
      </main>
      <XPNotification />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/habits" element={
        <ProtectedRoute>
          <MainLayout>
            <HabitsPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/habits/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <HabitDetailPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
