import React from 'react';
import { X, Coffee, Instagram, ExternalLink } from 'lucide-react';
import { UserRoleMode, VehicleCategory } from '../types';

interface DriverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayChai: () => void;
  userRole: UserRoleMode;
  onSelectRole: (role: UserRoleMode) => void;
  activeCategory: VehicleCategory;
}

export const DriverProfileModal: React.FC<DriverProfileModalProps> = ({
  isOpen,
  onClose,
  onPlayChai,
  userRole,
  onSelectRole,
  activeCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#1e1510]/95 border border-amber-500/30 p-6 sm:p-7 text-stone-100 shadow-2xl overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Driver Avatar: Looping Road Video with Instagram Gradient Ring */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[3px] shadow-2xl mb-3 flex items-center justify-center relative">
            <div className="w-full h-full rounded-full overflow-hidden bg-black relative border-2 border-black">
              <video
                src="/assets/aistudio/road_5b022dc9.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
            {/* Instagram Live Icon Badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-lg border-2 border-[#1e1510]">
              <Instagram className="w-3.5 h-3.5" />
            </div>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
            <span>Satya Rai</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              DRIVER
            </span>
          </h3>

          <p className="text-xs text-amber-400 font-mono mt-0.5 font-bold">
            @satya_raiii
          </p>

          <p className="text-xs text-stone-300 mt-2 max-w-[270px] leading-relaxed">
            I drive this bus across NH 48. Highway lover, road cruiser, and curator of the ultimate cassette beats.
          </p>

          {/* Follow Instagram Button with actual requested URL */}
          <a
            href="https://www.instagram.com/satya_raiii/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-4 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-lg hover:opacity-95 transition-all cursor-pointer ring-1 ring-white/20 hover:scale-[1.02]"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @satya_raiii</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          {/* Buy the driver a chai button */}
          <button
            onClick={() => {
              onPlayChai();
              onClose();
            }}
            className="w-full mt-3 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#fbbf24] text-stone-950 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-amber-300"
          >
            <Coffee className="w-4 h-4 fill-current" />
            <span>Chai for Driver Satya Rai</span>
          </button>

          {/* Driver Journey Role Selector */}
          <div className="w-full mt-5 pt-4 border-t border-amber-900/40">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 font-mono">
              JOURNEY EXPERIENCE MODE
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectRole('drive')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userRole === 'drive'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                    : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800'
                }`}
              >
                <span>🚗 Driver POV</span>
              </button>
              <button
                onClick={() => onSelectRole('ride')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userRole === 'ride'
                    ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                    : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800'
                }`}
              >
                <span>💺 Passenger</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
