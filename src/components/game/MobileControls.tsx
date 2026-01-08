import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Bomb, Zap, Snowflake } from 'lucide-react';

interface MobileControlsProps {
  onMove: (dx: number, dy: number) => void;
  onDash: (dx: number, dy: number) => void;
  onBomb: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onFreezeStart: () => void;
  onFreezeEnd: () => void;
  bombCount: number;
  dashCooldown: number;
  isFreeze: boolean;
}

export function MobileControls({
  onMove,
  onDash,
  onBomb,
  onFreezeStart,
  onFreezeEnd,
  bombCount,
  dashCooldown,
  isFreeze,
}: MobileControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none md:hidden">
      <div className="flex justify-between items-end max-w-lg mx-auto">
        {/* D-Pad */}
        <div className="relative w-36 h-36 pointer-events-auto">
          {/* Up */}
          <button
            className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm border-2 border-primary/40 flex items-center justify-center active:bg-primary/50 active:scale-95 transition-all touch-manipulation shadow-lg"
            onTouchStart={(e) => {
              e.preventDefault();
              onMove(0, -1);
            }}
          >
            <ChevronUp className="w-6 h-6 text-primary" />
          </button>

          {/* Down */}
          <button
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm border-2 border-primary/40 flex items-center justify-center active:bg-primary/50 active:scale-95 transition-all touch-manipulation shadow-lg"
            onTouchStart={(e) => {
              e.preventDefault();
              onMove(0, 1);
            }}
          >
            <ChevronDown className="w-6 h-6 text-primary" />
          </button>

          {/* Left */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm border-2 border-primary/40 flex items-center justify-center active:bg-primary/50 active:scale-95 transition-all touch-manipulation shadow-lg"
            onTouchStart={(e) => {
              e.preventDefault();
              onMove(-1, 0);
            }}
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          {/* Right */}
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm border-2 border-primary/40 flex items-center justify-center active:bg-primary/50 active:scale-95 transition-all touch-manipulation shadow-lg"
            onTouchStart={(e) => {
              e.preventDefault();
              onMove(1, 0);
            }}
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-lg">
            🐱
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Freeze Button */}
          <button
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all touch-manipulation shadow-lg ${
              isFreeze
                ? 'bg-secondary scale-110'
                : 'bg-secondary/80 backdrop-blur-sm border-2 border-secondary/60'
            }`}
            onTouchStart={(e) => {
              e.preventDefault();
              onFreezeStart();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onFreezeEnd();
            }}
          >
            <Snowflake className="w-6 h-6 text-white" />
          </button>

          {/* Dash Button */}
          <button
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all touch-manipulation relative shadow-lg ${
              dashCooldown > 0
                ? 'bg-muted/60 opacity-50'
                : 'bg-accent/90 backdrop-blur-sm border-2 border-accent/60 active:bg-accent active:scale-95'
            }`}
            disabled={dashCooldown > 0}
            onTouchStart={(e) => {
              e.preventDefault();
              if (dashCooldown <= 0) {
                onDash(1, 0);
              }
            }}
          >
            <Zap className="w-6 h-6 text-foreground" />
            {dashCooldown > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                {dashCooldown}
              </span>
            )}
          </button>

          {/* Bomb Button */}
          <button
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all touch-manipulation relative shadow-lg ${
              bombCount <= 0
                ? 'bg-muted/60 opacity-50'
                : 'bg-primary/90 backdrop-blur-sm border-2 border-primary/60 active:bg-primary active:scale-95'
            }`}
            disabled={bombCount <= 0}
            onTouchStart={(e) => {
              e.preventDefault();
              if (bombCount > 0) {
                onBomb('up');
              }
            }}
          >
            <Bomb className="w-6 h-6 text-white" />
            {bombCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
                {bombCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
