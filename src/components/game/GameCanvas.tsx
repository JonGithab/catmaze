import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  GameState, 
  createInitialState, 
  movePlayer, 
  moveStalker, 
  useBomb, 
  dash,
  toggleFreeze,
  updateFreezeVision,
  spawnSecondStalker,
  updatePowerUps,
  LEVELS
} from '@/lib/gameState';
import { MazeRenderer } from './MazeRenderer';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { MobileControls } from './MobileControls';
import {
  initAudio,
  playFootstep,
  playStalkerGrowl,
  playVictoryFanfare,
  playGameOver,
  playExplosion,
  playDash,
  playFreeze,
  playTrap,
  playPickup,
  startHeartbeat,
  stopHeartbeat,
  startAmbient,
  stopAmbient,
} from '@/lib/audioEngine';

interface GameCanvasProps {
  level: number;
  onMainMenu: () => void;
  bestTimes: Record<number, number>;
  onNewBestTime: (level: number, time: number) => void;
  onLevelComplete: (level: number) => void;
}

export function GameCanvas({ level, onMainMenu, bestTimes, onNewBestTime, onLevelComplete }: GameCanvasProps) {
  const [state, setState] = useState<GameState>(() => createInitialState(level));
  const [shaking, setShaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const bombMode = useRef(false);
  const lastStalkerGrowl = useRef(0);
  const lastMoveDirection = useRef<{ dx: number; dy: number }>({ dx: 1, dy: 0 });

  // Initialize audio on touch or key
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      startAmbient();
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    return () => {
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      stopAmbient();
      stopHeartbeat();
    };
  }, []);

  // Mobile control handlers
  const handleMobileMove = useCallback((dx: number, dy: number) => {
    if (state.isGameOver || state.isVictory) return;
    lastMoveDirection.current = { dx, dy };
    setState(prev => movePlayer(prev, dx, dy));
    playFootstep();
  }, [state.isGameOver, state.isVictory]);

  const handleMobileDash = useCallback((dx: number, dy: number) => {
    if (state.isGameOver || state.isVictory || state.dashCooldown > 0) return;
    setState(prev => dash(prev, dx, dy));
    playDash();
    setShaking(true);
    setTimeout(() => setShaking(false), 100);
  }, [state.isGameOver, state.isVictory, state.dashCooldown]);

  const handleMobileBomb = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (state.isGameOver || state.isVictory || state.bombs <= 0) return;
    setState(prev => useBomb(prev, direction));
    playExplosion();
    setShaking(true);
    setTimeout(() => setShaking(false), 150);
  }, [state.isGameOver, state.isVictory, state.bombs]);

  const handleMobileFreezeStart = useCallback(() => {
    playFreeze();
    setState(prev => toggleFreeze(prev, true));
  }, []);

  const handleMobileFreezeEnd = useCallback(() => {
    setState(prev => toggleFreeze(prev, false));
  }, []);

  // Handle heartbeat and stalker growl based on distance
  useEffect(() => {
    if (state.isGameOver || state.isVictory) {
      stopHeartbeat();
      return;
    }
    const intensity = Math.max(0, 1 - (state.stalkerDistance / 10));
    startHeartbeat(intensity);
    
    if (intensity > 0.6) {
      const now = Date.now();
      if (now - lastStalkerGrowl.current > 2000) {
        playStalkerGrowl();
        lastStalkerGrowl.current = now;
      }
    }
  }, [state.stalkerDistance, state.isGameOver, state.isVictory]);

  // Victory/Game over sounds
  useEffect(() => {
    if (state.isVictory) {
      stopAmbient();
      playVictoryFanfare();
    } else if (state.isGameOver) {
      stopAmbient();
      playGameOver();
    }
  }, [state.isVictory, state.isGameOver]);

  // Timer and power-up decay
  useEffect(() => {
    if (state.isGameOver || state.isVictory) return;

    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - state.startTime) / 1000));
      
      // Check for second stalker spawn
      const config = LEVELS[Math.min(state.level, LEVELS.length - 1)];
      if (elapsedSeconds >= config.secondStalkerTime && !state.secondStalkerSpawned) {
        setState(prev => spawnSecondStalker(prev));
      }

      // Update power-up timers
      setState(prev => updatePowerUps(prev, 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [state.startTime, state.isGameOver, state.isVictory, state.level, state.secondStalkerSpawned, elapsedSeconds]);

  // Stalker movement
  useEffect(() => {
    if (state.isGameOver || state.isVictory || state.isFreeze) return;

    const config = LEVELS[Math.min(state.level, LEVELS.length - 1)];
    const interval = setInterval(() => {
      setState(prev => moveStalker(prev));
    }, config.stalkerSpeed);

    return () => clearInterval(interval);
  }, [state.isGameOver, state.isVictory, state.isFreeze, state.level]);

  // Freeze vision decay
  useEffect(() => {
    if (!state.isFreeze) return;

    const interval = setInterval(() => {
      setState(prev => updateFreezeVision(prev));
    }, 100);

    return () => clearInterval(interval);
  }, [state.isFreeze]);

  // Trap timer
  useEffect(() => {
    const cell = state.maze.grid[state.playerY]?.[state.playerX];
    if (cell?.type !== 'trap') return;

    const timer = setTimeout(() => {
      // Reset to start
      setState(prev => ({
        ...prev,
        playerX: prev.maze.startX,
        playerY: prev.maze.startY,
        maze: {
          ...prev.maze,
          grid: prev.maze.grid.map((row, y) =>
            row.map((c, x) => 
              x === prev.playerX && y === prev.playerY 
                ? { ...c, type: 'floor' as const, crumbling: false }
                : c
            )
          )
        }
      }));
      setShaking(true);
      setTimeout(() => setShaking(false), 200);
    }, 1000);

    // Show crumbling animation
    setState(prev => ({
      ...prev,
      maze: {
        ...prev.maze,
        grid: prev.maze.grid.map((row, y) =>
          row.map((c, x) => 
            x === prev.playerX && y === prev.playerY 
              ? { ...c, crumbling: true }
              : c
          )
        )
      }
    }));

    return () => clearTimeout(timer);
  }, [state.playerX, state.playerY]);

  // Dash cooldown
  useEffect(() => {
    if (state.dashCooldown <= 0) return;

    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, dashCooldown: prev.dashCooldown - 1 }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [state.dashCooldown]);

  // Handle victory
  useEffect(() => {
    if (state.isVictory) {
      onLevelComplete(state.level);
      if (!bestTimes[state.level] || state.elapsedTime < bestTimes[state.level]) {
        onNewBestTime(state.level, state.elapsedTime);
      }
    }
  }, [state.isVictory, state.level, state.elapsedTime, bestTimes, onNewBestTime, onLevelComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      // Freeze mechanic
      if (e.key === ' ') {
        e.preventDefault();
        playFreeze();
        setState(prev => toggleFreeze(prev, true));
        return;
      }

      // Bomb mode
      if (e.key.toLowerCase() === 'b') {
        bombMode.current = true;
        return;
      }

      const directions: Record<string, [number, number, 'up' | 'down' | 'left' | 'right']> = {
        'arrowup': [0, -1, 'up'],
        'arrowdown': [0, 1, 'down'],
        'arrowleft': [-1, 0, 'left'],
        'arrowright': [1, 0, 'right'],
        'w': [0, -1, 'up'],
        's': [0, 1, 'down'],
        'a': [-1, 0, 'left'],
        'd': [1, 0, 'right'],
      };

      const key = e.key.toLowerCase();
      const dir = directions[key] || directions[e.key];
      
      if (dir) {
        e.preventDefault();
        const [dx, dy, direction] = dir;

        if (bombMode.current) {
          setState(prev => useBomb(prev, direction));
          playExplosion();
          setShaking(true);
          setTimeout(() => setShaking(false), 150);
          bombMode.current = false;
        } else if (e.shiftKey) {
          setState(prev => dash(prev, dx, dy));
          playDash();
          setShaking(true);
          setTimeout(() => setShaking(false), 100);
        } else {
          setState(prev => movePlayer(prev, dx, dy));
          playFootstep();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());

      if (e.key === ' ') {
        setState(prev => toggleFreeze(prev, false));
      }
      if (e.key.toLowerCase() === 'b') {
        bombMode.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleRestart = () => {
    setState(createInitialState(level));
    setElapsedSeconds(0);
  };

  const handleNextLevel = () => {
    const nextLevel = Math.min(level + 1, LEVELS.length - 1);
    setState(createInitialState(nextLevel));
    setElapsedSeconds(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-40 md:pb-4 relative">
      {/* Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(270 40% 8%) 0%, hsl(240 15% 3%) 100%)'
        }}
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
        <MazeRenderer state={state} shaking={shaking} />
        <GameHUD state={state} elapsedSeconds={elapsedSeconds} onMainMenu={onMainMenu} />
      </div>

      {(state.isGameOver || state.isVictory) && (
        <GameOverScreen
          state={state}
          onRestart={handleRestart}
          onNextLevel={handleNextLevel}
          onMainMenu={onMainMenu}
          bestTimes={bestTimes}
        />
      )}

      {/* Mobile Controls */}
      {!state.isGameOver && !state.isVictory && (
        <MobileControls
          onMove={handleMobileMove}
          onDash={handleMobileDash}
          onBomb={handleMobileBomb}
          onFreezeStart={handleMobileFreezeStart}
          onFreezeEnd={handleMobileFreezeEnd}
          bombCount={state.bombs}
          dashCooldown={state.dashCooldown}
          isFreeze={state.isFreeze}
        />
      )}
    </div>
  );
}
