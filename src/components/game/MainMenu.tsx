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
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(30 30% 96%) 0%, hsl(25 40% 88%) 100%)'
          }}
        />
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce-soft"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              backgroundColor: `hsla(${[25, 35, 20, 15][Math.floor(Math.random() * 4)]}, 70%, 55%, ${Math.random() * 0.4 + 0.2})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Title */}
        <div className="mb-4 text-7xl animate-bounce-soft">👹</div>
        <h1 
          className="text-4xl md:text-5xl mb-2 text-primary tracking-wider"
          style={{
            fontFamily: '"Trebuchet MS", "Lucida Grande", sans-serif',
            fontWeight: 800,
            fontStyle: 'italic',
            textShadow: '3px 3px 0px hsl(25 70% 30%), 0 0 20px hsl(35 90% 55% / 0.5)'
          }}
        >
          CatMaze
        </h1>
        
        <p className="text-xl font-retro text-muted-foreground mb-12 max-w-md mt-6">
          Navigate the colorful maze! Avoid the spooky ghosts. 
          Find the exit and become the champion! 🏆
        </p>

        {!showLevels ? (
          <div className="flex flex-col gap-4">
            <Button 
              onClick={() => onStartGame(0)}
              size="lg"
              className="text-2xl font-semibold px-14 py-8 bg-primary hover:bg-primary/80 text-primary-foreground box-glow-cognac rounded-full"
            >
              Let's Play! ✨
            </Button>
            <Button 
              onClick={() => setShowLevels(true)}
              variant="outline"
              className="text-xl font-medium border-secondary text-secondary hover:bg-secondary/20 rounded-full py-6"
            >
              Pick a Level 📋
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-4">Pick a Level 🎮</h3>
            <div className="grid gap-3 max-w-sm mx-auto">
              {LEVELS.map((config, index) => {
                const isLocked = index > unlockedLevels;
                const time = bestTimes[index];
                
                return (
                  <Button
                    key={index}
                    onClick={() => !isLocked && onStartGame(index)}
                    disabled={isLocked}
                    variant={isLocked ? "ghost" : "outline"}
                    className={`
                      w-full text-xl font-medium py-6 flex justify-between items-center rounded-xl
                      ${isLocked ? 'opacity-50 cursor-not-allowed' : 'border-primary hover:bg-primary/10'}
                    `}
                  >
                    <span>
                      {isLocked ? '🔒' : '⭐'} Level {index + 1}
                    </span>
                    {time && (
                      <span className="text-base text-secondary">
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
              className="text-lg font-medium text-muted-foreground rounded-full"
            >
              ← Go Back
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-16 text-base font-retro text-muted-foreground space-y-2 bg-card/50 p-4 rounded-2xl">
          <p>🎮 WASD or Arrow Keys to move</p>
          <p>👻 Stay still to hide (Space)</p>
          <p>💨 Shift + Direction to dash</p>
          <p>💣 Collect bombs to blast walls</p>
          <p>⚡👻👁️ Grab power-ups for boosts!</p>
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-4 right-4 text-xs font-retro text-muted-foreground">
        v1.0 - "Into South Building"
      </div>
    </div>
  );
}
