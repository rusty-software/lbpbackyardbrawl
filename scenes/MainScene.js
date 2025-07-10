import { CHARACTERS } from '../characters.js'

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
    this.load.image('bg', 'assets/background-01.png');
    this.load.image('platform', 'assets/platform.png')
  }

  handleWin(winner) {
    if (this.gameOver) return;
    this.gameOver = true;

    this.scene.launch('WinScene', { winner });
    this.time.delayedCall(300, () => {
      this.scene.pause();
    });
  }

  updateHealthBars() {
    this.tweens.add({
      targets: this.p1HealthBar,
      props: {
        scaleX: { value: this.p1Health / 100, duration: 150 }
      }
    });

    this.tweens.add({
      targets: this.p2HealthBar,
      props: {
        scaleX: { value: this.p2Health / 100, duration: 150 }
      }
    });
  }

  create() {
    this.gameOver = false;
    this.add.image(400, 300, 'bg').setDepth(-1);

    this.ground = this.add.rectangle(400, 580, 800, 40, 0x888888);
    this.physics.add.existing(this.ground, true);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 400, 'platform').setScale(0.5).refreshBody(); // center
    this.platforms.create(150, 300, 'platform').setScale(0.4).refreshBody(); // left
    this.platforms.create(650, 300, 'platform').setScale(0.4).refreshBody(); // right

    this.add.text(20, 50, `P1: ${this.p1Character.name}`, { fontSize: '16px', color: '#fff' });
    this.add.text(620, 50, `P2: ${this.p2Character.name}`, { fontSize: '16px', color: '#fff' });

    this.player1 = this.physics.add.sprite(200, 400, this.p1Character.sprite);
    this.player2 = this.physics.add.sprite(600, 400, this.p2Character.sprite);
    this.player2.setFlipX(true);
    this.player1.setCollideWorldBounds(true);
    this.player2.setCollideWorldBounds(true);
    this.physics.add.collider(this.player1, this.ground);
    this.physics.add.collider(this.player2, this.ground);

    this.player1.body.setBounce(0.2);
    this.player2.body.setBounce(0.2);

    this.physics.add.collider(this.player1, this.platforms);
    this.physics.add.collider(this.player2, this.platforms);

    this.p1Controls = this.input.keyboard.addKeys({
      left: 'A',
      right: 'D',
      up: 'W',
      attack: 'F'
    });

    this.p2Controls = this.input.keyboard.addKeys({
      left: 'LEFT',
      right: 'RIGHT',
      up: 'UP',
      attack: 'L'
    });

    this.attackDuration = 150;

    this.p1CanAttackRef = { value: true };
    this.p1HitLandedRef = { value: false };
    this.p1Hitbox = this.add.rectangle(0, 0, 40, 30, 0xffff00, 0.5);
    this.physics.add.existing(this.p1Hitbox);
    this.p1Hitbox.body.setAllowGravity(false);
    this.p1Hitbox.body.setImmovable(true);
    this.p1Hitbox.setVisible(false);

    this.p2CanAttackRef = { value: true };
    this.p2HitLandedRef = { value: false };
    this.p2Hitbox = this.add.rectangle(0, 0, 40, 30, 0xff00ff, 0.5);
    this.physics.add.existing(this.p2Hitbox);
    this.p2Hitbox.body.setAllowGravity(false);
    this.p2Hitbox.body.setImmovable(true);
    this.p2Hitbox.setVisible(false);

    this.p1Health = 100;
    this.p2Health = 100;
    this.p1HealthBar = this.add.rectangle(20, 20, 200, 20, 0xff0000).setOrigin(0, 0);
    this.p1HealthBar.setScale(1, 1);
    this.p2HealthBar = this.add.rectangle(780, 20, 200, 20, 0x0000ff).setOrigin(1, 0);
    this.p2HealthBar.setScale(1, 1);
    this.updateHealthBars();

    this.physics.add.overlap(this.p1Hitbox, this.player2, () => {
      if (!this.p1HitLandedRef.value) {
        this.p1HitLandedRef.value = true;
        this.p2Health = Math.max(0, this.p2Health - this.p1Character.strength);
        this.player2.setTint(0xff0000);
        this.time.delayedCall(100, () => {
          this.player2.clearTint();
        });
        this.updateHealthBars();

        if (this.p2Health <= 0) {
          this.handleWin(1);
        }
      }
    });

    this.physics.add.overlap(this.p2Hitbox, this.player1, () => {
      if (!this.p2HitLandedRef.value) {
        this.p2HitLandedRef.value = true;
        this.p1Health = Math.max(0, this.p1Health - this.p2Character.strength);
        this.player1.setTint(0xff0000);
        this.time.delayedCall(100, () => {
          this.player1.clearTint();
        });
        this.updateHealthBars();

        if (this.p1Health <= 0) {
          this.handleWin(2);
        }
      }
    });
  }

  setVelocity(player, controls, character) {
    if (controls.left.isDown) {
      player.setVelocityX(-character.speed);
    } else if (controls.right.isDown) {
      player.setVelocityX(character.speed);
    } else {
      player.setVelocityX(0);
    }

    if (controls.up.isDown && player.blocked.down) {
      player.setVelocityY(character.jump);
    }
  }

  setDirection(one, other) {
    const pVelX = one.body.velocity.x;
    if (Math.abs(pVelX) > 5) {
      one.setFlipX(pVelX < 0);
    } else {
      one.setFlipX(one.x > other.x);
    }
  }

  handleAttack({
    attacker,
    defender,
    hitbox,
    attackKey,
    attackCooldown,
    canAttackFlag,
    hitLandedFlag,
    flipXMultiplier,
    scene
  }) {
    if (Phaser.Input.Keyboard.JustDown(attackKey) && canAttackFlag.value) {
      canAttackFlag.value = false;
      hitLandedFlag.value = false;

      const direction = attacker.flipX ? -1 : 1;
      hitbox.setPosition(attacker.x + (direction * flipXMultiplier), attacker.y);
      hitbox.setVisible(true);
      hitbox.body.enable = true;

      scene.physics.add.overlap(hitbox, defender, () => {
        if (!hitLandedFlag.value) {
          hitLandedFlag.value = true;
        }
      });

      scene.time.delayedCall(30, () => {
        hitbox.body.enable = false;
      });
      scene.time.delayedCall(scene.attackDuration, () => {
        hitbox.setVisible(false);
      });

      scene.time.delayedCall(attackCooldown, () => {
        canAttackFlag.value = true;
      });
    }
  }

  update() {
    if (this.gameOver) return;

    this.setVelocity(this.player1.body, this.p1Controls, this.p1Character);
    this.setVelocity(this.player2.body, this.p2Controls, this.p2Character);

    this.setDirection(this.player1, this.player2);
    this.setDirection(this.player2, this.player1);

    this.handleAttack({
      attacker: this.player1,
      defender: this.player2,
      hitbox: this.p1Hitbox,
      attackKey: this.p1Controls.attack,
      attackCooldown: this.p1Character.cooldown || 500,
      canAttackFlag: this.p1CanAttackRef,
      hitLandedFlag: this.p1HitLandedRef,
      flipXMultiplier: 40,
      scene: this
    });
    this.handleAttack({
      attacker: this.player2,
      defender: this.player1,
      hitbox: this.p2Hitbox,
      attackKey: this.p2Controls.attack,
      attackCooldown: this.p2Character.cooldown || 500,
      canAttackFlag: this.p2CanAttackRef,
      hitLandedFlag: this.p2HitLandedRef,
      flipXMultiplier: 40,
      scene: this
    });
  }
}