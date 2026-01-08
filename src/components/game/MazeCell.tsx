import { Cell } from '@/lib/mazeGenerator';
import { cn } from '@/lib/utils';

interface MazeCellProps {
  cell: Cell;
  isPlayer: boolean;
  isStalker: boolean;
  isStalker2: boolean;
  isVisible: boolean;
  visibilityAlpha: number;
  cellSize: number;
}

export function MazeCell({
  cell,
  isPlayer,
  isStalker,
  isStalker2,
  isVisible,
  visibilityAlpha,
  cellSize
}: MazeCellProps) {
  const baseClasses = "transition-all duration-150 relative flex items-center justify-center";

  const getCellStyle = () => {
    if (!isVisible && !isPlayer) {
      return {
        backgroundColor: 'hsl(45 40% 85%)',
        opacity: 1
      };
    }

    const alpha = visibilityAlpha;

    switch (cell.type) {
      case 'wall':
        return {
          backgroundColor: `hsla(260, 50%, 65%, ${0.3 + alpha * 0.7})`,
          boxShadow: alpha > 0.5 ? 'inset 0 0 5px hsla(260, 50%, 75%, 0.4)' : 'none',
          borderRadius: '4px'
        };
      case 'floor':
      case 'start':
        return {
          backgroundColor: `hsla(45, 60%, 90%, ${alpha})`
        };
      case 'exit':
        return {
          backgroundColor: `hsla(140, 80%, 70%, ${alpha})`,
          boxShadow: `0 0 ${12 * alpha}px hsla(140, 80%, 55%, ${alpha * 0.6})`,
          borderRadius: '4px'
        };
      case 'trap':
        return {
          backgroundColor: `hsla(30, 90%, 75%, ${alpha})`,
          backgroundImage: cell.crumbling 
            ? `repeating-linear-gradient(45deg, transparent, transparent 2px, hsla(30, 90%, 55%, ${alpha}) 2px, hsla(30, 90%, 55%, ${alpha}) 4px)`
            : 'none',
          borderRadius: '4px'
        };
      case 'bomb':
        return {
          backgroundColor: `hsla(45, 60%, 90%, ${alpha})`
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
      {/* Exit indicator */}
      {cell.type === 'exit' && isVisible && (
        <div 
          className="absolute inset-1 rounded-lg animate-pulse-slow"
          style={{
            backgroundColor: 'hsla(140, 80%, 55%, 0.3)',
            boxShadow: '0 0 12px hsla(140, 80%, 55%, 0.5)'
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

      {/* Player */}
      {isPlayer && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div 
            className="text-xl animate-bounce-soft"
            style={{
              filter: 'drop-shadow(0 0 6px hsl(45 100% 60%))'
            }}
          >
            🐱
          </div>
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

      {/* Vision edge glow */}
      {isVisible && visibilityAlpha < 0.5 && visibilityAlpha > 0 && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 ${cellSize / 2}px hsla(320, 85%, 55%, ${0.08 * visibilityAlpha})`
          }}
        />
      )}
    </div>
  );
}
