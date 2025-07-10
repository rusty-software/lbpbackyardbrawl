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
  }
};
