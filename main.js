import LoadingScene from './scenes/LoadingScene.js';
import TitleScene from './scenes/TitleScene.js';
import PlayerEntryScene from './scenes/PlayerEntryScene.js';
import SelectScene from './scenes/SelectScene.js';
import MainScene from './scenes/MainScene.js';
import WinScene from './scenes/WinScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#222',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  scene: [LoadingScene, TitleScene, PlayerEntryScene, SelectScene, MainScene, WinScene]
}

const game = new Phaser.Game(config);