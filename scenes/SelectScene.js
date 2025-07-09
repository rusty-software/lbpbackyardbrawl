import { CHARACTERS } from "../characters.js";

export default class SelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SelectScene' });
  }

  init(data) {
    this.aiMode = data.aiMode;
  }

  preload() {
    this.load.image('chase', 'assets/chase.png');
    this.load.image('curtis', 'assets/curtis.png');
    this.load.image('garner', 'assets/garner.png');
  }

  create() {
    this.characterKeys = Object.keys(CHARACTERS);
    this.selectionStep = 1;
    this.p1Index = 0;
    this.p2Index = 0;
    this.p1CharacterKey = null;

    this.drawSelection();
    this.drawInstructions();

    this.input.keyboard.on('keydown-A', () => {
      if (this.selectionStep === 1) {
        this.p1Index = this.wrap(this.p1Index - 1, this.characterKeys.length);
      } else {
        this.p2Index = this.wrap(this.p2Index - 1, this.availableForP2.length);
      }
    });
    this.input.keyboard.on('keydown-D', () => {
      if (this.selectionStep === 1) {
        this.p1Index = this.wrap(this.p1Index + 1, this.characterKeys.length);
      } else {
        this.p2Index = this.wrap(this.p2Index + 1, this.availableForP2.length);
      }
    });
    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.selectionStep === 1) {
        this.p1CharacterKey = this.characterKeys[this.p1Index];
        this.availableForP2 = this.characterKeys.filter(k => k !== this.p1CharacterKey);
        this.selectionStep = 2;
        this.p2Index = 0;
      } else {
        const p2CharacterKey = this.availableForP2[this.p2Index];
        const p1Char = CHARACTERS[this.p1CharacterKey];
        const p2Char = CHARACTERS[p2CharacterKey];
        this.scene.start('MainScene', {
          p1Character: p1Char,
          p2Character: p2Char,
          aiMode: this.aiMode
        });
      }
    });
  }

  drawSelection() {
    this.p1Sprite = this.add.sprite(200, 250, this.characterKeys[this.p1Index]);
    this.p2Sprite = this.add.sprite(600, 250, this.characterKeys[this.p2Index]);

    this.p1Name = this.add.text(150, 320, '', { fontSize: '20px', color: '#fff' });
    this.p2Name = this.add.text(550, 320, '', { fontSize: '20px', color: '#fff' });

    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (this.selectionStep === 1) {
          const p1Key = this.characterKeys[this.p1Index];
          this.p1Sprite.setTexture(p1Key);
          this.p1Name.setText(`P1: ${CHARACTERS[p1Key].name}`);
          this.p2Sprite.setVisible(false);
          this.p2Name.setVisible(false);
        } else {
          const p2Key = this.availableForP2[this.p2Index];
          this.p2Sprite.setTexture(p2Key);
          this.p2Name.setText(`P2: ${CHARACTERS[p2Key].name}`);
          this.p1Sprite.setTexture(this.p1CharacterKey);
          this.p2Sprite.setVisible(true);
          this.p2Name.setVisible(true);
        }
      }
    });
  }

  wrap(index, length) {
    return (index + length) % length;
  }

  drawInstructions() {
    this.instructionsText = this.add.text(240, 400, '', { fontSize: '18px', color: '#ccc' });

    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        this.instructionsText.setText(
          this.selectionStep === 1
            ? 'Player 1: Choose your character (A/D, Enter)'
            : 'Player 2: Choose your character (A/D, Enter)'
        );
      }
    });
  }
}