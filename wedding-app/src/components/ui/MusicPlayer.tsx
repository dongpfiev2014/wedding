"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./MusicPlayer.module.css";

interface Props {
  musicUrl?: string;
}

export default function MusicPlayer({ musicUrl }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const src = musicUrl || "/music/young-and-beautiful.mp3";

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    audio.loop = true;

    audio
      .play()
      .then(() => {
        setPlaying(true);
      })
      .catch(() => {
        // Autoplay may be restricted by browser until user interaction
      });
  }, []);

  // 1. Attempt autoplay immediately on mount and when musicUrl loads/changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    playAudio();
  }, [musicUrl, playAudio]);

  // 2. Guarantee non-stop continuous loop (replays indefinitely)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // 3. Auto-play on first user gesture anywhere on the page
  useEffect(() => {
    if (playing) return;

    const handleUserGesture = () => {
      playAudio();
    };

    const events = ["click", "touchstart", "pointerdown", "keydown"];
    events.forEach((evt) => {
      window.addEventListener(evt, handleUserGesture, {
        capture: true,
        once: true,
        passive: true,
      });
    });

    window.addEventListener("play-wedding-music", handleUserGesture);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserGesture, { capture: true });
      });
      window.removeEventListener("play-wedding-music", handleUserGesture);
    };
  }, [playing, playAudio]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = 0.5;
      audio.loop = true;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        loop
        autoPlay
        playsInline
      />
      <button
        className={`${styles.player} ${playing ? styles.playing : ""}`}
        onClick={toggle}
        aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
        title={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
      >
        <span className={styles.disc}>
          <span className={styles.note}>{playing ? "♪" : "♫"}</span>
        </span>
        <span className={styles.label}>
          {playing ? "Young & Beautiful" : "Bật nhạc"}
        </span>
      </button>
    </>
  );
}
