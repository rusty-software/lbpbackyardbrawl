export const CHARACTERS = {
  bill: {
    name: 'Bill', speed: 150, jump: -520, strength: 12, cooldown: 600, sprite: 'bill', specialName: 'Teat Blast',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_milkdrop', 150, 4);
      proj.setTint(0xffffff);
      proj.setScale(1);
    }
  },
  chase: {
    name: 'Chase', speed: 160, jump: -550, strength: 10, cooldown: 500, sprite: 'chase', specialName: 'Dorito Star',
    special: (scene, player) => {
      player.setVelocityY(-600);
      scene.fireProjectile(player, 'proj_dorito', 200, 6);
    }
  },
  curtis: {
    name: 'Curtis', speed: 140, jump: -500, strength: 14, cooldown: 650, sprite: 'curtis', specialName: 'Earl Barrage',
    special: (scene, player) => {
      [-1, 0, 1].forEach(offset => {
        const proj = scene.fireProjectile(player, 'proj_hotdog', 300, 4);
        proj.setVelocityY(offset * 100);
      });
    }
  },
  damon: {
    name: 'Damon', speed: 120, jump: -480, strength: 18, cooldown: 800, sprite: 'damon', specialName: 'Man Down',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_mandown', 200, 4);
      proj.onHitEffect = (victim) => {
        victim.setTint(0x999999);
        victim.body.enable = false;
        scene.time.delayedCall(750, () => {
          victim.body.enable = true;
          victim.clearTint();
        });
      };
    }
  },
  garner: {
    name: 'Garner', speed: 120, jump: -480, strength: 18, cooldown: 800, sprite: 'garner', specialName: 'Splash Zone',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_waterdrop', 180, 5);
      proj.setTint(0x66ccff);
    }
  },
  keith: {
    name: 'Keith', speed: 150, jump: -500, strength: 12, cooldown: 600, sprite: 'keith', specialName: 'Zap Stun',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_lightningball', 250, 4);
      proj.setTint(0xffff00);
    }
  },
  nick: {
    name: 'Nick', speed: 170, jump: -560, strength: 9, cooldown: 450, sprite: 'nick', specialName: 'Spades',
    special: (scene, player) => {
      player.setVelocityY(-400);
      scene.fireProjectile(player, 'proj_spade', 240, 5);
    }
  },
  phil: {
    name: 'Phil', speed: 140, jump: -520, strength: 13, cooldown: 600, sprite: 'phil', specialName: 'Red Phil Rising',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_brokenheartking', 160, 4);
      proj.setBounce(1);
    }
  },
  po: {
    name: 'Po', speed: 150, jump: -600, strength: 11, cooldown: 700, sprite: 'po', specialName: 'Robo Clamp',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_roboclamp', 180, 5);
      proj.setTint(0x00ccff);
      proj.onHitEffect = (victim) => {
        victim.setTint(0x00ccff);
        victim.body.enable = false;
        scene.time.delayedCall(750, () => {
          victim.body.enable = true;
          victim.clearTint();
        });
      };
    }
  },
  rusty: {
    name: 'Rusty', speed: 160, jump: -540, strength: 10, cooldown: 500, sprite: 'rusty', specialName: 'Library Toss',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_book', 200, 5);
      proj.setTint(0x9966ff);
    }
  },
  sam: {
    name: 'Sam', speed: 145, jump: -520, strength: 12, cooldown: 600, sprite: 'sam', specialName: 'Cookie Dough',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_cookiedough', 150, 3);
      proj.setTint(0xffcc99);
    }
  },
  tai: {
    name: 'Tai', speed: 130, jump: -590, strength: 11, cooldown: 650, sprite: 'tai', specialName: 'Delayed AV',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_hdmicoil', 180, 4);
      proj.setTint(0x3366ff);
      proj.onHitEffect = (victim) => {
        victim.setTint(0x3366ff);
        victim.body.enable = false;
        scene.time.delayedCall(1000, () => {
          victim.body.enable = true;
          victim.clearTint();
        });
      };
    }
  },
  todd: {
    name: 'Todd', speed: 125, jump: -490, strength: 17, cooldown: 700, sprite: 'todd', specialName: 'Scorpion King',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_scorpionsauce', 150, 3);
      proj.setTint(0x996600);
    }
  },
  tony: {
    name: 'Tony', speed: 150, jump: -520, strength: 13, cooldown: 600, sprite: 'tony', specialName: 'Rocket Ship',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_rocketship', 200, 5);
      proj.setTint(0x663300);
      proj.onHitEffect = (victim) => {
        victim.setTint(0x663300);
        victim.body.enable = false;
        scene.time.delayedCall(750, () => {
          victim.body.enable = true;
          victim.clearTint();
        });
      };
    }
  },
  willy: {
    name: 'Willy', speed: 180, jump: -580, strength: 8, cooldown: 450, sprite: 'willy', specialName: 'Cease and Desist',
    special: (scene, player) => {
      const proj = scene.fireProjectile(player, 'proj_envelope', 180, 4);
      proj.setTint(0xffffff);
      proj.onHitEffect = (victim) => {
        victim.setTint(0xffffff);
        victim.canUseSpecial = false;
        scene.time.delayedCall(3000, () => {
          victim.canUseSpecial = true;
          victim.clearTint();
        });
      };
    }
  }
};