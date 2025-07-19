
# ✅ LBP Backyard Brawl – Implementation Checklist

---

## **PHASE 1: Core Framework & MVP Combat**
### 🎯 Goal: Two-player combat with placeholder visuals

- [X] Set up Phaser 3 project structure (`index.html`, `main.js`, assets folder)
- [X] Create a main scene with game loop
- [X] Implement 2-player shared keyboard controls (WASD+F and Arrows+L)
- [X] Add basic player entities (placeholder art or simple shapes)
- [X] Add ground & gravity using Phaser physics
- [X] Implement movement and jump logic
- [X] Implement basic attack (hitbox, cooldown)
- [X] Add player health tracking
- [X] Add KO/win detection (simple end screen)
- [X] Add basic HUD (health bars for each player)

### 🏁 Milestone 1: MVP Build #1 – Local 2-Player Brawler

---

## **PHASE 2: Character System & Attributes**
### 🎯 Goal: Character variety and selection

- [X] Design character data structure (name, strength, speed, agility)
- [X] Implement character selection screen (UI + character preview)
- [X] Apply attributes to movement, jump height, and attack force
- [X] Add at least 3 unique characters with different stats
- [X] Show selected character names in HUD or intro screen

### 🏁 Milestone 2: MVP Build #2 – Multiple Characters

---

## **PHASE 3: Power-Ups, Specials & Stage Variety**
### 🎯 Goal: Gameplay depth and LBP flavor

- [X] Add power-up system (spawn timer, pickups, effects)
    - [X] Brisket Boost (+Strength)
    - [X] Jalapeño Popper (+Speed)
    - [X] Poker Chip Shield (Invincibility)
    - [X] Hot Dog Launcher (temporary ranged weapon)
    - [X] Dorito Toss (bouncing projectile)
- [X] Create per-character special move (primarily ranged attacks, with cooldown or charge meter)
- [X] Implement visual/audio effects for ranged attacks (projectile spawn, travel, impact)
- [X] Add ranged attack hit detection and balancing (damage, speed, cooldown)
- [X] Add at least 2 LBP-themed stages (pool, grill, game room)
~~- [ ] Add hazard logic (e.g. slippery tiles, fire spots)~~
- [ ] Add ambient sounds (grill sizzle, pool splash, crowd noise)

### 🏁 Milestone 3: Feature-Complete Build

---

## **PHASE 4: Polish, UI, and Miscellany**
### 🎯 Goal: Presentation, humor, and extras

- [X] Finalize HUD styling (animated bars, icons, meters)
- [X] Add pause & restart flow
- [ ] Add taunt button (funny character quotes or animations)
- [X] Add intro screen
- [X] Add audio (character sounds, sfx, theme music)
- [X] Polish win/loss screens with LBP inside jokes
- [ ] Optional: LBP Memory Card collectibles
- [ ] Optional: BBQ Timer survival mode
- [ ] Final testing & bug squashing
- [X] Package for sharing (upload or zip bundle)

### 🏁 Milestone 4: v1.0 Public Build


## **OPTIONAL PHASE 5: Basic AI & Single-Player**
### 🎯 Goal: Play solo against a computer opponent

- [ ] Create AI player entity with basic patrol/attack behavior
- [ ] Add detection range & follow/attack logic
- [ ] Add toggle for 1P or 2P mode on main screen
- [ ] Adjust HUD to reflect human vs AI status
- [ ] Add difficulty toggle (optional)
- [ ] Ensure game ends properly when AI wins or loses

### 🏁 Milestone 5: v1.1 Build – Single Player Mode

---

## **OPTIONAL PHASE 6: Tournament Mode**
### 🎯 Goal: Sequential fights vs AI opponents

- [ ] Design tournament flow (fight list, next opponent logic)
- [ ] Create screen for starting tournament mode
- [ ] Implement fight progression (advance to next on win)
- [ ] Display current round info (e.g. “Round 2 of 4”)
- [ ] Add tournament win/loss end screen

### 🏁 Milestone 6: v1.2 Build – Tournament Mode

---