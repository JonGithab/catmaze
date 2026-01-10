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
