import { Cell } from '@/lib/mazeGenerator';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface MazeCellProps {
  cell: Cell;
  isPlayer: boolean;
  isStalker: boolean;
  isStalker2: boolean;
  isVisible: boolean;
  visibilityAlpha: number;
  cellSize: number;
  x: number;
  y: number;
  isHiding?: boolean;
}

export function MazeCell({
  cell,
  isPlayer,
  isStalker,
  isStalker2,
  isVisible,
  visibilityAlpha,
  cellSize,
  x,
  y,
  isHiding = false
}: MazeCellProps) {
  const baseClasses = "transition-all duration-150 relative flex items-center justify-center";

  // Deterministic sparkle based on position
  const hasSparkle = useMemo(() => {
    return (cell.type === 'floor' || cell.type === 'start') && ((x + y) % 7 === 0 || (x * y) % 11 === 0);
  }, [cell.type, x, y]);

  const sparkleDelay = useMemo(() => {
    return ((x * 3 + y * 7) % 5) * 0.4;
  }, [x, y]);

  const getCellStyle = () => {
    if (!isVisible && !isPlayer) {
      return {
        backgroundColor: 'hsl(200 60% 75%)',
        opacity: 1
      };
    }

    switch (cell.type) {
      case 'wall':
        return {
          backgroundColor: 'hsl(330 75% 55%)',
          boxShadow: 'inset 0 2px 4px hsla(330, 80%, 70%, 0.5), inset 0 -2px 4px hsla(330, 80%, 40%, 0.3)',
          borderRadius: '6px'
        };
      case 'floor':
      case 'start':
        return {
          backgroundColor: 'hsl(195 80% 85%)',
          boxShadow: 'inset 0 1px 2px hsla(195, 80%, 95%, 0.5)'
        };
      case 'exit':
        return {
          backgroundColor: 'hsl(160 80% 55%)',
          boxShadow: '0 0 15px hsla(160, 80%, 50%, 0.7), inset 0 2px 4px hsla(160, 80%, 70%, 0.5)',
          borderRadius: '6px'
        };
      case 'trap':
        return {
          backgroundColor: 'hsl(45 90% 65%)',
          boxShadow: 'inset 0 2px 4px hsla(45, 90%, 80%, 0.5)',
          borderRadius: '6px'
        };
      case 'bomb':
        return {
          backgroundColor: 'hsl(195 80% 85%)',
          boxShadow: 'inset 0 1px 2px hsla(195, 80%, 95%, 0.5)'
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={cn(baseClasses)}
      style={{
        width: cellSize,
        height: cellSize,
        ...getCellStyle()
      }}
    >
      {/* Floor sparkles */}
      {hasSparkle && isVisible && (
        <div 
          className="absolute animate-sparkle pointer-events-none"
          style={{
            animationDelay: `${sparkleDelay}s`,
            fontSize: cellSize * 0.35,
          }}
        >
          ✨
        </div>
      )}

      {/* Exit indicator */}
      {cell.type === 'exit' && isVisible && (
        <div 
          className="absolute inset-1 rounded-lg animate-pulse-slow"
          style={{
            backgroundColor: 'hsla(160, 80%, 55%, 0.3)',
            boxShadow: '0 0 12px hsla(160, 80%, 55%, 0.5)'
          }}
        />
      )}

      {/* Bomb pickup */}
      {cell.type === 'bomb' && isVisible && (
        <div 
          className="text-lg animate-bounce-soft"
          style={{
            textShadow: '0 0 8px hsl(45 100% 60%)'
          }}
        >
          💣
        </div>
      )}

      {/* Speed Boost Power-up */}
      {cell.type === 'powerup_speed' && isVisible && (
        <div 
          className="text-lg animate-bounce-soft"
          style={{
            textShadow: '0 0 10px hsl(200 100% 60%)'
          }}
        >
          ⚡
        </div>
      )}

      {/* Invisibility Power-up */}
      {cell.type === 'powerup_invisible' && isVisible && (
        <div 
          className="text-lg animate-bounce-soft"
          style={{
            textShadow: '0 0 10px hsl(280 100% 70%)'
          }}
        >
          👻
        </div>
      )}

      {/* Vision Power-up */}
      {cell.type === 'powerup_vision' && isVisible && (
        <div 
          className="text-lg animate-bounce-soft"
          style={{
            textShadow: '0 0 10px hsl(45 100% 60%)'
          }}
        >
          👁️
        </div>
      )}

      {/* Trap indicator */}
      {cell.type === 'trap' && isVisible && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center text-sm",
            cell.crumbling && "animate-shake"
          )}
          style={{
            color: 'hsla(30, 90%, 45%, 0.9)'
          }}
        >
          ⚠️
        </div>
      )}

      {/* Player - Cat */}
      {isPlayer && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center z-20 transition-all duration-300",
            isHiding && "animate-stealth"
          )}
        >
          <div 
            className={cn(
              "text-lg transition-all duration-300",
              isHiding ? "opacity-40 scale-90" : "animate-bounce-soft"
            )}
            style={{
              filter: isHiding 
                ? 'drop-shadow(0 0 12px hsl(200 80% 70%)) blur(0.5px)' 
                : 'drop-shadow(0 0 6px hsl(45 90% 55%))'
            }}
          >
            🐱
          </div>
          {/* Stealth ring effect */}
          {isHiding && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div 
                className="absolute rounded-full animate-stealth-ring"
                style={{
                  width: cellSize * 1.5,
                  height: cellSize * 1.5,
                  border: '2px solid hsla(200, 80%, 70%, 0.6)',
                  boxShadow: '0 0 15px hsla(200, 80%, 70%, 0.4), inset 0 0 10px hsla(200, 80%, 70%, 0.2)'
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Main Stalker */}
      {isStalker && isVisible && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div 
            className="text-xl animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 10px hsl(0 85% 60%))'
            }}
          >
            👻
          </div>
        </div>
      )}

      {/* Second Stalker */}
      {isStalker2 && isVisible && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div 
            className="text-xl animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 10px hsl(280 80% 60%))'
            }}
          >
            👻
          </div>
        </div>
      )}

    </div>
  );
}
