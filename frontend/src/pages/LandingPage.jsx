import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import codingBg from "./landingpage.png"; // ✅ Import your image

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="landing-container"
      style={{ backgroundImage: `url(${codingBg})` }} // ✅ Use imported image
    >
      <div className="overlay">
        <div className="content-box">
          <h1 className="title">🌿 Welcome to Code Vibe</h1>
          <p className="subtitle">
            Practice coding, track your progress, and compete on the leaderboard.
          </p>
          <div className="buttons">
            <button className="btn login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn signup" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
