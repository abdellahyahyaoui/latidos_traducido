import React from "react";
import "./VideoPlayer.css";

const VideoPlayer = ({ title = "Vídeo", src }) => {
  return (
    <div className="video-container">
      <h3 className="video-title">{title}</h3>
      <video controls className="video-element">
        <source src={src} type="video/mp4" />
        Tu navegador no soporta la reproducción de vídeo.
      </video>
    </div>
  );
};

export default VideoPlayer;
