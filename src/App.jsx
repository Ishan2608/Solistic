import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ImageGallery from "./pages/ImageGallery";
import News from "./pages/News";
import Tutor from "./pages/Tutor";
import SolarSystemSimulator from "./pages/SolarSystemSimulator";

import Navigation from "./components/Navigation";

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home> </Home>}></Route>
        <Route path="/auth" element={<Auth> </Auth>}></Route>
        <Route path="/news" element={<News> </News>}></Route>
        <Route
          path="/image-gallery"
          element={<ImageGallery> </ImageGallery>}
        ></Route>
        <Route
          path="/solar-system-simulator"
          element={<SolarSystemSimulator> </SolarSystemSimulator>}
        ></Route>
        <Route path="/tutor" element={<Tutor> </Tutor>}></Route>
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}
