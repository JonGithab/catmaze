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
            className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-lg bg-muted/80 backdrop-blur border border-border/50 flex items-center justify-center active:bg-primary/50 active:scale-95 transition-all touch-manipulation"
            onTouchStart={(e) => {
              e.preventDefault();
              onMove(0, -1);
            }}
          >
            <ChevronUp className="w-6 h-6 text-foreground" />
          </button>

          {/* Down */}
          <button
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-lg bg-muted/80 backdrop-blur border border-border/50 flex items-center justify-center active:bg-primary/50 active:scale-95 transition-all touch-manipulation"
            onTouchStart={(e) => {
              e.preventDefault();
              onMove(0, 1);
            }}
          >
            <ChevronDown className="w-6 h-6 text-foreground" />
          </button>

          {/* Left */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-muted/80 backdrop-blur border border-border/50 flex items-center justify-center active:bg-primary/50 active:scale-95 transition-all touch-manipulation"
            onTouchStart={(e) => {
              e.preventDefault();
              onMove(-1, 0);
            }}
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Right */}
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg bg-muted/80 backdrop-blur border border-border/50 flex items-center justify-center active:bg-primary/50 active:scale-95 transition-all touch-manipulation"
            onTouchStart={(e) => {
              e.preventDefault();
              onMove(1, 0);
            }}
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 border border-border/30" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Freeze Button */}
          <button
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all touch-manipulation ${
              isFreeze
                ? 'bg-cyan-500/80 scale-110'
                : 'bg-cyan-600/60 backdrop-blur border border-cyan-400/50'
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
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all touch-manipulation relative ${
              dashCooldown > 0
                ? 'bg-muted/40 opacity-50'
                : 'bg-yellow-500/60 backdrop-blur border border-yellow-400/50 active:bg-yellow-400/80 active:scale-95'
            }`}
            disabled={dashCooldown > 0}
            onTouchStart={(e) => {
              e.preventDefault();
              if (dashCooldown <= 0) {
                // Dash in last moved direction or default to right
                onDash(1, 0);
              }
            }}
          >
            <Zap className="w-6 h-6 text-white" />
            {dashCooldown > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                {dashCooldown}
              </span>
            )}
          </button>

          {/* Bomb Button */}
          <button
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all touch-manipulation relative ${
              bombCount <= 0
                ? 'bg-muted/40 opacity-50'
                : 'bg-orange-500/60 backdrop-blur border border-orange-400/50 active:bg-orange-400/80 active:scale-95'
            }`}
            disabled={bombCount <= 0}
            onTouchStart={(e) => {
              e.preventDefault();
              if (bombCount > 0) {
                // Bomb in front direction (default to up)
                onBomb('up');
              }
            }}
          >
            <Bomb className="w-6 h-6 text-white" />
            {bombCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {bombCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
