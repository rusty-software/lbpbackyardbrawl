export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.add.text(260, 150, 'LBP Backyard Brawl', {
      fontSize: '32px',
      color: '#fff',
      fontStyle: 'bold'
    });

    this.add.text(280, 250, 'Press 1 for Single Player', {
      fontSize: '20px',
      color: '#ccc'
    });
    this.add.text(280, 290, 'Press 2 for PvP', {
      fontSize: '20px',
      color: '#ccc'
    });

    this.input.keyboard.on('keydown-ONE', () => {
      this.scene.start('SelectScene', { aiMode: true });
    });
    this.input.keyboard.on('keydown-TWO', () => {
      this.scene.start('SelectScene', { aiMode: false });
    });

  }
}