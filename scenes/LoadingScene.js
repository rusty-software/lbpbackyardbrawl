import { CHARACTERS } from "../characters.js";
import { POWERUPS } from "../powerups.js";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super('LoadingScene');
  }

  preload() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 20, 'Loading...', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const progressBar = this.add.graphics().fillStyle(0x222222, 0.8).fillRect(width / 2 - 160, height / 2, 320, 25);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 2, 300 * value, 20);
    });

    this.load.on('complete', () => {
      this.scene.start('TitleScene');
    });

    this.loadTitleAssets();
    this.loadPlayerEntryAssets();
    this.loadCharacterAssets();
    this.loadMainAssets();
    this.loadWinAssets();
  }

  loadTitleAssets() {
    this.load.image('splash', 'assets/title.png');
    this.load.bitmapFont('peaberry', 'assets/fonts/peaberry.png', 'assets/fonts/peaberry.fnt');
    this.load.audio('titleMusic', 'assets/audio/title-soundtrack.mp3');
  }

  loadPlayerEntryAssets() {
    this.load.audio('selectMusic', 'assets/audio/select-soundtrack.mp3');
  }

  loadCharacterAssets() {
    Object.values(CHARACTERS).forEach(c => {
      this.load.image(c.sprite, `assets/${c.sprite}.png`);
    });
  }

  loadMainAssets() {
    this.load.image('platform', 'assets/platform.png');
    Object.values(POWERUPS).forEach(pu => {
      this.load.image(pu.key, `assets/powerups/${pu.sprite}.png`);
    });

    ['book', 'brokenheartking', 'cookiedough', 'dorito', 'envelope',
      'hdmicoil', 'hotdog', 'lightningball', 'mandown', 'milkdrop',
      'roboclamp', 'rocketship', 'scorpionsauce', 'spade', 'waterdrop'
    ].forEach(p => {
      this.load.image(`proj_${p}`, `assets/projectiles/${p}.png`);
    });

    ['backyard', 'driveway', 'game-room'].forEach(b => {
      this.load.image(`${b}`, `assets/backgrounds/${b}.png`);
    });

    this.load.audio('roundStart', 'assets/audio/fight.mp3');
    this.load.audio('fightMusic1', 'assets/audio/fight-soundtrack-01.mp3');
    this.load.audio('fightMusic2', 'assets/audio/fight-soundtrack-02.mp3');
    this.load.audio('fightMusic3', 'assets/audio/fight-soundtrack-03.mp3');
  }

  loadWinAssets() {
    this.load.audio('winMusic', 'assets/audio/win-soundtrack.mp3');
  }

  create() { }
}
