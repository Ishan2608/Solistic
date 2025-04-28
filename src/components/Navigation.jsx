import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/auth">Auth</Link>
        </li>
        <li>
          <Link to="/news">News</Link>
        </li>
        <li>
          <Link to="/image-gallery">Image Gallery</Link>
        </li>
        <li>
          <Link to="/solar-system-simulator">Solary System Simulator</Link>
        </li>
        <li>
          <Link to="/tutor">Tutor</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
