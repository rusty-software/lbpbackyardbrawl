export const POWERUPS = {
  brisket: {
    name: 'Brisket Boost',
    sprite: 'powerup_brisket',
    apply: (player) => { player.character.strength += 10; },
    revert: (player) => { player.character.strength -= 10; },
    duration: 5000
  },
  popper: {
    name: 'Jalapeño Popper',
    sprite: 'powerup_popper',
    apply: (player) => { player.character.speed += 50; },
    revert: (player) => { player.character.speed -= 50; },
    duration: 5000
  },
  shield: {
    name: 'Poker Chip Shield',
    sprite: 'powerup_shield',
    apply: (player) => { player.invincible = true; },
    revert: (player) => { player.invincible = false; },
    duration: 4000
  },
  dorito: {
    name: 'Dorito Toss',
    sprite: 'powerup_dorito',
    apply: (player) => {
      player.canFireDoritos = true;
    },
    revert: (player) => {
      player.canFireDoritos = false;
    },
    duration: 6000
  },
  hotdog: {
    name: 'Hotdog Launcher',
    sprite: 'powerup_hotdog',
    apply: (player) => {
      player.canFireHotdogs = true;
    },
    revert: (player) => {
      player.canFireHotdogs = false;
    },
    duration: 6000
  },
  margarita: {
    name: 'Margarita',
    sprite: 'powerup_margarita',
    apply: (player, scene) => {
      player.health = Math.min(100, player.health + 20);
      scene.updateHealthBars();
    },
    revert: () => { },
    duration: 0
  }
};
