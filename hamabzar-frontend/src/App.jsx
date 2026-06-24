import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ToolDetailPage from "./pages/ToolDetailPage";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyRentalsPage from "./pages/MyRentalsPage";
import ChatPage from "./pages/ChatPage";
import ReviewFormPage from "./pages/ReviewFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools/:id" element={<ToolDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/my-rentals" element={<MyRentalsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/rentals/:rentalId/review" element={<ReviewFormPage />} />
        {/* صفحات بعدی تیم اینجا اضافه می‌شن، مثلاً: */}
        {/* <Route path="/my-tools" element={<MyToolsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
