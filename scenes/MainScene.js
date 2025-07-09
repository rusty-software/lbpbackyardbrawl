import { CHARACTERS } from '../characters.js'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init(data) {
    this.p1Character = data.p1Character;
    this.p2Character = data.p2Character;
    this.aiMode = data.aiMode || false;
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

    if (this.aiMode) {
      this.tweens.add({
        targets: this.aiHealthBar,
        scaleX: this.aiHealth / 100,
        duration: 150
      });
    } else {
      this.tweens.add({
        targets: this.p2HealthBar,
        props: {
          scaleX: { value: this.p2Health / 100, duration: 150 }
        }
      });
    }
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

    this.createPlayer1();
    if (this.aiMode) {
      this.createAIPlayer(this.p2Character);
    } else {
      this.createPlayer2(this.p2Character);
    }

    this.p1Controls = this.input.keyboard.addKeys({
      left: 'A',
      right: 'D',
      up: 'W',
      attack: 'F'
    });

    if (!this.aiMode) {
      this.p2Controls = this.input.keyboard.addKeys({
        left: 'LEFT',
        right: 'RIGHT',
        up: 'UP',
        attack: 'L'
      });
    }

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
    this.aiHealthBar = this.add.rectangle(780, 20, 200, 20, 0x00ccff).setOrigin(1, 0);
    this.aiHealthBar.setScale(1, 1);
    if (this.aiMode) {
      this.p2HealthBar.setVisible(false);
    } else {
      this.aiHealthBar.setVisible(false);
    }
    this.updateHealthBars();

    const p1Target = this.aiMode ? this.aiPlayer : this.player2;

    this.physics.add.overlap(this.p1Hitbox, p1Target, () => {
      if (!this.p1HitLandedRef.value) {
        this.p1HitLandedRef.value = true;

        let targetHealth;
        if (this.aiMode) {
          this.aiHealth = Math.max(0, this.aiHealth - this.p1Character.strength);
          targetHealth = this.aiHealth;
        } else {
          this.p2Health = Math.max(0, this.p2Health - this.p1Character.strength);
          targetHealth = this.p2Health;
        }
        console.log("target health:", targetHealth);

        p1Target.setTint(0xff0000);
        this.time.delayedCall(100, () => {
          p1Target.clearTint();
        });

        this.updateHealthBars();

        if (targetHealth <= 0) {
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

    this.physics.add.overlap(this.aiHitbox, this.player1, () => {
      if (!this.aiHitLandedRef.value) {
        this.aiHitLandedRef.value = true;
        this.p1Health = Math.max(0, this.p1Health - this.aiCharacter.strength);
        this.player1.setTint(0xff0000);
        this.time.delayedCall(100, () => {
          this.player1.clearTint();
        });
        this.updateHealthBars();

        if (this.p1Health <= 0) {
          this.handleWin('AI');
        }
      }
    });
  }

  createPlayer1() {
    this.player1 = this.physics.add.sprite(200, 400, this.p1Character.sprite);
    this.player1.setCollideWorldBounds(true);
    this.physics.add.collider(this.player1, this.ground);
    this.physics.add.collider(this.player1, this.platforms);
    this.player1.body.setBounce(0.2);
  }

  createPlayer2(character) {
    this.player2 = this.physics.add.sprite(600, 400, character.sprite);
    this.player2.setFlipX(true);
    this.player2.setCollideWorldBounds(true);
    this.physics.add.collider(this.player2, this.ground);
    this.physics.add.collider(this.player2, this.platforms);
    this.player2.body.setBounce(0.2);

    this.p2Character = character;
  }

  createAIPlayer(character) {
    this.aiHealth = 100;
    this.aiPlayer = this.physics.add.sprite(600, 400, character.sprite);
    this.aiPlayer.setFlipX(true);
    this.aiPlayer.setCollideWorldBounds(true);
    this.physics.add.collider(this.aiPlayer, this.ground);
    this.physics.add.collider(this.aiPlayer, this.platforms);
    this.aiPlayer.body.setBounce(0.2);

    this.aiCharacter = character;

    this.aiHitbox = this.add.rectangle(0, 0, 40, 30, 0x00ffff, 0.5);
    this.physics.add.existing(this.aiHitbox);
    this.aiHitbox.body.setAllowGravity(false);
    this.aiHitbox.body.setImmovable(true);
    this.aiHitbox.setVisible(false);

    this.aiCanAttackRef = { value: true };
    this.aiHitLandedRef = { value: false };
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

  handleAIAttack() {
    if (!this.aiCanAttackRef.value) return;

    const ai = this.aiPlayer;
    const p1 = this.player1;

    const distance = Phaser.Math.Distance.Between(ai.x, ai.y, p1.x, p1.y);
    if (distance > 60) return;

    this.aiCanAttackRef.value = false;
    this.aiHitLandedRef.value = false;

    const direction = ai.flipX ? -1 : 1;
    this.aiHitbox.setPosition(ai.x + (direction * 40), ai.y);
    this.aiHitbox.setVisible(true);
    this.aiHitbox.body.enable = true

    this.time.delayedCall(150, () => {
      this.aiHitbox.setVisible(false);
      this.aiHitbox.body.enable = false;
    });

    this.time.delayedCall(this.aiCharacter.cooldown || 500, () => {
      this.aiCanAttackRef.value = true;
    });
  }

  updateAI() {
    const ai = this.aiPlayer.body;
    const p1X = this.player1.x;
    const p2X = this.aiPlayer.x;
    const distance = Math.abs(p1X - p2X);

    const direction = p1X > p2X ? 1 : -1;
    ai.setVelocityX(direction * this.aiCharacter.speed);
    this.aiPlayer.setFlipX(direction < 0);

    if (distance < 60) {
      ai.setVelocityX(0);
      this.aiPlayer.setFlip(p2X > p1X);
    }

    this.handleAIAttack();
  }

  update() {
    if (this.gameOver) return;

    const p2 = this.aiMode ? this.aiPlayer : this.player2;

    this.setVelocity(this.player1.body, this.p1Controls, this.p1Character);
    this.setDirection(this.player1, p2);
    this.handleAttack({
      attacker: this.player1,
      defender: p2,
      hitbox: this.p1Hitbox,
      attackKey: this.p1Controls.attack,
      attackCooldown: this.p1Character.cooldown || 500,
      canAttackFlag: this.p1CanAttackRef,
      hitLandedFlag: this.p1HitLandedRef,
      flipXMultiplier: 40,
      scene: this
    });

    if (this.aiMode) {
      this.updateAI();
    } else {
      this.setVelocity(this.player2.body, this.p2Controls, this.p2Character);
      this.setDirection(this.player2, this.player1);
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
}