import React, { useEffect, useState, useCallback } from 'react';
import { HeroSection } from './components/HeroSection';
import { PlaylistSection } from './components/PlaylistSection';
import { ShareModal } from './components/ShareModal';
import { QueueDrawer } from './components/QueueDrawer';
import { QueueFloatingCard } from './components/QueueFloatingCard';
import { TicketModal } from './components/TicketModal';
import { DriverProfileModal } from './components/DriverProfileModal';
import { AmbienceMixerModal } from './components/AmbienceMixerModal';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { RoleSelectModal } from './components/RoleSelectModal';
import { FLAGSHIP_COMMON_TRACK, PLAYLISTS, TRACKS, VEHICLE_WORLDS } from './data/musicData';
import { audioEngine } from './services/audioEngine';
import { Track, UserRoleMode, VehicleCategory } from './types';

export default function App() {
  // Journey Role: 'drive' (Want to Drive / Driver POV) vs 'ride' (Want to Ride / Passenger Mode)
  const [userRole, setUserRole] = useState<UserRoleMode>('ride');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Category state (Bus, Car, Bike)
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>('bus');

  // Active playlist within category
  const [activePlaylistId, setActivePlaylistId] = useState<string>('bus-driver-special');

  // Currently loaded track: In all cases, ONLY this one single song
  const [currentTrack, setCurrentTrack] = useState<Track | null>(FLAGSHIP_COMMON_TRACK);

  // Playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(288);
  const [volume, setVolume] = useState<number>(0.85);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.16);
  const [isAmbienceActive, setIsAmbienceActive] = useState<boolean>(true);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('one');

  // Dedicated Loop option to replay continuously
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Zen Mode: Hides even the bottom player dock for 100% full-screen empty video
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Horn tracking: Alternating between Horn 1 and Horn 2 "one by one"
  const [lastHornNumber, setLastHornNumber] = useState<1 | 2>(1);
  const [isHornHonking, setIsHornHonking] = useState<boolean>(false);

  // Playback queue: Contains only the one song
  const [queue, setQueue] = useState<Track[]>([FLAGSHIP_COMMON_TRACK]);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isAmbienceMixerOpen, setIsAmbienceMixerOpen] = useState<boolean>(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);

  // Active world configuration
  const currentWorld = VEHICLE_WORLDS[activeCategory];
  const categoryPlaylists = PLAYLISTS.filter((p) =>
    activeCategory === 'bus' || activeCategory === 'car' ? p.category === 'bus' || p.category === 'car' : p.category === 'bike'
  );

  // Initialize loop setting in audio engine
  useEffect(() => {
    audioEngine.setLoop(isLooping);
  }, [isLooping]);

  // Sync callbacks with AudioEngine
  useEffect(() => {
    audioEngine.setCallbacks({
      onTimeUpdate: (curTime, dur) => {
        setCurrentTime(curTime);
        setDuration(dur);
      },
      onTrackEnded: () => {
        handleNextTrack();
      },
      onPlayStateChange: (playing) => {
        setIsPlaying(playing);
      },
    });
  }, [currentTrack, isLooping]);

  // Handle Play the track
  const handlePlayTrack = useCallback(
    (track: Track = FLAGSHIP_COMMON_TRACK) => {
      setCurrentTrack(track);
      audioEngine.setLoop(isLooping);
      audioEngine.playTrack(track, 0);
    },
    [isLooping]
  );

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    const track = currentTrack || FLAGSHIP_COMMON_TRACK;
    audioEngine.togglePlay(track);
  }, [currentTrack]);

  // Toggle Dedicated Loop Replay
  const handleToggleLoop = useCallback(() => {
    setIsLooping((prev) => {
      const next = !prev;
      audioEngine.setLoop(next);
      return next;
    });
  }, []);

  // Seekbar
  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  };

  // Next Track: Only one song exists in all cases, so Next restarts it smoothly
  const handleNextTrack = useCallback(() => {
    audioEngine.seek(0);
    audioEngine.playTrack(FLAGSHIP_COMMON_TRACK, 0);
  }, []);

  // Previous Track: Replays from beginning
  const handlePreviousTrack = useCallback(() => {
    audioEngine.seek(0);
    audioEngine.playTrack(FLAGSHIP_COMMON_TRACK, 0);
  }, []);

  // Category Switcher: Keeps the single flagship track in all cases
  const handleSelectCategory = (category: VehicleCategory) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    setCurrentTrack(FLAGSHIP_COMMON_TRACK);
  };

  // Role Selection (Want to Drive vs Want to Ride)
  const handleSelectRole = (role: UserRoleMode) => {
    setUserRole(role);
    setIsRoleModalOpen(false);
  };

  // Add to Queue
  const handleAddToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  // Clear Queue
  const handleClearQueue = () => {
    setQueue([]);
  };

  // Vehicle Ambience Volume Change
  const handleAmbientVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    audioEngine.setAmbientVolume(vol);
  };

  // Toggle Ambience Mute
  const handleToggleAmbience = () => {
    const active = audioEngine.toggleAmbientMute();
    setIsAmbienceActive(active);
  };

  // Master Volume
  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  // Trigger Horn (Plays Horn 1 & Horn 2 "both one by one") and vibrates banner
  const handleTriggerHorn = useCallback((forceHorn?: 1 | 2): 1 | 2 => {
    const played = audioEngine.triggerVehicleHorn(activeCategory, forceHorn);
    setLastHornNumber(played);
    setIsHornHonking(true);
    setTimeout(() => {
      setIsHornHonking(false);
    }, 1400);
    return played;
  }, [activeCategory]);

  // Play Chai pour sound
  const handlePlayChai = () => {
    audioEngine.playChaiSound();
  };

  // Keyboard Shortcuts: Space, H (Horn), L (Loop), V (Zen mode), T (Ticket), Q (Queue), N (Next), P (Prev), ←/→
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'h' || e.key === 'H') {
        handleTriggerHorn();
      } else if (e.key === 'l' || e.key === 'L') {
        handleToggleLoop();
      } else if (e.key === 'v' || e.key === 'V') {
        setIsZenMode((prev) => !prev);
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsQueueOpen((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        setIsTicketModalOpen((prev) => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        handleNextTrack();
      } else if (e.key === 'p' || e.key === 'P') {
        handlePreviousTrack();
      } else if (e.key === 'ArrowRight') {
        handleSeek(Math.min(duration, currentTime + 5));
      } else if (e.key === 'ArrowLeft') {
        handleSeek(Math.max(0, currentTime - 5));
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleAmbience();
      } else if (e.key === 'Escape') {
        if (isZenMode) {
          setIsZenMode(false);
        }
        setIsShareOpen(false);
        setIsTicketModalOpen(false);
        setIsDriverModalOpen(false);
        setIsQueueOpen(false);
        setIsAmbienceMixerOpen(false);
        setIsFullScreenOpen(false);
        setIsRoleModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleTogglePlay,
    handleTriggerHorn,
    handleToggleLoop,
    handleToggleAmbience,
    handleNextTrack,
    handlePreviousTrack,
    currentTime,
    duration,
    isZenMode,
  ]);

  return (
    <div className="relative min-h-screen bg-[#0d0907] text-[#f5efe6] selection:bg-amber-500 selection:text-black">
      {/* 
        PERMANENT FIXED FULLSCREEN BACKGROUND VIDEO
        Ensures that as the user scrolls, the road video stays playing seamlessly across the viewport!
      */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {activeCategory === 'bike' ? (
          <iframe
            src="https://www.youtube.com/embed/LbUVXaSon2Y?autoplay=1&mute=1&loop=1&playlist=LbUVXaSon2Y&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Bike Rider Endless Loop"
            className="w-[125%] h-[125%] -translate-x-[10%] -translate-y-[10%] max-w-none object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : activeCategory === 'car' ? (
          <iframe
            src="https://www.youtube.com/embed/iuhXwVNdz4w?autoplay=1&mute=1&loop=1&playlist=iuhXwVNdz4w&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Car Cruiser Endless Loop"
            className="w-[125%] h-[125%] -translate-x-[10%] -translate-y-[10%] max-w-none object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : userRole === 'drive' ? (
          <iframe
            src="https://www.youtube.com/embed/X8kzDBvSq6o?autoplay=1&mute=1&loop=1&playlist=X8kzDBvSq6o&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&enablejsapi=1&playsinline=1"
            title="Endless Highway Driving Loop"
            className="w-[125%] h-[125%] -translate-x-[10%] -translate-y-[10%] max-w-none object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : (
          <video
            src="/assets/aistudio/road_5b022dc9.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Rain streaks overlay matching reference screenshot */}
        <div className="absolute inset-0 rain-overlay pointer-events-none opacity-45" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* 
        MAIN CONTENT FLOW:
        1. Hero Section (Header + Headline + Action Buttons)
        2. Empty Video Screen (User scrolls down -> screen is empty, only video is visible)
        3. Pinned Bottom Floating Player Dock
      */}
      <HeroSection
        world={currentWorld}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        userRole={userRole}
        onSelectRole={setUserRole}
        onOpenRoleModal={() => setIsDriverModalOpen(true)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onTogglePlay={handleTogglePlay}
        onPrevious={handlePreviousTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onTriggerHorn={handleTriggerHorn}
        lastHornNumber={lastHornNumber}
        isHornHonking={isHornHonking}
        onPlayChai={handlePlayChai}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenShare={() => setIsTicketModalOpen(true)}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode((prev) => !prev)}
      />

      {/* 
        TRANSLUCENT HIGHWAY HUB (Below the empty video screen)
        Allows user to explore track lyrics, soundboard tests, and details if they scroll further
      */}
      <main className="relative z-10 pb-36 pt-16 max-w-6xl mx-auto w-full px-4 sm:px-6">
        <PlaylistSection
          playlists={categoryPlaylists}
          tracks={TRACKS}
          activePlaylistId={activePlaylistId}
          onSelectPlaylist={(pId) => setActivePlaylistId(pId)}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          isLooping={isLooping}
          onToggleLoop={handleToggleLoop}
          onPlayTrack={handlePlayTrack}
          onTogglePlay={handleTogglePlay}
          onAddToQueue={handleAddToQueue}
          activeCategory={activeCategory}
        />

        {/* Highway Road Culture & Acoustic Horn Hub */}
        <section className="py-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-[#18110c]/85 border border-amber-900/40 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                ACOUSTIC REALISM & DUAL AIR HORNS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                Authentic Indian Musical Air Horns (Playing Both One by One)
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
                Featuring real high-fidelity recordings of the legendary Indian highway multi-tone air horns (Horn #1 & Horn #2).
                Click <em>हॉर्न ओके प्लीज़</em> or press <kbd className="px-1.5 py-0.5 rounded bg-black border border-amber-500/40 text-amber-300 font-mono text-xs">H</kbd> to cycle both horns sequentially.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleTriggerHorn(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1e140d] hover:bg-[#2e1d13] border border-amber-500/40 text-amber-300 transition-all cursor-pointer shadow-md"
              >
                🎺 Play Horn #1
              </button>
              <button
                onClick={() => handleTriggerHorn(2)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1e140d] hover:bg-[#2e1d13] border border-amber-500/40 text-amber-300 transition-all cursor-pointer shadow-md"
              >
                🎺 Play Horn #2
              </button>
              <button
                onClick={() => setIsAmbienceMixerOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all cursor-pointer"
              >
                Ambience Mixer
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Driver Profile Modal: "Who's driving?" */}
      <DriverProfileModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onPlayChai={handlePlayChai}
        userRole={userRole}
        onSelectRole={handleSelectRole}
        activeCategory={activeCategory}
      />

      {/* Journey Mode Selector Modal: WANT TO DRIVE vs WANT TO RIDE */}
      <RoleSelectModal
        isOpen={isRoleModalOpen}
        onSelectRole={handleSelectRole}
        currentRole={userRole}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Bus Boarding Ticket Modal */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        currentTrack={currentTrack}
        activeCategory={activeCategory}
      />

      {/* In-Place Floating Queue & Playlist Card */}
      <QueueFloatingCard
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        playlists={categoryPlaylists}
        tracks={TRACKS}
        activePlaylistId={activePlaylistId}
        onSelectPlaylist={(pId) => setActivePlaylistId(pId)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayTrack={handlePlayTrack}
        onTogglePlay={handleTogglePlay}
        onOpenShare={() => setIsTicketModalOpen(true)}
        activeCategory={activeCategory}
      />

      {/* Sharing & QR Code Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        currentTrack={currentTrack}
        activeCategory={activeCategory}
      />

      {/* Vehicle Ambience Engine Mixer Modal */}
      <AmbienceMixerModal
        isOpen={isAmbienceMixerOpen}
        onClose={() => setIsAmbienceMixerOpen(false)}
        world={currentWorld}
        activeCategory={activeCategory}
        ambientVolume={ambientVolume}
        isAmbienceActive={isAmbienceActive}
        onAmbientVolumeChange={handleAmbientVolumeChange}
        onToggleAmbience={handleToggleAmbience}
        onTriggerHorn={() => handleTriggerHorn()}
      />

      {/* Fullscreen Driver Cockpit View */}
      <FullScreenPlayer
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        world={currentWorld}
        userRole={userRole}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isLooping={isLooping}
        onToggleLoop={handleToggleLoop}
        activeCategory={activeCategory}
        onTogglePlay={handleTogglePlay}
        onPrevious={handlePreviousTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onTriggerHorn={() => handleTriggerHorn()}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-amber-950/40 bg-[#070504]/90 backdrop-blur-md py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-300">Safar Beats · बस ड्राइवर</span>
            <span>·</span>
            <span>Endless Highway Radio with Authentic Air Horns & Engine Acoustics</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-400 font-mono">
            <span>[Space] Play/Pause</span>
            <span>·</span>
            <span>[H] Horns</span>
            <span>·</span>
            <span>[L] Loop</span>
            <span>·</span>
            <span>[V] Pure Video</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
