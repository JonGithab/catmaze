import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LEVELS } from '@/lib/gameState';

interface MainMenuProps {
  onStartGame: (level: number) => void;
  bestTimes: Record<number, number>;
  unlockedLevels: number;
}

export function MainMenu({ onStartGame, bestTimes, unlockedLevels }: MainMenuProps) {
  const [showLevels, setShowLevels] = useState(false);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Sky blue gradient background */}
      <div className="absolute inset-0 overflow-hidden bg-background">
        {/* Floating sparkles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 6 + 3,
              height: Math.random() * 6 + 3,
              backgroundColor: `hsla(${[45, 330, 180, 200][Math.floor(Math.random() * 4)]}, 80%, 70%, ${Math.random() * 0.6 + 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Main card container */}
      <div className="relative z-10 bg-card rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full mx-4">
        <div className="text-center">
          {/* Title */}
          <div className="mb-2 text-6xl animate-bounce-soft">😺</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-1">
            <span className="text-secondary">Cat</span>
            <span className="text-primary">Maze</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 mt-4">
            A Colorful Maze Adventure
          </p>

          {!showLevels ? (
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => onStartGame(0)}
                size="lg"
                className="w-full text-xl font-bold py-7 bg-primary hover:bg-primary/90 text-primary-foreground box-glow-pink rounded-xl transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95"
              >
                ▶ Start Adventure
              </Button>
              <Button 
                onClick={() => setShowLevels(true)}
                className="w-full text-xl font-bold py-7 bg-secondary hover:bg-secondary/90 text-secondary-foreground box-glow-cyan rounded-xl transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              >
                📈 Select Level
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-foreground mb-4">Choose a Level 🎮</h3>
              <div className="grid gap-3">
                {LEVELS.map((config, index) => {
                  const isLocked = index > unlockedLevels;
                  const time = bestTimes[index];
                  
                  return (
                    <Button
                      key={index}
                      onClick={() => !isLocked && onStartGame(index)}
                      disabled={isLocked}
                      variant="outline"
                      className={`
                        w-full text-lg font-semibold py-5 flex justify-between items-center rounded-xl transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95
                        ${isLocked 
                          ? 'opacity-50 cursor-not-allowed bg-muted' 
                          : 'border-2 border-primary/30 hover:bg-primary/10 hover:border-primary'
                        }
                      `}
                    >
                      <span>
                        {isLocked ? '🔒' : '⭐'} Level {index + 1}
                      </span>
                      {time && (
                        <span className="text-sm text-secondary font-medium">
                          ⏱ {formatTime(time)}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
              <Button 
                onClick={() => setShowLevels(false)}
                variant="ghost"
                className="text-base font-medium text-muted-foreground rounded-full transition-all duration-200 hover:scale-105 active:scale-95 mt-2"
              >
                ← Back
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 text-sm text-muted-foreground space-y-1.5 bg-muted/50 p-4 rounded-xl border border-border">
            <p className="font-semibold text-foreground mb-2">Controls</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-left">
              <p>← → or A/D: Move</p>
              <p>↑, W or Space: Jump</p>
              <p>Shift: Dash</p>
              <p>B: Use Bomb</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
