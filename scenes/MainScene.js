export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('chase', 'assets/chase.png');
    this.load.image('garner', 'assets/garner.png');
  }

  drawHealthBars() {
    this.p1HealthBar.clear();
    this.p2HealthBar.clear();

    this.p1HealthBar.fillStyle(0xff0000);
    this.p1HealthBar.fillRect(20, 20, this.p1Health * 2, 20);

    this.p2HealthBar.fillStyle(0x0000ff);
    this.p2HealthBar.fillRect(780 - this.p2Health * 2, 20, this.p2Health * 2, 20);
  }

  handleWin(winner) {
    this.add.text(300, 250, `Player ${winner} Wins!`, {
      fontSize: '32px',
      color: "#ffffff"
    });
    this.scene.pause();
  }

  create() {
    this.ground = this.add.rectangle(400, 580, 800, 40, 0x888888);
    this.physics.add.existing(this.ground, true);

    this.player1 = this.physics.add.sprite(200, 400, 'chase');
    this.player2 = this.physics.add.sprite(600, 400, 'garner');
    this.player2.setFlipX(true);
    this.player1.setCollideWorldBounds(true);
    this.player2.setCollideWorldBounds(true);
    this.physics.add.collider(this.player1, this.ground);
    this.physics.add.collider(this.player2, this.ground);

    this.player1.body.setBounce(0.2);
    this.player2.body.setBounce(0.2);

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
    this.attackCooldown = 500;

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
    this.p1HealthBar = this.add.graphics();
    this.p2HealthBar = this.add.graphics();
    this.drawHealthBars();

    this.physics.add.overlap(this.p1Hitbox, this.player2, () => {
      if (!this.p1HitLandedRef.value) {
        this.p1HitLandedRef.value = true;
        this.p2Health = Math.max(0, this.p2Health - 10);
        this.drawHealthBars();

        if (this.p2Health <= 0) {
          this.handleWin(1);
        }
      }
    });

    this.physics.add.overlap(this.p2Hitbox, this.player1, () => {
      if (!this.p2HitLandedRef.value) {
        this.p2HitLandedRef.value = true;
        this.p1Health = Math.max(0, this.p1Health - 10);
        this.drawHealthBars();

        if (this.p1Health <= 0) {
          this.handleWin(2);
        }
      }
    });
  }

  setVelocity(player, playerControls) {
    if (playerControls.left.isDown) {
      player.setVelocityX(-160);
    } else if (playerControls.right.isDown) {
      player.setVelocityX(160);
    } else {
      player.setVelocityX(0);
    }

    if (playerControls.up.isDown && player.blocked.down) {
      player.setVelocityY(-400);
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
          console.log(`${attacker.texture.key} hit ${defender.texture.key}`);
          hitLandedFlag.value = true;
        }
      });

      scene.time.delayedCall(150, () => {
        hitbox.setVisible(false);
      });

      scene.time.delayedCall(500, () => {
        canAttackFlag.value = true;
      });
    }
  }

  update() {
    this.setVelocity(this.player1.body, this.p1Controls);
    this.setVelocity(this.player2.body, this.p2Controls);

    this.setDirection(this.player1, this.player2);
    this.setDirection(this.player2, this.player1);

    this.handleAttack({
      attacker: this.player1,
      defender: this.player2,
      hitbox: this.p1Hitbox,
      attackKey: this.p1Controls.attack,
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
      canAttackFlag: this.p2CanAttackRef,
      hitLandedFlag: this.p2HitLandedRef,
      flipXMultiplier: 40,
      scene: this
    });
  }
}