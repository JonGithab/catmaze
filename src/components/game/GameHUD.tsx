import { GameState, LEVELS } from '@/lib/gameState';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  state: GameState;
  elapsedSeconds: number;
}

export function GameHUD({ state, elapsedSeconds }: GameHUDProps) {
  const config = LEVELS[Math.min(state.level, LEVELS.length - 1)];
  const dangerLevel = Math.max(0, 1 - (state.stalkerDistance / 10));
  const heartbeatClass = dangerLevel > 0.7 ? 'animate-heartbeat-fast' : dangerLevel > 0.3 ? 'animate-heartbeat' : '';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-card/90 backdrop-blur-sm rounded-2xl border-2 border-primary/30 min-w-[200px] shadow-lg">
      {/* Level indicator */}
      <div className="text-center">
        <div className="text-muted-foreground text-sm font-retro">LEVEL</div>
        <div className="text-2xl font-pixel text-glow-pink text-primary">{state.level + 1}</div>
      </div>

      {/* Timer */}
      <div className="text-center">
        <div className="text-muted-foreground text-sm font-retro">TIME ⏱️</div>
        <div className="text-xl font-pixel tabular-nums text-foreground">
          {formatTime(elapsedSeconds)}
        </div>
      </div>

      {/* Danger meter */}
      <div>
        <div className="text-muted-foreground text-sm font-retro mb-2">DANGER 👻</div>
        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "absolute inset-y-0 left-0 transition-all duration-300 rounded-full",
              dangerLevel > 0.7 ? "bg-danger" : dangerLevel > 0.3 ? "bg-accent" : "bg-success"
            )}
            style={{ width: `${dangerLevel * 100}%` }}
          />
        </div>
        <div 
          className={cn(
            "text-2xl text-center mt-2",
            heartbeatClass
          )}
        >
          {dangerLevel > 0.7 ? '😱' : dangerLevel > 0.3 ? '😰' : '😸'}
        </div>
      </div>

      {/* Bombs */}
      <div className="text-center">
        <div className="text-muted-foreground text-sm font-retro">BOMBS 💣</div>
        <div className="text-xl">
          {Array(state.bombs).fill('💣').join(' ') || '—'}
        </div>
      </div>

      {/* Dash cooldown */}
      <div className="text-center">
        <div className="text-muted-foreground text-sm font-retro">DASH 💨</div>
        <div className={cn(
          "text-lg font-pixel",
          state.dashCooldown > 0 ? "text-muted-foreground" : "text-primary text-glow-pink"
        )}>
          {state.dashCooldown > 0 ? `${state.dashCooldown}` : 'READY ✨'}
        </div>
      </div>

      {/* Freeze status */}
      {state.isFreeze && (
        <div className="text-center p-2 bg-secondary/30 rounded-xl animate-pulse">
          <div className="text-sm font-pixel text-secondary">HIDING... 🙈</div>
          <div className="text-xs text-muted-foreground font-retro">Vision fading</div>
        </div>
      )}

      {/* Silent step indicator */}
      {state.silentStep && (
        <div className="text-center p-2 bg-primary/20 rounded-xl box-glow-pink">
          <div className="text-sm font-pixel text-primary">SILENT STEP! 🤫</div>
        </div>
      )}

      {/* Controls help */}
      <div className="text-xs text-muted-foreground font-retro space-y-1 pt-4 border-t border-primary/20">
        <div>🎮 WASD/Arrows: Move</div>
        <div>👻 Space: Hold to Hide</div>
        <div>💨 Shift+Move: Dash</div>
        <div>💣 B+Direction: Bomb</div>
      </div>
    </div>
  );
}
