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

    // TODO: replace rectangular players with images
    // this.player1 = this.add.rectangle(200, 400, 40, 60, 0x00ff00);
    // this.player2 = this.add.rectangle(600, 400, 40, 60, 0xff0000);
    // this.physics.add.existing(this.player1);
    // this.physics.add.existing(this.player2);

    this.player1 = this.physics.add.sprite(200, 400, 'chase');
    this.player2 = this.physics.add.sprite(600, 400, 'garner');
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

    const p1 = this.player1.body;
    const p2 = this.player2.body;

    if (this.p1Controls.left.isDown) {
      p1.setVelocityX(-160);
    } else if (this.p1Controls.right.isDown) {
      p1.setVelocityX(160);
    } else {
      p1.setVelocityX(0);
    }

    if (this.p1Controls.up.isDown && p1.blocked.down) {
      p1.setVelocityY(-400);
    }

    if (this.p2Controls.left.isDown) {
      p2.setVelocityX(-160);
    } else if (this.p2Controls.right.isDown) {
      p2.setVelocityX(160);
    } else {
      p2.setVelocityX(0);
    }

    if (this.p2Controls.up.isDown && p2.blocked.down) {
      p2.setVelocityY(-400);
    }

    this.player1.setFlipX(this.player1.body.velocity.x < 0);
    this.player2.setFlipX(this.player2.body.velocity.x < 0);
  }
}