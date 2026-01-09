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
        backgroundColor: 'hsl(30 25% 80%)',
        opacity: 1
      };
    }

    switch (cell.type) {
      case 'wall':
        return {
          backgroundColor: 'hsl(25 45% 35%)',
          boxShadow: 'inset 0 0 5px hsla(25, 45%, 45%, 0.4)',
          borderRadius: '4px'
        };
      case 'floor':
      case 'start':
        return {
          backgroundColor: 'hsl(30 30% 88%)'
        };
      case 'exit':
        return {
          backgroundColor: 'hsl(140 70% 60%)',
          boxShadow: '0 0 12px hsla(140, 70%, 50%, 0.6)',
          borderRadius: '4px'
        };
      case 'trap':
        return {
          backgroundColor: 'hsl(15 85% 70%)',
          borderRadius: '4px'
        };
      case 'bomb':
        return {
          backgroundColor: 'hsl(30 30% 88%)'
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

      {/* Player - Boogeyman */}
      {isPlayer && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div 
            className="text-lg animate-bounce-soft"
            style={{
              filter: 'drop-shadow(0 0 6px hsl(35 90% 55%))'
            }}
          >
            👹
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

    </div>
  );
}
