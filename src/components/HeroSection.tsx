import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Share2,
  Coffee,
  Radio,
  ChevronDown,
  Eye,
  EyeOff,
  Maximize2,
  Instagram,
} from 'lucide-react';
import { Track, UserRoleMode, VehicleCategory, VehicleWorldConfig } from '../types';

interface HeroSectionProps {
  world: VehicleWorldConfig;
  activeCategory: VehicleCategory;
  onSelectCategory: (category: VehicleCategory) => void;
  userRole: UserRoleMode;
  onSelectRole: (role: UserRoleMode) => void;
  onOpenRoleModal: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onTriggerHorn: (forceHorn?: 1 | 2) => 1 | 2;
  lastHornNumber: 1 | 2;
  isHornHonking?: boolean;
  onPlayChai: () => void;
  onOpenQueue: () => void;
  onOpenShare: () => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  world,
  activeCategory,
  onSelectCategory,
  userRole,
  onSelectRole,
  onOpenRoleModal,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onTriggerHorn,
  lastHornNumber,
  isHornHonking = false,
  onPlayChai,
  onOpenQueue,
  onOpenShare,
  isZenMode,
  onToggleZenMode,
}) => {
  // Live digital clock: HH : MM SS
  const [timeString, setTimeString] = useState({ hours: '13', minutes: '50', seconds: '00' });
  const [colonVisible, setColonVisible] = useState(true);
  const [internalHornHonking, setInternalHornHonking] = useState(false);
  const [activeHornNum, setActiveHornNum] = useState<1 | 2>(lastHornNumber);
  const [chaiMessage, setChaiMessage] = useState<string | null>(null);

  // Active vibration state combining prop and local click
  const activeHonk = isHornHonking || internalHornHonking;

  useEffect(() => {
    setActiveHornNum(lastHornNumber);
  }, [lastHornNumber]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString({
        hours: now.getHours().toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0'),
        seconds: now.getSeconds().toString().padStart(2, '0'),
      });
      setColonVisible((prev) => !prev);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleHornClick = () => {
    const hornPlayed = onTriggerHorn();
    setActiveHornNum(hornPlayed);
    setInternalHornHonking(true);
    setTimeout(() => setInternalHornHonking(false), 1400);
  };

  const handleChaiClick = () => {
    onPlayChai();
    setChaiMessage('☕ Cutting Chai served! +50 Driver Energy');
    setTimeout(() => setChaiMessage(null), 3000);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const scrollToEmptyView = () => {
    const el = document.getElementById('empty-video-screen');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative flex flex-col text-[#f5efe6] select-none">
      {/* 
        VIEW 1: TOP INTRO VIEW (100vh)
        Contains Top Navigation, Grand Headline "बस ड्राइवर", Horn & Chai Buttons
        As the user scrolls down, this scrolls up and out of view, revealing the empty video view!
      */}
      <section className="min-h-screen h-screen flex flex-col justify-between relative z-10 px-4 sm:px-8 pt-5 pb-24">
        {/* TOP BAR: Recreated exactly like reference screenshot */}
        <header className="w-full flex items-center justify-between gap-4">
          {/* Top-Left: Yellow bus icon + Devanagari title + Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-black p-1 flex items-center justify-center shadow-xl shadow-amber-950/60 shrink-0 border border-amber-500/40 ring-1 ring-white/10 overflow-hidden group">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_5.34.06_PM__1__64f30d00.jpeg"
                alt="Safar Beats Bus Logo"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="font-devanagari text-xl sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {world.heroHeadline}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-stone-300 tracking-wider uppercase font-mono">
                NH 48 · DELHI — MUMBAI
              </div>
            </div>
          </div>

          {/* Center: Category & Role Switcher Pills */}
          <div className="hidden md:flex items-center gap-2">
            {/* Category Switcher */}
            <div className="flex items-center p-1 rounded-full bg-black/60 backdrop-blur-md border border-stone-800 text-xs font-bold">
              <button
                onClick={() => onSelectCategory('bus')}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeCategory === 'bus' ? 'bg-[#f59e0b] text-black shadow-md' : 'text-stone-300 hover:text-white'
                }`}
              >
                BUS
              </button>
              <button
                onClick={() => onSelectCategory('car')}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeCategory === 'car' ? 'bg-[#f59e0b] text-black shadow-md' : 'text-stone-300 hover:text-white'
                }`}
              >
                CAR
              </button>
              <button
                onClick={() => onSelectCategory('bike')}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeCategory === 'bike' ? 'bg-[#f59e0b] text-black shadow-md' : 'text-stone-300 hover:text-white'
                }`}
              >
                BIKE
              </button>
            </div>

            {/* Drive vs Ride Mode */}
            <div className="flex items-center p-1 rounded-full bg-black/60 backdrop-blur-md border border-stone-800 text-xs font-bold">
              <button
                onClick={() => onSelectRole('drive')}
                title="Endless Highway POV Driver Video"
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  userRole === 'drive' ? 'bg-amber-500 text-black shadow-md' : 'text-stone-400 hover:text-white'
                }`}
              >
                🚗 DRIVE
              </button>
              <button
                onClick={() => onSelectRole('ride')}
                title="Scenic Road Passenger View"
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  userRole === 'ride' ? 'bg-amber-500 text-black shadow-md' : 'text-stone-400 hover:text-white'
                }`}
              >
                💺 RIDE
              </button>
            </div>
          </div>

          {/* Top-Right: Digital Clock & "Who's driving?" button */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Digital Clock */}
            <div className="font-mono text-sm sm:text-base font-bold text-stone-200 tracking-wider flex items-center">
              <span>{timeString.hours}</span>
              <span className={`mx-0.5 ${colonVisible ? 'opacity-100' : 'opacity-20'}`}>:</span>
              <span>{timeString.minutes}</span>
              <span className="text-[11px] text-stone-400 ml-1.5 opacity-80">{timeString.seconds}</span>
            </div>

            {/* Driver Profile Button: Satya Rai */}
            <button
              onClick={onOpenRoleModal}
              title="Driver Satya Rai (@satya_raiii)"
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#1e140d]/90 hover:bg-[#2c1d13] text-stone-200 hover:text-white border border-amber-900/40 text-xs font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-white/10"
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0">
                <Instagram className="w-3 h-3" />
              </span>
              <span className="hidden sm:inline font-mono font-bold text-amber-300">@satya_raiii</span>
            </button>
          </div>
        </header>

        {/* CENTER STAGE: Central Vehicle Headline Banner + Action Buttons */}
        <div className="w-full max-w-5xl mx-auto px-4 text-center my-auto flex flex-col items-center justify-center">
          {/* Kicker: NON-STOP ROAD CASSETTE */}
          <div className="text-[11px] sm:text-xs font-bold text-stone-300 tracking-[0.25em] uppercase mb-1">
            NON-STOP HIGHWAY RADIO
          </div>

          {/* Clean Grand Headline with Acoustic Horn Vibration */}
          <h1
            className={`font-devanagari text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tight leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] select-none my-1 transition-transform duration-100 ${
              activeHonk
                ? 'animate-horn-vibrate scale-[1.03] text-amber-100 drop-shadow-[0_0_45px_rgba(245,158,11,1)]'
                : ''
            }`}
          >
            {world.heroHeadline}
          </h1>

          {/* Center Road Subtitle: ALL NIGHT ON NH 48 */}
          <div className="text-[11px] sm:text-xs font-bold text-stone-300 tracking-[0.2em] uppercase font-mono mt-2 mb-4">
            ALL NIGHT ON NH 48
          </div>

          {/* The Two Prominent Interactive Action Buttons matching screenshot exactly */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 mt-2">
            {/* Button 1: HORN OK PLEASE (Plays Horn 1 & Horn 2 one by one) */}
            <button
              onClick={handleHornClick}
              className={`group flex items-center gap-3 px-6 sm:px-8 py-3 rounded-full transition-all duration-150 cursor-pointer shadow-2xl border ${
                activeHonk
                  ? 'bg-amber-500 text-stone-950 scale-105 border-amber-300 shadow-amber-500/50 ring-4 ring-amber-400/40'
                  : 'bg-[#18110b]/95 hover:bg-[#251810] text-stone-100 hover:text-white border-amber-900/60 ring-1 ring-white/10'
              }`}
            >
              {/* Loudspeaker pink megaphone icon matching user screenshot */}
              <div className="w-6 h-6 shrink-0 relative flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  {/* Megaphone bell/flare in bright pink/magenta */}
                  <path d="M19 4.5v15c0 .6-.7.9-1.2.6L12 15H8c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h4l5.8-5.1c.5-.3 1.2 0 1.2.6z" fill="#f43f5e" />
                  {/* Megaphone body/neck in light silvery white */}
                  <rect x="3" y="9" width="5" height="6" rx="1" fill="#f3f4f6" />
                  {/* Sound waves in golden amber */}
                  <path d="M21 9c.8 1 .8 3 0 4" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M22.5 7c1.5 2 1.5 6 0 8" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <div className="text-left leading-tight">
                <div className="font-devanagari text-base sm:text-lg font-black text-white tracking-tight">
                  हॉर्न ओके प्लीज़
                </div>
                <div className="text-[10px] tracking-wider text-[#f59e0b] font-mono flex items-center gap-1.5 font-extrabold">
                  <span>HORN OK PLEASEEEE</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#2a170b] text-amber-300 border border-amber-500/50 font-bold">
                    #{activeHornNum}
                  </span>
                </div>
              </div>
            </button>

            {/* Button 2: Chai for the driver */}
            <button
              onClick={handleChaiClick}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-extrabold bg-[#f59e0b] hover:bg-[#fbbf24] text-stone-950 shadow-2xl transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer border border-amber-300"
            >
              <Coffee className="w-5 h-5 fill-black text-black" />
              <span className="font-display font-extrabold tracking-tight">Chai for the driver</span>
            </button>
          </div>

          {/* Fun Chai / Energy Toast */}
          {chaiMessage && (
            <div className="mt-3 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/40 shadow-xl animate-bounce">
              {chaiMessage}
            </div>
          )}
          {/* Gentle scroll invitation down into the empty video view */}
          <button
            onClick={scrollToEmptyView}
            className="mt-5 flex flex-col items-center gap-1 text-[11px] font-semibold text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer group"
          >
            <span>Scroll for pure empty video view</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform animate-bounce" />
          </button>
        </div>

      </section>

      {/* 
        VIEW 2: THE EMPTY VIDEO VIEW
        Exact requirement: "while video there should be some scrool so that the screen looks empty only video should be visible so no other thing looks like see this"
        When scrolled down here:
        - The top header has scrolled out of view.
        - The big "बस ड्राइवर" heading has scrolled out of view.
        - The screen is COMPLETELY EMPTY: ONLY THE VIDEO IS RUNNING!
        - The sleek player dock remains gracefully docked at the bottom of the viewport.
      */}
      <section
        id="empty-video-screen"
        className="min-h-screen h-screen w-full relative z-10 flex flex-col justify-end pb-28 px-4 sm:px-6 pointer-events-none"
      >
        {/* Subtle Zen prompt that fades out */}
        <div className="mx-auto mb-auto pt-16 text-center pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300/80 text-xs font-mono border border-amber-500/20">
            Zen Video Mode · Pure Road Acoustics · Scroll back up for controls
          </span>
        </div>
      </section>

      {/* 
        FLOATING PLAYER DOCK: Always pinned at the bottom of the viewport
        Matches reference frame 00:04 / frame 00:08 in busdriver.wtf!
        Can be toggled via Zen mode if user wants 100% full screen video emptiness!
      */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 px-3 sm:px-6 pb-2.5 pt-4 transition-all duration-300 ${
          isZenMode ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
      >
        {/* Floating Player Dock */}
        <div className="max-w-4xl mx-auto rounded-full sm:rounded-3xl bg-[#22140b]/94 backdrop-blur-2xl border border-[#4a2e1b]/80 p-3 sm:px-6 shadow-2xl ring-1 ring-white/10 text-stone-200">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Left Zone: Circular Vinyl Album Art + Track Info + Scrub Bar */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Circular Vinyl Album Art with reference cover */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg shrink-0 border-2 border-amber-500/40 bg-black">
                <img
                  src={currentTrack?.coverUrl || '/assets/aistudio/silsile_cover.jpg'}
                  alt={currentTrack?.title || 'Album Art'}
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-vinyl-spin' : ''}`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-full border-2 border-black/50 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-600 border border-white" />
              </div>

              {/* Title & Scrub Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 truncate">
                    <span className="text-xs sm:text-sm font-bold text-white truncate block">
                      {currentTrack?.title || 'Silsile Mulaqaton Ke'}
                    </span>
                    <span className="text-[11px] text-stone-400 truncate block">
                      {currentTrack?.artist || 'Alka Yagnik & Mohammad Aziz · PlKtiva'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar with timestamps */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-stone-400 w-8 text-right tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <div
                    onClick={handleProgressBarClick}
                    className="relative flex-1 h-1.5 bg-stone-800 rounded-full cursor-pointer group"
                  >
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white shadow scale-0 group-hover:scale-100 transition-transform"
                      style={{ left: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-stone-400 w-8 tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Zone: Controls matching screenshot */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Prev */}
              <button
                onClick={onPrevious}
                title="Previous / Replay (P)"
                className="p-2 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* White Play / Pause Circle */}
              <button
                onClick={onTogglePlay}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-stone-100 text-stone-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={onNext}
                title="Next / Replay (N)"
                className="p-2 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* Volume */}
              <button
                onClick={() => onVolumeChange(volume === 0 ? 0.85 : 0)}
                title="Volume"
                className="p-2 text-stone-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Queue */}
              <button
                onClick={onOpenQueue}
                title="Open Track Details & Queue (Q)"
                className="p-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <ListMusic className="w-4 h-4" />
              </button>

              {/* Zen / Empty Screen toggle button */}
              <button
                onClick={onToggleZenMode}
                title="Toggle Pure Video Mode (V) - Hide all UI"
                className="p-2 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Strip: Exact matching from reference screenshot */}
        <div className="max-w-4xl mx-auto mt-2 flex flex-wrap items-center justify-between text-[10px] text-stone-400 px-2 py-0.5">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">Space</kbd>
              <span>PLAY / PAUSE</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">←</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">→</kbd>
              <span>SEEK</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">H</kbd>
              <span>HORN</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400/90 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>CONTINUOUS LOOP ACTIVE</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">V</kbd>
              <span>PURE VIDEO</span>
            </span>
          </div>

          {/* Quick scroll button */}
          <button
            onClick={scrollToEmptyView}
            className="flex items-center gap-1 text-[10px] text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer font-sans font-semibold ml-auto"
          >
            <span>Empty Video Screen</span>
            <ChevronDown className="w-3 h-3 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Zen Mode Floating Un-hide Button */}
      {isZenMode && (
        <button
          onClick={onToggleZenMode}
          className="fixed bottom-6 right-6 z-40 px-4 py-2 rounded-full bg-black/80 hover:bg-black text-amber-300 border border-amber-500/40 shadow-2xl flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <Eye className="w-4 h-4" />
          <span>Show Controls (V)</span>
        </button>
      )}
    </div>
  );
};
