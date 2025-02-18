
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Scanner from "./pages/Scanner";
import SellerDashboard from "./pages/SellerDashboard";
import SellerRegistration from "./pages/SellerRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/register" element={<SellerRegistration />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
