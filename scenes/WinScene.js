export default class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' });
  }

  init(data) {
    this.winner = data.winner;
  }

  create() {
    this.add.rectangle(400, 300, 500, 150, 0x000000, 0.6);
    this.add.text(290, 275, `Player ${this.winner} Wins!`, {
      fontSize: '32px',
      fontStyle: 'bold',
      color: "#ffffff"
    });
    this.add.text(310, 320, 'Press R to Restart', { fontSize: '18px', color: '#cccccc' });

    this.input.keyboard.once('keydown-R', () => {
      this.scene.stop('SelectScene');
      this.scene.stop('MainScene');
      this.scene.stop('WinScene');
      this.scene.start('SelectScene');
    });
  }
}