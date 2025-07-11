import { POWERUPS } from '../powerups.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init(data) {
    this.p1Character = data.p1Character;
    this.p2Character = data.p2Character;
  }

  preload() {
    this.load.image('chase', 'assets/chase.png');
    this.load.image('curtis', 'assets/curtis.png');
    // this.load.image('bg', 'assets/background-01.png');
    this.load.image('bg', 'assets/sky.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('powerup_brisket', 'assets/powerups/brisket.png');
    this.load.image('powerup_popper', 'assets/powerups/popper.png');
    this.load.image('powerup_shield', 'assets/powerups/shield.png');
    this.load.image('powerup_hotdog', 'assets/powerups/hotdog.png');
    this.load.image('powerup_dorito', 'assets/powerups/dorito.png');
    this.load.image('proj_hotdog', 'assets/projectiles/hotdog.png');
    this.load.image('proj_dorito', 'assets/projectiles/dorito.png');
  }

  create() {
    this.gameOver = false;
    this.attackDuration = 150;

    this.add.image(400, 300, 'bg').setDepth(-1);

    this.platforms = this.physics.add.staticGroup();
    [[400, 590, 2], [400, 400, 0.5], [75, 250, 0.4], [725, 220, 0.4]].forEach(([x, y, scale]) => {
      this.platforms.create(x, y, 'platform').setScale(scale).refreshBody();
    });

    this.add.text(20, 50, `P1: ${this.p1Character.name}`, { fontSize: '16px', color: '#fff' });
    this.add.text(620, 50, `P2: ${this.p2Character.name}`, { fontSize: '16px', color: '#fff' });

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
    player.healthBar = this.add.rectangle(
      isPlayer2 ? 780 : 20,
      20,
      200,
      20,
      isPlayer2 ? 0x0000ff : 0xff0000
    ).setOrigin(isPlayer2 ? 1 : 0, 0);
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
          defender.setTint(0xff0000);
          this.time.delayedCall(100, () => defender.clearTint());
          this.updateHealthBars();
          if (defender.health <= 0) this.handleWin(attacker === this.player1 ? 1 : 2);
        }
      }
    });

    return state;
  }

  updateHealthBars() {
    this.tweens.add({ targets: this.player1.healthBar, props: { scaleX: { value: this.player1.health / 100, duration: 150 } } });
    this.tweens.add({ targets: this.player2.healthBar, props: { scaleX: { value: this.player2.health / 100, duration: 150 } } });
  }

  handleWin(winner) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.scene.launch('WinScene', { winner });
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

    const powerup = this.physics.add.sprite(x, y, def.sprite)
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

    data.apply(player);
    player.setTint(0xffff00);

    const timer = this.time.delayedCall(data.duration, () => {
      data.revert(player);
      player.activePowerup = null;
      player.clearTint();
    });

    player.activePowerup = { data, timer };
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

    this.physics.add.collider(projectile, this.platforms, () => projectile.destroy());

    const target = owner === this.player1 ? this.player2 : this.player1;
    this.physics.add.overlap(projectile, target, (proj, victim) => {
      if (!victim.invincible) {
        victim.health = Math.max(0, victim.health - damage);
        this.updateHealthBars();
        victim.setTint(0xff0000);
        this.time.delayedCall(100, () => victim.clearTint());
        proj.destroy();
        if (victim.health <= 0) this.handleWin(owner === this.player1 ? 1 : 2);
      }
    });

    this.time.delayedCall(2000, () => {
      if (projectile.active) projectile.destroy();
    });

    return projectile;
  }

  handleSpecialProjectile(player) {
    if (Phaser.Input.Keyboard.JustDown(player.controls.special) && player.canUseSpecial) {
      player.canUseSpecial = false;

      if (player.canFireHotdogs) {
        this.fireProjectile(player, 'proj_hotdog', 300, 10);
      } else if (player.canFireDoritos) {
        const proj = this.fireProjectile(player, 'proj_dorito', 200, 6);
        proj.setCollideWorldBounds(true).setBounce(1);
      }

      this.time.delayedCall(500, () => {
        player.canUseSpecial = true;
      });
    }
  }

  update() {
    if (this.gameOver) return;

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
