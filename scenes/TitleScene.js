export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  preload() {
    this.load.image('splash', 'assets/title.png');
    this.load.bitmapFont('peaberry', 'assets/fonts/peaberry.png', 'assets/fonts/peaberry.fnt');

  }

  create() {
    this.add.image(400, 300, 'splash');

    this.add.bitmapText(400, 100, 'peaberry', 'LBP Backyard Brawl', 48).setOrigin(0.5);
    this.add.bitmapText(400, 500, 'peaberry', 'Press ENTER to start', 24).setOrigin(0.5);

    const topScorers = this.getTopScorers();
    this.add.text(400, 180, 'Top Scorers:', {
      fontSize: '20px',
      color: '#ffff88'
    }).setOrigin(0.5);

    topScorers.forEach(([name, score], index) => {
      this.add.text(400, 210 + index * 30, `${index + 1}. ${name} — ${score} pts`, {
        fontSize: '18px',
        color: '#ffffff'
      }).setOrigin(0.5);
    });

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.scene.start('PlayerEntryScene');
    }
  }

  getTopScorers(limit = 5) {
    const emptyScore = ['aaa', 0];
    const raw = localStorage.getItem('playerScores');
    if (!raw) return Array.from({ length: 5 }, () => [...emptyScore]);

    const scores = Object.entries(JSON.parse(raw));
    return scores
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
  }
}
