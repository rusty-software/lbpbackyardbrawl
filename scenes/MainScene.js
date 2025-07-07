function setVelocity(player, playerControls) {
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

function setDirection(one, other) {
  const pVelX = one.body.velocity.x;
  if (Math.abs(pVelX) > 5) {
    one.setFlipX(pVelX < 0);
  } else {
    one.setFlipX(one.x > other.x);
  }
}

// function handleAttack(pThis, controlsKey, canAttackKey, hitboxKey, playerKey, hitLandedKey) {
//   if (Phaser.Input.Keyboard.JustDown(pThis[controlsKey].attack) && pThis[canAttackKey]) {
//     pThis[canAttackKey] = false;

//     const flip = pThis[playerKey].flipX ? -1 : 1;
//     pThis[hitboxKey].setPosition(pThis[playerKey].x + (flip * 40), pThis[playerKey].y);
//     pThis[hitboxKey].setVisible(true);

//     pThis[hitLandedKey] = false;
//     pThis.time.delayedCall(pThis.attackDuration, () => {
//       pThis[hitboxKey].setVisible(false);
//     })
//     pThis.time.delayedCall(pThis.attackCooldown, () => {
//       pThis[canAttackKey] = true;
//     })
//   }
// }

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('chase', 'assets/chase.png');
    this.load.image('garner', 'assets/garner.png');
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

    // note that the player has to be added to the physics engine in order to access setBounce 
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

    this.p1CanAttack = true;
    this.p1HitLanded = false;
    this.p1Hitbox = this.add.rectangle(0, 0, 40, 30, 0xffff00, 0.5);
    this.physics.add.existing(this.p1Hitbox);
    this.p1Hitbox.body.setAllowGravity(false);
    this.p1Hitbox.body.setImmovable(true);
    this.p1Hitbox.setVisible(false);

    this.p2HitLanded = false;
    this.p2CanAttack = true;
    this.p2Hitbox = this.add.rectangle(0, 0, 40, 30, 0xff00ff, 0.5);
    this.physics.add.existing(this.p2Hitbox);
    this.p2Hitbox.body.setAllowGravity(false);
    this.p2Hitbox.body.setImmovable(true);
    this.p2Hitbox.setVisible(false);

    this.physics.add.overlap(this.p1Hitbox, this.player2, () => {
      if (!this.p1HitLanded) {
        console.log('Player 1 hit Player 2!');
        this.p1HitLanded = true;
      }
    });

    this.physics.add.overlap(this.p2Hitbox, this.player1, () => {
      if (!this.p2HitLanded) {
        console.log('Player 2 hit Player 1!');
        this.p2HitLanded = true;
      }
    });
  }

  update() {
    setVelocity(this.player1.body, this.p1Controls);
    setVelocity(this.player2.body, this.p2Controls);

    setDirection(this.player1, this.player2);
    setDirection(this.player2, this.player1);

    // TODO: remove duplication
    // handleAttack(this, "p1Controls", "p1CanAttack", "p1Hitbox", "player1", "p1HitLandedKey");
    if (Phaser.Input.Keyboard.JustDown(this.p1Controls.attack) && this.p1CanAttack) {
      this.p1CanAttack = false;

      const flip = this.player1.flipX ? -1 : 1;
      this.p1Hitbox.setPosition(this.player1.x + (flip * 40), this.player1.y);
      this.p1Hitbox.setVisible(true);

      this.p1HitLanded = false;
      this.time.delayedCall(this.attackDuration, () => {
        this.p1Hitbox.setVisible(false);
      });

      this.time.delayedCall(this.attackCooldown, () => {
        this.p1CanAttack = true;
      });
    }

    if (Phaser.Input.Keyboard.JustDown(this.p2Controls.attack) && this.p2CanAttack) {
      this.p2CanAttack = false;

      const flip = this.player2.flipX ? -1 : 1;
      this.p2Hitbox.setPosition(this.player2.x + (flip * 40), this.player2.y);
      this.p2Hitbox.setVisible(true);

      this.p2HitLanded = false;
      this.time.delayedCall(this.attackDuration, () => {
        this.p2Hitbox.setVisible(false);
      });

      this.time.delayedCall(this.attackCooldown, () => {
        this.p2CanAttack = true;
      });
    }
  }
}