import { Button } from '@/components/ui/button';
import { GameState } from '@/lib/gameState';
import { cn } from '@/lib/utils';

interface GameOverScreenProps {
  state: GameState;
  onRestart: () => void;
  onNextLevel: () => void;
  onMainMenu: () => void;
  bestTimes: Record<number, number>;
}

export function GameOverScreen({ state, onRestart, onNextLevel, onMainMenu, bestTimes }: GameOverScreenProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const isNewBest = state.isVictory && (!bestTimes[state.level] || state.elapsedTime < bestTimes[state.level]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div 
        className={cn(
          "p-8 rounded-2xl text-center max-w-md mx-4 shadow-2xl",
          state.isVictory ? "box-glow-pink" : "box-glow-red"
        )}
        style={{
          backgroundColor: 'hsl(45 80% 94%)',
          border: state.isVictory ? '4px solid hsl(320 85% 55%)' : '4px solid hsl(0 80% 60%)'
        }}
      >
        {state.isVictory ? (
          <>
            <div className="text-6xl mb-4 animate-bounce-soft">🎉</div>
            <h2 className="text-3xl font-pixel text-glow-pink text-primary mb-4">HOORAY!</h2>
            <p className="text-xl font-retro text-foreground mb-2">
              Level {state.level + 1} Complete! 🏆
            </p>
            <div className="text-2xl font-pixel text-secondary mb-4">
              {formatTime(state.elapsedTime)}
            </div>
            {isNewBest && (
              <div className="text-lg font-pixel text-success mb-4 animate-pulse">
                ⭐ NEW BEST TIME! ⭐
              </div>
            )}
            {bestTimes[state.level] && !isNewBest && (
              <div className="text-sm text-muted-foreground font-retro mb-4">
                Best: {formatTime(bestTimes[state.level])}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">😿</div>
            <h2 className="text-3xl font-pixel text-glow-red text-danger mb-4">OH NO!</h2>
            <p className="text-xl font-retro text-foreground mb-4">
              The ghost caught you! 👻
            </p>
            <div className="text-lg text-muted-foreground font-retro">
              Survived: {formatTime(state.elapsedTime)}
            </div>
          </>
        )}

        <div className="flex flex-col gap-3 mt-8">
          {state.isVictory && state.level < 4 && (
            <Button 
              onClick={onNextLevel}
              className="w-full font-pixel text-sm bg-primary hover:bg-primary/80 text-primary-foreground rounded-full"
            >
              NEXT LEVEL → ✨
            </Button>
          )}
          <Button 
            onClick={onRestart}
            variant="outline"
            className="w-full font-pixel text-sm border-primary text-primary hover:bg-primary/10 rounded-full"
          >
            TRY AGAIN 🔄
          </Button>
          <Button 
            onClick={onMainMenu}
            variant="ghost"
            className="w-full font-pixel text-xs text-muted-foreground hover:text-foreground rounded-full"
          >
            MAIN MENU 🏠
          </Button>
        </div>
      </div>
    </div>
  );
}
