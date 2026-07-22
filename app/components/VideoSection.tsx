"use client";

import { useEffect, useRef, useState } from "react";

const MAX_CARD_WIDTH = 1280;
const SIDE_PADDING = 48;
const CORNER_RADIUS = 24;
const GROWTH_VH = 60;
const DWELL_VH = 15;
// Video stays paused through the Hero section and only starts once this much
// of the viewport (from the bottom edge) is covered by the incoming card.
const REVEAL_TO_PLAY = 0.15;

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path
        d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function FullscreenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function VideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  // Document-relative top of the container, cached on mount/resize so the
  // scroll handler never has to call getBoundingClientRect() — that forced a
  // synchronous layout read every frame, fighting the other scroll-linked
  // sections' writes and causing the visible jank on the video section.
  const topRef = useRef(0);
  // Gates the play()/pause() calls so they only fire once per crossing of the
  // reveal threshold instead of every scroll frame — repeatedly calling
  // play() while already playing is what made the playback itself stutter.
  const isPlayingIntentRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let ticking = false;

    function computeLayout() {
      const container = containerRef.current;
      if (!container) return;

      const viewportWidth = window.innerWidth;
      const initialWidth = Math.min(viewportWidth - SIDE_PADDING, MAX_CARD_WIDTH);
      const initialHeight = (initialWidth * 9) / 16;
      sizeRef.current = { width: initialWidth, height: initialHeight };
      topRef.current = container.getBoundingClientRect().top + window.scrollY;
    }

    // Everything below is transform/opacity-only (no width/height/border-radius
    // layout writes) so the browser never has to reflow or repaint the box-shadow
    // at a new size on every scroll frame — that reflow was the source of the jank.
    function update() {
      ticking = false;
      const card = cardRef.current;
      const center = centerRef.current;
      const controls = controlsRef.current;
      const video = videoRef.current;
      if (!card || !center || !controls || !video) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const { width: initialWidth, height: initialHeight } = sizeRef.current;

      const growthDistance = (GROWTH_VH / 100) * viewportHeight;
      const scrolled = window.scrollY - topRef.current;
      const progress = growthDistance > 0 ? Math.min(Math.max(scrolled / growthDistance, 0), 1) : 0;

      const scaleX = initialWidth / viewportWidth + (1 - initialWidth / viewportWidth) * progress;
      const scaleY = initialHeight / viewportHeight + (1 - initialHeight / viewportHeight) * progress;
      const avgScale = Math.sqrt(scaleX * scaleY);
      const visualRadius = CORNER_RADIUS * (1 - progress);

      card.style.transform = `scale(${scaleX}, ${scaleY})`;
      card.style.borderRadius = `${visualRadius / avgScale}px`;

      // Counter-scale the overlay content so the parent's non-uniform scale
      // doesn't stretch it into an oval or squash the text.
      const counterX = avgScale / scaleX;
      const counterY = avgScale / scaleY;
      center.style.transform = `translate(-50%, -50%) scale(${counterX}, ${counterY})`;
      controls.style.transform = `scale(${counterX}, ${counterY})`;

      // rectTop/rectBottom of the container, derived from the cached top
      // (no getBoundingClientRect call here) — used purely to decide whether
      // the video should be playing, not to size anything.
      const rectTop = topRef.current - window.scrollY;
      const rectBottom = rectTop + (viewportHeight * (100 + GROWTH_VH + DWELL_VH)) / 100;
      const revealedPx = viewportHeight - rectTop;
      const shouldPlay = rectBottom > 0 && revealedPx >= viewportHeight * REVEAL_TO_PLAY;

      if (shouldPlay !== isPlayingIntentRef.current) {
        isPlayingIntentRef.current = shouldPlay;
        if (shouldPlay) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      computeLayout();
      onScroll();
    }

    computeLayout();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Wired imperatively via addEventListener (not the JSX onLoadedMetadata
  // prop) because when the video is already cached by the browser, its
  // "loadedmetadata" event can fire before React finishes attaching the
  // synthetic listener, silently leaving duration at 0 forever.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Some mp4 exports don't carry a real duration in their header, so the
    // browser reports Infinity until something forces it to index the file.
    // Seeking near the end (then straight back to 0) reveals the true length.
    const resolveDuration = () => {
      if (Number.isFinite(video.duration)) {
        setDuration(video.duration);
        return;
      }
      const onTimeUpdate = () => {
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.currentTime = 0;
        if (Number.isFinite(video.duration)) setDuration(video.duration);
      };
      video.addEventListener("timeupdate", onTimeUpdate);
      video.currentTime = 1e101;
    };

    if (video.readyState >= 1) {
      resolveDuration();
    } else {
      video.addEventListener("loadedmetadata", resolveDuration);
      return () => video.removeEventListener("loadedmetadata", resolveDuration);
    }
  }, []);

  // Center button doubles as a big play/pause toggle: first press unmutes
  // and starts playback, subsequent presses just toggle like the strip's
  // own play/pause button.
  const handleCenterClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 1;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const next = Number(e.target.value);
    video.volume = next;
    video.muted = next === 0;
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen?.().catch(() => {});
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const next = Number(e.target.value);
    video.currentTime = next;
    setCurrentTime(next);
  };

  const seekPct = duration > 0 ? (Math.min(currentTime, duration) / duration) * 100 : 0;
  const volumePct = isMuted ? 0 : volume * 100;
  const trackFill = (pct: number) =>
    `linear-gradient(to right, var(--color-primary) ${pct}%, rgba(255,255,255,0.25) ${pct}%)`;

  return (
    <section
      ref={containerRef}
      className="relative mt-2 sm:mt-3"
      style={{ height: `${100 + GROWTH_VH + DWELL_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <div
          ref={cardRef}
          className="absolute inset-0 overflow-hidden border border-border-hairline bg-tertiary shadow-[0_30px_80px_-30px_rgba(5,11,24,0.45)] will-change-transform"
          style={{ borderRadius: `${CORNER_RADIUS}px`, transformOrigin: "center" }}
        >
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.08]" />

          <video
            ref={videoRef}
            src="/agouavideo.mp4"
            className="absolute inset-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={(e) => {
              setIsMuted(e.currentTarget.muted);
              setVolume(e.currentTarget.volume);
            }}
            onTimeUpdate={(e) => {
              // Guards against the transient huge currentTime produced by the
              // Infinity-duration workaround above from ever flashing in the UI.
              const t = e.currentTarget.currentTime;
              if (t < 1e6) setCurrentTime(t);
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/20" />

          <div
            ref={centerRef}
            className="absolute left-1/2 top-1/2 flex flex-col items-center gap-4"
          >
            <button
              type="button"
              aria-label={isPlaying ? "Pause" : "Play video with sound"}
              onClick={handleCenterClick}
              className="group flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_8px_28px_-8px_rgba(20,184,166,0.45),0_18px_44px_-14px_rgba(59,130,246,0.35)] transition-shadow duration-300 hover:shadow-[0_10px_32px_-8px_rgba(20,184,166,0.55),0_22px_44px_-14px_rgba(59,130,246,0.45)]"
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="var(--color-tertiary)" />
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="ml-1">
                  <path d="M8 5v14l11-7-11-7z" fill="var(--color-tertiary)" />
                </svg>
              )}
            </button>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="font-label text-[11px] uppercase tracking-widest text-white/50">
                Watch the Showreel
              </span>
              <span
                className="text-[20px] font-semibold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                See AGOUA in Action
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-center sm:inset-x-6 sm:bottom-8">
            <div
              ref={controlsRef}
              className="pointer-events-auto flex w-full max-w-3xl items-center gap-4 rounded-full border border-white/10 bg-black/45 px-6 py-4 backdrop-blur-md sm:gap-6 sm:px-9 sm:py-5"
              style={{ transformOrigin: "bottom center" }}
            >
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex h-12 w-12 shrink-0 items-center justify-center text-white transition-colors hover:text-primary"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <span className="font-numeric shrink-0 text-[14px] tabular-nums text-white/80">
                {formatTime(currentTime)}
              </span>

              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={handleSeek}
                aria-label="Seek"
                style={{ background: trackFill(seekPct) }}
                className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full accent-primary"
              />

              <span className="font-numeric shrink-0 text-[14px] tabular-nums text-white/80">
                {formatTime(duration)}
              </span>

              <div className="group/volume hidden shrink-0 items-center sm:flex">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="flex h-12 w-12 shrink-0 items-center justify-center text-white transition-colors hover:text-primary"
                >
                  {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume"
                  style={{ background: trackFill(volumePct) }}
                  className="h-2 w-0 shrink-0 cursor-pointer appearance-none overflow-hidden rounded-full opacity-0 accent-primary transition-all duration-300 group-hover/volume:w-20 group-hover/volume:opacity-100"
                />
              </div>

              <button
                type="button"
                onClick={handleFullscreen}
                aria-label="Full screen"
                className="flex h-12 w-12 shrink-0 items-center justify-center text-white transition-colors hover:text-primary"
              >
                <FullscreenIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
