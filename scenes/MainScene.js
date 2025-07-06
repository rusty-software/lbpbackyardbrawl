export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // this.load.image('player', 'assets/player.png');
  }

  create() {
    this.player1 = this.add.rectangle(200, 400, 40, 60, 0x00ff00);
    this.player2 = this.add.rectangle(600, 400, 40, 60, 0xff0000);

    this.physics.add.existing(this.player1);
    this.physics.add.existing(this.player2);
    this.player1.body.setBounce(0.2);
    this.player1.body.setCollideWorldBounds(true);
    this.player2.body.setBounce(0.2);
    this.player2.body.setCollideWorldBounds(true);

    this.ground = this.add.rectangle(400, 580, 800, 40, 0x888888);
    this.physics.add.existing(this.ground, true);

    this.physics.add.collider(this.player1, this.ground);
    this.physics.add.collider(this.player2, this.ground);
  }

  update() {

  }
}