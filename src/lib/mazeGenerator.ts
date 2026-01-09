export type CellType = 'wall' | 'floor' | 'exit' | 'trap' | 'bomb' | 'start' | 'powerup_speed' | 'powerup_invisible' | 'powerup_vision';

export interface Cell {
  type: CellType;
  x: number;
  y: number;
  visible: boolean;
  trapTimer?: number;
  crumbling?: boolean;
}

export interface Maze {
  grid: Cell[][];
  width: number;
  height: number;
  startX: number;
  startY: number;
  exitX: number;
  exitY: number;
}

// Recursive backtracking maze generation
export function generateMaze(width: number, height: number, trapCount: number = 3, bombCount: number = 2, powerupCount: number = 3): Maze {
  // Ensure odd dimensions for proper maze generation
  const w = width % 2 === 0 ? width + 1 : width;
  const h = height % 2 === 0 ? height + 1 : height;

  // Initialize grid with walls
  const grid: Cell[][] = [];
  for (let y = 0; y < h; y++) {
    grid[y] = [];
    for (let x = 0; x < w; x++) {
      grid[y][x] = {
        type: 'wall',
        x,
        y,
        visible: false
      };
    }
  }

  // Carve maze using recursive backtracking
  const stack: [number, number][] = [];
  const startX = 1;
  const startY = 1;
  
  grid[startY][startX].type = 'start';
  stack.push([startX, startY]);

  const directions = [
    [0, -2], // up
    [2, 0],  // right
    [0, 2],  // down
    [-2, 0]  // left
  ];

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    
    // Shuffle directions
    const shuffled = [...directions].sort(() => Math.random() - 0.5);
    
    let carved = false;
    for (const [dx, dy] of shuffled) {
      const nx = cx + dx;
      const ny = cy + dy;
      
      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && grid[ny][nx].type === 'wall') {
        // Carve path
        grid[ny][nx].type = 'floor';
        grid[cy + dy / 2][cx + dx / 2].type = 'floor';
        stack.push([nx, ny]);
        carved = true;
        break;
      }
    }
    
    if (!carved) {
      stack.pop();
    }
  }

  // Place exit in bottom-right area
  let exitX = w - 2;
  let exitY = h - 2;
  
  // Find a valid floor tile for exit
  while (grid[exitY][exitX].type === 'wall' && exitX > w / 2) {
    exitX -= 2;
    if (exitX <= w / 2) {
      exitX = w - 2;
      exitY -= 2;
    }
  }
  
  grid[exitY][exitX].type = 'exit';

  // Get all floor tiles for placing traps and bombs
  const floorTiles: [number, number][] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (grid[y][x].type === 'floor') {
        // Don't place near start or exit
        const distFromStart = Math.abs(x - startX) + Math.abs(y - startY);
        const distFromExit = Math.abs(x - exitX) + Math.abs(y - exitY);
        if (distFromStart > 4 && distFromExit > 4) {
          floorTiles.push([x, y]);
        }
      }
    }
  }

  // Shuffle and place traps
  const shuffledFloors = [...floorTiles].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(trapCount, shuffledFloors.length); i++) {
    const [tx, ty] = shuffledFloors[i];
    grid[ty][tx].type = 'trap';
    grid[ty][tx].trapTimer = 0;
  }

  // Place bombs
  for (let i = trapCount; i < Math.min(trapCount + bombCount, shuffledFloors.length); i++) {
    const [bx, by] = shuffledFloors[i];
    grid[by][bx].type = 'bomb';
  }

  // Place power-ups
  const powerupTypes: CellType[] = ['powerup_speed', 'powerup_invisible', 'powerup_vision'];
  const startIdx = trapCount + bombCount;
  for (let i = 0; i < Math.min(powerupCount, shuffledFloors.length - startIdx); i++) {
    const [px, py] = shuffledFloors[startIdx + i];
    grid[py][px].type = powerupTypes[i % powerupTypes.length];
  }

  return {
    grid,
    width: w,
    height: h,
    startX,
    startY,
    exitX,
    exitY
  };
}

export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function getManhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

// A* pathfinding for stalker
export function findPath(
  maze: Maze,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): [number, number][] {
  const openSet: { x: number; y: number; g: number; h: number; f: number; parent: any }[] = [];
  const closedSet = new Set<string>();
  
  const start = {
    x: startX,
    y: startY,
    g: 0,
    h: getManhattanDistance(startX, startY, endX, endY),
    f: getManhattanDistance(startX, startY, endX, endY),
    parent: null
  };
  
  openSet.push(start);
  
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  
  while (openSet.length > 0) {
    // Get node with lowest f
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    
    if (current.x === endX && current.y === endY) {
      // Reconstruct path
      const path: [number, number][] = [];
      let node = current;
      while (node) {
        path.unshift([node.x, node.y]);
        node = node.parent;
      }
      return path;
    }
    
    closedSet.add(`${current.x},${current.y}`);
    
    for (const [dx, dy] of directions) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      
      if (
        nx < 0 || nx >= maze.width ||
        ny < 0 || ny >= maze.height ||
        maze.grid[ny][nx].type === 'wall' ||
        closedSet.has(`${nx},${ny}`)
      ) {
        continue;
      }
      
      const g = current.g + 1;
      const h = getManhattanDistance(nx, ny, endX, endY);
      const f = g + h;
      
      const existing = openSet.find(n => n.x === nx && n.y === ny);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      } else {
        openSet.push({ x: nx, y: ny, g, h, f, parent: current });
      }
    }
  }
  
  return [];
}
