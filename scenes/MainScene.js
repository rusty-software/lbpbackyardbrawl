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
      up: 'W'
    });

    this.p2Controls = this.input.keyboard.addKeys({
      left: 'LEFT',
      right: 'RIGHT',
      up: 'UP'
    });
  }


  update() {
    setVelocity(this.player1.body, this.p1Controls);
    setVelocity(this.player2.body, this.p2Controls);

    setDirection(this.player1, this.player2);
    setDirection(this.player2, this.player1);
  }
}