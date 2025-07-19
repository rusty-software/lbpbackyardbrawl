import { STAGES } from '../stages.js';
import { POWERUPS } from '../powerups.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init(data) {
    this.p1Character = data.p1Character;
    this.p2Character = data.p2Character;
    this.p1Name = data.p1Name;
    this.p2Name = data.p2Name;
  }

  preload() { }

  create() {
    this.gameOver = false;
    this.attackDuration = 150;

    const stage = Phaser.Utils.Array.GetRandom(STAGES);
    this.currentStage = stage;

    this.add.image(400, 300, stage.background).setDepth(-1);

    this.music = this.sound.add(stage.music, { loop: true, volume: 0.6 });
    this.music.play();

    const bannerText = this.add.text(400, 300, stage.displayName || 'Get Ready!', {
      fontSize: '32px',
      fontFamily: 'Courier',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 },
      align: 'center'
    }).setOrigin(0.5).setDepth(100).setAlpha(0);

    this.sound.play('roundStart', { volume: 0.8 });

    this.tweens.add({
      targets: bannerText,
      alpha: 1,
      duration: 500,
      ease: 'Power2',
      yoyo: true,
      hold: 1500,
      onComplete: () => bannerText.destroy()
    });

    this.platforms = this.physics.add.staticGroup();
    const ground = this.add.rectangle(400, 590, 800, 64, 0x24500f);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    stage.platforms.forEach(([x, y, width]) => {
      const platform = this.add.rectangle(x, y, width, 24, stage.platformColor || 0x4444aa)
        .setStrokeStyle(2, 0xffffff)
        .setOrigin(0.5);

      this.physics.add.existing(platform, true);
      this.platforms.add(platform);
    });

    this.specialBars = {
      p1: this.add.graphics(),
      p2: this.add.graphics()
    };
    this.specialBars.p1.setDepth(10);
    this.specialBars.p2.setDepth(10);

    this.p1HudBox = this.add.container(20, 45);
    const p1Bg = this.add.rectangle(0, 0, 140, 40, 0x550000).setOrigin(0, 0);
    const p1Initials = this.add.text(8, 2, this.p1Name, { fontSize: '14px', color: '#ffffff' });
    const p1Char = this.add.text(8, 20, this.p1Character.name, { fontSize: '14px', color: '#ffcc66' });
    this.p1HudBox.add([p1Bg, p1Initials, p1Char]);

    this.p2HudBox = this.add.container(640, 45);
    const p2Bg = this.add.rectangle(0, 0, 140, 40, 0x003355).setOrigin(0, 0);
    const p2Initials = this.add.text(8, 2, this.p2Name, { fontSize: '14px', color: '#ffffff' });
    const p2Char = this.add.text(8, 20, this.p2Character.name, { fontSize: '14px', color: '#ffcc66' });
    this.p2HudBox.add([p2Bg, p2Initials, p2Char]);

    this.p1Controls = this.input.keyboard.addKeys({
      left: 'A',
      right: 'D',
      up: 'W',
      attack: 'F',
      special: 'E'
    });
    this.p2Controls = this.input.keyboard.addKeys({
      left: 'LEFT',
      right: 'RIGHT',
      up: 'UP',
      attack: 'FORWARD_SLASH',
      special: 'SHIFT'
    });

    this.player1 = this.createPlayer(200, 400, this.p1Character, this.p1Controls, false);
    this.player2 = this.createPlayer(600, 400, this.p2Character, this.p2Controls, true);

    this.player1.combat = this.setupAttack(this.player1, this.player2, 0xffff00);
    this.player2.combat = this.setupAttack(this.player2, this.player1, 0xff00ff);

    this.projectiles = this.physics.add.group();

    this.updateHealthBars();

    this.schedulePowerupSpawn();

    this.poisonEffect = (victim) => {
      const ticks = 5;
      const damagePerTick = 2;

      const poison = this.time.addEvent({
        delay: 1000,
        repeat: ticks - 1,
        callback: () => {
          if (!victim.invincible && victim.active) {
            victim.health = Math.max(0, victim.health - damagePerTick);
            this.updateHealthBars();
            this.tintEffect(victim, 0x00ff00, 150);
            // victim.setTint(0x00ff00);
            // this.time.delayedCall(150, () => victim.clearTint());
            if (victim.health <= 0) {
              poison.remove();
              this.handleWin(victim === this.player1 ? 2 : 1);
            }
          }
        }
      });
    };

  }

  createPlayer(x, y, characterData, controls, isPlayer2) {
    const player = this.physics.add.sprite(x, y, characterData.sprite);
    player.setCollideWorldBounds(true).setBounce(0.2).setFlipX(isPlayer2);
    this.physics.add.collider(player, this.ground);
    this.physics.add.collider(player, this.platforms);
    player.character = characterData;
    player.controls = controls;
    player.health = 100;
    player.activePowerup = null;
    player.canUseSpecial = true;
    player.healthBar = this.add.graphics();
    player.healthBar.isPlayer2 = isPlayer2;
    player.healthBar.setDepth(5);
    player.healthBar.setScale(1, 1);

    return player;
  }

  setupAttack(attacker, defender, color) {
    const hitbox = this.add.rectangle(0, 0, 40, 30, color, 0.5);
    this.physics.add.existing(hitbox);
    hitbox.body.setAllowGravity(false);
    hitbox.body.setImmovable(true);
    hitbox.setVisible(false);

    const state = { canAttack: true, hitLanded: false, hitbox };

    this.physics.add.overlap(hitbox, defender, () => {
      if (!state.hitLanded) {
        state.hitLanded = true;
        if (!defender.invincible) {
          defender.health = Math.max(0, defender.health - attacker.character.strength);
          this.tintEffect(defender, 0xff0000, 100);
          this.tweens.add({
            targets: defender.healthBar,
            alpha: { from: 1, to: 0.5 },
            duration: 100,
            yoyo: true
          });
          this.updateHealthBars();
          if (defender.health <= 0) this.handleWin(attacker === this.player1 ? 1 : 2);
        }
      }
    });

    return state;
  }

  updateHealthBar(bar, player, x, y) {
    const width = 200;
    const height = 16;
    const pct = Phaser.Math.Clamp(player.health / 100, 0, 1);

    bar.clear();

    bar.fillStyle(0x222222, 1);
    bar.fillRect(x, y, width, height);

    let color = 0x00ff00;
    if (pct < 0.5) color = 0xffff00;
    if (pct < 0.25) color = 0xff0000;

    bar.fillStyle(color, 1);
    bar.fillRect(x, y, width * pct, height);

    bar.lineStyle(2, 0xffffff);
    bar.strokeRect(x, y, width, height);
  }

  updateHealthBars() {
    this.updateHealthBar(this.player1.healthBar, this.player1, 20, 20);
    this.updateHealthBar(this.player2.healthBar, this.player2, 580, 20);
  }

  handleWin(winner) {
    if (this.gameOver) return;
    this.music.stop();
    const winnerName = winner === 1 ? this.p1Name : this.p2Name;
    const loserName = winner === 1 ? this.p2Name : this.p1Name;
    this.gameOver = true;
    this.scene.launch('WinScene', {
      winner: winnerName,
      loser: loserName
    });
    this.time.delayedCall(300, () => this.scene.pause());
  }

  setVelocity(player) {
    const { left, right, up } = player.controls;
    if (left.isDown) player.setVelocityX(-player.character.speed);
    else if (right.isDown) player.setVelocityX(player.character.speed);
    else player.setVelocityX(0);

    if (up.isDown && player.body.blocked.down) {
      player.setVelocityY(player.character.jump);
    }
  }

  setDirection(one, other) {
    const pVelX = one.body.velocity.x;
    if (Math.abs(pVelX) > 5) one.setFlipX(pVelX < 0);
    else one.setFlipX(one.x > other.x);
  }

  handleAttack(player) {
    const { attack, special } = player.controls;
    const { canAttack, hitbox } = player.combat;

    if (Phaser.Input.Keyboard.JustDown(attack) && canAttack) {
      player.combat.canAttack = false;
      player.combat.hitLanded = false;

      const direction = player.flipX ? -1 : 1;
      hitbox.setPosition(player.x + (direction * 40), player.y);
      hitbox.setVisible(true);
      hitbox.body.enable = true;

      this.time.delayedCall(30, () => hitbox.body.enable = false);
      this.time.delayedCall(this.attackDuration, () => hitbox.setVisible(false));
      this.time.delayedCall(player.character.cooldown || 500, () => player.combat.canAttack = true);
    }
  }

  schedulePowerupSpawn() {
    this.time.addEvent({
      delay: 7000,
      loop: true,
      callback: () => {
        const types = Object.keys(POWERUPS);
        const randomType = Phaser.Utils.Array.GetRandom(types);
        this.spawnPowerup(randomType);
      }
    });
  }

  spawnPowerup(type) {
    const def = POWERUPS[type];
    const x = Phaser.Math.Between(100, 700);
    const y = Phaser.Math.Between(100, 400);

    const powerup = this.physics.add.sprite(x, y, def.key)
      .setOrigin(0.5)
      .setDepth(1)
      .setData('type', type)
      .setData('applied', false);

    powerup.body.setAllowGravity(false);
    powerup.body.setImmovable(true);
    powerup.body.setEnable(true);

    powerup.setData('type', type).setData('applied', false);

    [this.player1, this.player2].forEach((player) => {
      this.physics.add.overlap(powerup, player, (pwr, plyr) => {
        const type = pwr.getData('type');
        const data = POWERUPS[type];

        if (!data) return;

        this.applyPowerupToPlayer(plyr, data);
        pwr.destroy();
      });

    });

    this.time.delayedCall(8000, () => {
      if (powerup.active) powerup.destroy();
    });
  }

  applyPowerupToPlayer(player, data) {
    if (player.activePowerup) {
      const old = player.activePowerup;
      if (old.timer) old.timer.remove();
      old.data.revert(player);
    }

    if (data.soundKey) {
      this.sound.play(data.soundKey);
    }

    const colors = [0xffffff, 0xffcc00, 0xff66cc];
    const burstCount = 8;

    for (let i = 0; i < burstCount; i++) {
      const angle = Phaser.Math.DegToRad((360 / burstCount) * i);
      const vx = Math.cos(angle) * 60;
      const vy = Math.sin(angle) * 60;

      const spark = this.add.circle(player.x, player.y, 4, data.color || Phaser.Utils.Array.GetRandom(colors));
      this.tweens.add({
        targets: spark,
        x: player.x + vx,
        y: player.y + vy,
        alpha: 0,
        duration: 400,
        onComplete: () => spark.destroy()
      });
    }

    const label = this.add.text(player.x, player.y - 40, data.name || 'Power Up!', {
      fontFamily: 'Courier',
      fontSize: '14px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: label,
      y: label.y - 20,
      alpha: 0,
      duration: 800,
      ease: 'Power1',
      onComplete: () => label.destroy()
    });

    data.apply(player, this);
    player.setTint(0xffff00);

    const timer = this.time.delayedCall(data.duration, () => {
      data.revert(player);
      player.activePowerup = null;
      player.clearTint();
    });

    player.activePowerup = { data, timer };
  }

  showImpactEffect(x, y, color = 0xffffff, maxRadius = 15, duration = 150) {
    const gfx = this.add.graphics().setDepth(50);
    let elapsed = 0;
    const steps = 10;
    const stepTime = duration / steps;

    const timer = this.time.addEvent({
      delay: stepTime,
      repeat: steps - 1,
      callback: () => {
        elapsed += stepTime;
        const pct = elapsed / duration;
        const radius = maxRadius * pct;

        gfx.clear();
        gfx.fillStyle(color, 1 - pct); // fade out as it grows
        gfx.fillCircle(x, y, radius);
      },
      callbackScope: this,
      onComplete: () => gfx.destroy()
    });
  }

  startProjectileTrail(projectile, color = 0xffffff) {
    const trailTimer = this.time.addEvent({
      delay: 40,
      loop: true,
      callback: () => {
        if (!projectile.active) {
          trailTimer.remove(); // Stop if projectile is gone
          return;
        }

        const ghost = this.add.image(projectile.x, projectile.y, projectile.texture.key)
          .setDepth(0)
          .setAlpha(0.5)
          .setScale(projectile.scaleX, projectile.scaleY)
          .setRotation(projectile.rotation)
          .setTint(color);

        this.tweens.add({
          targets: ghost,
          alpha: 0,
          duration: 200,
          onComplete: () => ghost.destroy()
        });
      }
    });
  }

  fireProjectile(owner, texture, speed, damage) {
    const direction = owner.flipX ? -1 : 1;
    const x = owner.x + direction * 40;
    const y = owner.y;

    const projectile = this.projectiles.create(x, y, texture);
    projectile.setVelocityX(speed * direction);
    projectile.setVelocityY(0);
    projectile.setCollideWorldBounds(true);
    projectile.body.setAllowGravity(false);
    projectile.owner = owner;
    projectile.damage = damage;
    this.startProjectileTrail(projectile, owner === this.player1 ? 0xffff00 : 0xff00ff);

    this.physics.add.collider(projectile, this.platforms, () => projectile.destroy());

    const target = owner === this.player1 ? this.player2 : this.player1;
    this.physics.add.overlap(projectile, target, (proj, victim) => {
      if (!victim.invincible) {
        const color = (owner === this.player1) ? 0xffff00 : 0xff00ff;
        this.showImpactEffect(proj.x, proj.y, color);

        victim.health = Math.max(0, victim.health - damage);
        this.updateHealthBars();
        this.tintEffect(victim, 0xff0000, 100);

        if (proj.onHitEffect) {
          proj.onHitEffect(victim);
        }

        proj.destroy();
        if (victim.health <= 0) this.handleWin(owner === this.player1 ? 1 : 2);
      }
    });

    this.time.delayedCall(2000, () => {
      if (projectile.active) projectile.destroy();
    });

    return projectile;
  }

  tintEffect(target, color, duration = 200) {
    if (!target || !target.setTint) return;

    const existingTint = target.tintTopLeft;

    if (existingTint !== color) {
      target.setTint(color);
    }

    this.time.delayedCall(duration, () => {
      if (target.tintTopLeft === color) {
        target.clearTint();
      }
    });
  }


  handleSpecialProjectile(player) {
    if (Phaser.Input.Keyboard.JustDown(player.controls.special) && player.canUseSpecial) {
      player.canUseSpecial = false;

      if (player.canFireHotdogs) {
        this.fireProjectile(player, 'proj_hotdog', 300, 10);
      } else if (player.canFireDoritos) {
        const proj = this.fireProjectile(player, 'proj_dorito', 200, 6);
        proj.setCollideWorldBounds(true).setBounce(1);
      } else if (player.character.special) {
        player.character.special(this, player);
      }

      this.time.delayedCall(player.character.cooldown || 1000, () => {
        player.canUseSpecial = true;
      });
    }
  }

  updateSpecialBar(bar, player) {
    bar.clear();
    const x = player.x - 20;
    const y = player.y + 50;
    const width = 40;
    const height = 6;

    if (player.canUseSpecial) {
      bar.fillStyle(0x00ff00);
      bar.fillRect(x, y, width, height);
      bar.lineStyle(1, 0xffffff);
      bar.strokeRect(x, y, width, height);

    } else {
      bar.fillStyle(0x444444, 0.5);
      bar.fillRect(x, y, width, height);
      bar.lineStyle(1, 0x888888);
      bar.strokeRect(x, y, width, height);
    }
  }

  updateSpecialBars() {
    this.updateSpecialBar(this.specialBars.p1, this.player1);
    this.updateSpecialBar(this.specialBars.p2, this.player2);

  }

  update() {
    if (this.gameOver) return;
    this.updateSpecialBars();

    [this.player1, this.player2].forEach(player => {
      this.setVelocity(player)
      this.handleSpecialProjectile(player);
    });
    this.setDirection(this.player1, this.player2);
    this.setDirection(this.player2, this.player1);
    this.handleAttack(this.player1);
    this.handleAttack(this.player2);
  }
}
