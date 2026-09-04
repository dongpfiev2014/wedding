"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./MusicPlayer.module.css";

interface Props {
  musicUrl?: string;
}

export default function MusicPlayer({ musicUrl }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPausedRef = useRef(false);
  const gestureHandledRef = useRef(false);
  const prevSrcRef = useRef<string | null>(null);

  const src =
    musicUrl && musicUrl.trim() !== ""
      ? musicUrl
      : "/music/young-and-beautiful.mp3";

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

  // Sync src changes only if src actually changed
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (prevSrcRef.current !== null && prevSrcRef.current !== src) {
      audio.src = src;
      audio.load();
      if (!userPausedRef.current) {
        playAudio();
      }
    }
    prevSrcRef.current = src;
  }, [src, playAudio]);

  // Initial autoplay attempt on mount
  useEffect(() => {
    playAudio();
  }, [playAudio]);

  // Guarantee non-stop continuous loop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Auto-play on first user gesture anywhere on page, ignoring clicks on the button itself
  useEffect(() => {
    const handleWeddingMusic = () => {
      userPausedRef.current = false;
      playAudio();
    };

    const handleFirstGesture = (e: Event) => {
      // If user clicked directly on the player button, let toggle handle it
      const target = e.target as HTMLElement | null;
      if (buttonRef.current && target && buttonRef.current.contains(target)) {
        return;
      }

      if (gestureHandledRef.current) return;
      gestureHandledRef.current = true;

      if (!userPausedRef.current) {
        playAudio();
      }
    };

    window.addEventListener("play-wedding-music", handleWeddingMusic);
    window.addEventListener("click", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener("play-wedding-music", handleWeddingMusic);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };
  }, [playAudio]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    gestureHandledRef.current = true;

    if (!audio.paused) {
      audio.pause();
      userPausedRef.current = true;
      setPlaying(false);
    } else {
      userPausedRef.current = false;
      audio.volume = 0.5;
      audio.loop = true;
      audio
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch((err) => {
          console.warn("Play error:", err);
        });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        ref={buttonRef}
        type="button"
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
