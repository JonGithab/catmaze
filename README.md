# 🐱 Cat Maze - Stealth Horror Survival Game

A tense, atmospheric maze escape game where you must navigate procedurally generated labyrinths while evading relentless stalkers. Built with React, TypeScript, and a custom 8-bit audio engine.

**Live Demo**: [catmaze.lovable.dev](https://catmaze.lovable.dev)

![Game Preview](https://img.shields.io/badge/Game-Stealth%20Horror-purple)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## 📖 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
- [Game Controls](#-game-controls)
- [Architecture](#-architecture)
- [Game Systems](#-game-systems)
- [Audio Engine](#-audio-engine)
- [Level Configuration](#-level-configuration)
- [Technologies](#-technologies)
- [Development](#-development)

---

## ✨ Features

### Core Gameplay
- **Procedural Maze Generation** - Each playthrough features a unique maze using recursive backtracking
- **A* Pathfinding Stalkers** - Intelligent enemies that hunt you using A* pathfinding
- **Fog of War** - Limited vision radius creates tension and uncertainty
- **Stealth Mechanics** - Hide in place to temporarily evade detection

### Power-Ups & Items
- 🏃 **Speed Boost** - Increased movement speed and enhanced dash
- 👻 **Invisibility** - Stalkers lose track and move randomly
- 👁️ **Expanded Vision** - Temporarily increases sight radius
- 💣 **Bombs** - Destroy walls to create shortcuts

### Special Abilities
- **Dash** - Quick burst of movement with cooldown
- **Freeze/Hide** - Hold position to reduce visibility (but vision decays!)
- **Silent Step** - Every 10th step is undetected by stalkers

### Audio
- **Dynamic Background Music** - Multi-layer 8-bit soundtrack that intensifies with danger
- **Tension-Based Effects** - Heartbeat, arpeggiator, and drone layers respond to stalker proximity
- **Procedural Sound Effects** - All audio generated via Web Audio API

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### GitHub Codespaces

1. Navigate to the repository on GitHub
2. Click **Code** → **Codespaces** tab
3. Click **New codespace**
4. Edit and commit directly in the browser

---

## 🎮 Game Controls

### Desktop

| Action | Key |
|--------|-----|
| Move | `WASD` or Arrow Keys |
| Dash | `Shift` + Direction |
| Use Bomb | `B` + Direction |
| Hide/Freeze | `Space` (hold) |

### Mobile

- **D-Pad** - Movement controls
- **Dash Button** - Quick dash in last direction
- **Bomb Button** - Place bomb in facing direction
- **Freeze Button** - Hold to hide

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── game/
│   │   ├── GameCanvas.tsx      # Main game loop & input handling
│   │   ├── GameHUD.tsx         # UI overlay (timer, items, level)
│   │   ├── GameOverScreen.tsx  # Victory/defeat screens
│   │   ├── MainMenu.tsx        # Title screen & level select
│   │   ├── MazeRenderer.tsx    # Renders maze with fog of war
│   │   ├── MazeCell.tsx        # Individual cell component
│   │   └── MobileControls.tsx  # Touch input controls
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── audioEngine.ts          # 8-bit audio system
│   ├── gameState.ts            # Game state & logic
│   ├── mazeGenerator.ts        # Procedural maze & A* pathfinding
│   └── utils.ts                # Utility functions
├── hooks/
│   └── use-mobile.tsx          # Mobile detection hook
└── pages/
    └── Index.tsx               # Main app entry
```

---

## ⚙️ Game Systems

### Maze Generation (`mazeGenerator.ts`)

Uses **recursive backtracking** algorithm:

```typescript
// Algorithm overview
1. Start with grid filled with walls
2. Begin at starting position, mark as visited
3. Randomly select unvisited neighbor
4. Carve passage between current and neighbor
5. Move to neighbor, repeat
6. Backtrack when no unvisited neighbors exist
7. Complete when returned to start
```

**Key Features:**
- Odd-dimension enforcement for proper wall spacing
- Safe zones around start/exit (no traps)
- Balanced item distribution

### A* Pathfinding

Stalkers use A* algorithm with Manhattan distance heuristic:

```typescript
interface PathNode {
  x: number;
  y: number;
  g: number;  // Cost from start
  h: number;  // Heuristic (Manhattan distance to target)
  f: number;  // Total cost (g + h)
  parent: PathNode | null;
}
```

### Game State Management (`gameState.ts`)

Immutable state updates with pure functions:

```typescript
interface GameState {
  // Position
  playerX, playerY: number;
  stalkerX, stalkerY: number;
  stalker2X, stalker2Y: number | null;
  
  // Mechanics
  visionRadius: number;
  bombs: number;
  dashCooldown: number;
  isFreeze: boolean;
  
  // Power-ups (remaining seconds)
  powerUps: {
    speedBoost: number;
    invisibility: number;
    expandedVision: number;
  };
  
  // Game status
  isGameOver: boolean;
  isVictory: boolean;
}
```

### Power-Up Effects

| Power-Up | Duration | Effect |
|----------|----------|--------|
| Speed Boost | 8s | Dash distance +1, cooldown reduced |
| Invisibility | 5s | Stalkers move randomly |
| Expanded Vision | 10s | Vision radius +2 tiles |

---

## 🔊 Audio Engine

### Overview

The game features a fully procedural 8-bit audio system using the **Web Audio API**. No audio files are used - all sounds are synthesized in real-time.

### Sound Effects

| Sound | Function | Description |
|-------|----------|-------------|
| `playFootstep()` | Movement | Random low-frequency blips (80-110Hz) |
| `playStalkerGrowl()` | Enemy proximity | Descending sawtooth growl |
| `playExplosion()` | Bomb use | Filtered noise burst |
| `playDash()` | Dash ability | Rising sawtooth whoosh |
| `playCaughtByEnemy()` | Game over | Sharp attack + low rumble |
| `playHideStart/End()` | Stealth | Whoosh with lowpass filter |

### Dynamic Music System

Multi-layer background music that responds to tension level (0.0 - 1.0):

```typescript
// Layers
Layer 1: Bass Drone (sawtooth, ~55Hz) - Gets deeper with tension
Layer 2: Pad (triangle, ~110Hz) - Shifts to minor at high tension
Layer 3: High Tension (square, ~220Hz) - Only audible above 60% tension

// Arpeggiator
- Calm: C2, D2, E2, F2 (major feel)
- Tense: B1, C#2, D#2, F#2 (chromatic)
- Danger: A1, Bb1, C2, C#2 (diminished)
- Tempo: 400ms → 150ms (speeds up with tension)
```

### Usage

```typescript
import { 
  startBackgroundMusic, 
  updateMusicTension, 
  stopBackgroundMusic 
} from '@/lib/audioEngine';

// Start music
startBackgroundMusic();

// Update based on stalker distance (0-1)
const tension = 1 - (stalkerDistance / 10);
updateMusicTension(tension);

// Stop on game end
stopBackgroundMusic();
```

---

## 📊 Level Configuration

```typescript
interface LevelConfig {
  width: number;           // Maze width (odd numbers)
  height: number;          // Maze height (odd numbers)
  trapCount: number;       // Crumbling floor tiles
  bombCount: number;       // Collectible bombs
  visionRadius: number;    // Player sight distance
  stalkerSpeed: number;    // Enemy move interval (ms)
  secondStalkerTime: number; // Seconds until 2nd stalker
  powerupCount: number;    // Power-up items
}
```

### Difficulty Progression

| Level | Size | Vision | Stalker Speed | 2nd Stalker |
|-------|------|--------|---------------|-------------|
| 1 | 25×25 | 5.0 | 800ms | 180s |
| 2 | 31×31 | 4.5 | 700ms | 150s |
| 3 | 37×37 | 4.0 | 600ms | 120s |
| 4 | 43×43 | 3.5 | 500ms | 90s |
| 5 | 51×51 | 3.0 | 400ms | 60s |

---

## 🛠️ Technologies

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **Web Audio API** | Procedural audio synthesis |

---

## 💻 Development

### Project Structure

- `src/lib/` - Core game logic (pure functions, no React)
- `src/components/game/` - Game UI components
- `src/hooks/` - Custom React hooks

### Key Patterns

1. **Immutable State** - All game state updates return new objects
2. **Pure Functions** - Game logic separated from React effects
3. **Composition** - Small, focused components

### Build Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

### Adding New Features

**New Power-Up:**
1. Add type to `CellType` in `mazeGenerator.ts`
2. Add state field to `PowerUpState` in `gameState.ts`
3. Handle pickup in `movePlayer()`
4. Apply effect in relevant game functions
5. Add visual in `MazeCell.tsx`

**New Sound Effect:**
1. Create function in `audioEngine.ts`
2. Use oscillators, filters, and gain nodes
3. Export and import where needed

---

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using [Lovable](https://lovable.dev)
