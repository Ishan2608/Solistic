import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ImageGallery from "./pages/ImageGallery";
import News from "./pages/News";
import SolarSystemSimulator from "./pages/SolarSystemSimulator";
import Profile from "./pages/Profile";

import Navigation from "./components/Common/Navigation";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/news" element={<News />} />
          <Route path="/image-gallery" element={<ImageGallery />} />
          <Route path="/solar-system-simulator" element={<SolarSystemSimulator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}