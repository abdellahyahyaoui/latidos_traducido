import React, { useRef, useState, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ title = "Audio", src = "/audio/Voice-to-gaza.mp3" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const setDur = () => setDuration(audio.duration);

    if (!audio) return;

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setDur);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setDur);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-container">
      <h3 className="audio-titulo">{title}</h3>

      <div className="audio-layout">
        <button className="play-button" onClick={togglePlay}>
          {isPlaying ? (
            <div className="pause-icon">
              <span></span>
              <span></span>
            </div>
          ) : (
            <div className="triangle-play"></div>
          )}
        </button>

        <div className="progress-wrapper">
          <div className="progress-container">
            <span className="time">{formatTime(currentTime)}</span>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }} />
            </div>
            <span className="time">{formatTime(duration)}</span>
          </div>

          <div className={`speaker-icon ${isPlaying ? 'active' : ''}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default AudioPlayer;
