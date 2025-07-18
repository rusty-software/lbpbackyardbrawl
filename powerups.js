export const POWERUPS = {
  brisket: {
    name: 'Brisket Boost',
    key: 'powerup_brisket',
    sprite: 'brisket',
    apply: (player) => { player.character.strength += 10; },
    revert: (player) => { player.character.strength -= 10; },
    duration: 5000
  },
  popper: {
    name: 'Jalapeño Popper',
    key: 'powerup_popper',
    sprite: 'popper',
    apply: (player) => { player.character.speed += 50; },
    revert: (player) => { player.character.speed -= 50; },
    duration: 5000
  },
  shield: {
    name: 'Poker Chip Shield',
    key: 'powerup_shield',
    sprite: 'shield',
    apply: (player) => { player.invincible = true; },
    revert: (player) => { player.invincible = false; },
    duration: 4000
  },
  dorito: {
    name: 'Dorito Toss',
    key: 'powerup_dorito',
    sprite: 'dorito',
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
    key: 'powerup_hotdog',
    sprite: 'hotdog',
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
    key: 'powerup_margarita',
    sprite: 'margarita',
    apply: (player, scene) => {
      player.health = Math.min(100, player.health + 20);
      scene.updateHealthBars();
    },
    revert: () => { },
    duration: 0
  }
};
