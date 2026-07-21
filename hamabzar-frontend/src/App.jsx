import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ToolDetailPage from "./pages/ToolDetailPage";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyRentalsPage from "./pages/MyRentalsPage";
import ChatPage from "./pages/ChatPage";
import ReviewFormPage from "./pages/ReviewFormPage";
import ToolFormPage from "./pages/ToolFormPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminToolsPage from "./pages/AdminToolsPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools/:id" element={<ToolDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/tools/new" element={<ToolFormPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage />} />
          <Route path="/my-rentals" element={<MyRentalsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/rentals/:rentalId/review" element={<ReviewFormPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/tools" element={<AdminToolsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
