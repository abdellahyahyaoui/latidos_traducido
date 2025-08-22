import React from "react";
import "./VideoPlayer.css";

const VideoPlayer = ({ title = "Vídeo", src }) => {
  // truco: si tu archivo principal es .mp4,
  // asumimos que también tienes versiones .webm y .ogg
  const base = src.replace(/\.(mp4|webm|ogg)$/i, "");

  return (
    <div className="video-container">
      {/* <h3 className="video-title">{title}</h3> */}
      <video controls className="video-element" preload="metadata">
        <source src={`${base}.mp4`} type="video/mp4" />
        <source src={`${base}.webm`} type="video/webm" />
        <source src={`${base}.ogg`} type="video/ogg" />
        <p className="video-fallback">
          ⚠️ Lo sentimos, tu navegador no puede reproducir este vídeo.
        </p>
      </video>
    </div>
  );
};

export default VideoPlayer;
