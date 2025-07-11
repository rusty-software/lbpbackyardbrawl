export const CHARACTERS = {
  chase: {
    name: "Chase",
    speed: 160,
    jump: -550,
    strength: 10,
    cooldown: 500,
    sprite: "chase",
    special: (scene, player) => {
      player.setVelocityY(-600);
      scene.fireProjectile(player, 'proj_dorito', 200, 6);

    }
  },
  garner: {
    name: "Garner",
    speed: 120,
    jump: -480,
    strength: 18,
    cooldown: 800,
    sprite: "garner"
  },
  curtis: {
    name: "Curtis",
    speed: 140,
    jump: -500,
    strength: 14,
    cooldown: 650,
    sprite: "curtis",
    special: (scene, player) => {
      [-1, 0, 1].forEach(offset => {
        const proj = scene.fireProjectile(player, 'proj_hotdog', 300, 4);
        proj.setVelocityY(offset * 100);
      });
    }
  }
}