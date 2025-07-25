export default class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' });
  }

  init(data) {
    this.winner = data.winner;
    this.loser = data.loser;
  }

  preload() { }

  create() {
    this.music = this.sound.add('winMusic', { loop: true });
    this.music.play();

    this.updateScores(this.winner, this.loser);

    this.add.rectangle(400, 250, 500, 200, 0x000000, 0.6);
    this.add.text(400, 200, `${this.winner} Wins!`, {
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 300, 'Press Enter to return to title', {
      fontSize: '18px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.music.stop();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.stop('LoadingScene');
        this.scene.stop('TitleScene');
        this.scene.stop('PlayerEntryScene');
        this.scene.stop('SelectScene');
        this.scene.stop('MainScene');
        this.scene.stop('WinScene');
        this.scene.start('TitleScene');
      });
    }
  }

  updateScores(winner, loser) {
    const scores = JSON.parse(localStorage.getItem('playerScores') || '{}');
    scores[winner] = (scores[winner] || 0) + 3;
    scores[loser] = (scores[loser] || 0) + 1;
    localStorage.setItem('playerScores', JSON.stringify(scores));
  }
}