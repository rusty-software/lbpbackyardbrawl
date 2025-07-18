import { CHARACTERS } from "../characters.js";

export default class SelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SelectScene' });
  }

  preload() { }

  create(data) {
    this.p1NameInitials = data.p1Name;
    this.p2NameInitials = data.p2Name;
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
        this.scene.get('PlayerEntryScene').music.stop();
        this.scene.start('MainScene', {
          p1Character: p1Char,
          p2Character: p2Char,
          p1Name: this.p1NameInitials,
          p2Name: this.p2NameInitials
        });
      }
    });
  }

  drawSelection() {
    this.p1Sprite = this.add.sprite(200, 250, this.characterKeys[this.p1Index]);
    this.p2Sprite = this.add.sprite(600, 250, this.characterKeys[this.p2Index]);

    this.p1Name = this.add.text(150, 320, '', { fontSize: '20px', color: '#fff' });
    this.p2Name = this.add.text(550, 320, '', { fontSize: '20px', color: '#fff' });

    this.p1Controls = this.add.text(50, 360, '', { fontSize: '14px', color: '#aaa' });
    this.p2Controls = this.add.text(750, 360, '', { fontSize: '14px', color: '#aaa' }).setOrigin(1, 0);

    this.p1Special = this.add.text(150, 340, '', { fontSize: '14px', color: '#ffcc66' });
    this.p2Special = this.add.text(550, 340, '', { fontSize: '14px', color: '#ffcc66' });

    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (this.selectionStep === 1) {
          const p1Key = this.characterKeys[this.p1Index];
          this.p1Sprite.setTexture(p1Key);
          this.p1Name.setText(`${this.p1NameInitials}: ${CHARACTERS[p1Key].name}`);
          this.p1Controls.setText(`${this.p1NameInitials} Controls:\nMove: A/D\nJump: W\nAttack: F\nSpecial: E`);
          this.p1Special.setText(`Special: ${CHARACTERS[p1Key].specialName || '—'}`);

          this.p2Sprite.setVisible(false);
          this.p2Name.setVisible(false);
          this.p2Controls.setText('');
          this.p2Special.setText('');
        } else {
          const p2Key = this.availableForP2[this.p2Index];
          this.p2Sprite.setTexture(p2Key);
          this.p2Name.setText(`${this.p2NameInitials}: ${CHARACTERS[p2Key].name}`);
          this.p2Controls.setText(`${this.p2NameInitials} Controls:\nMove: ←/→\nJump: ↑\nAttack: \\\nSpecial: SHIFT`);
          this.p2Special.setText(`Special: ${CHARACTERS[p2Key].specialName || '—'}`);

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
    this.instructionBg = this.add.rectangle(400, 520, 620, 50, 0x000000, 0.4).setOrigin(0.5);
    this.instructionsText = this.add.text(400, 520, '', {
      fontSize: '18px',
      color: '#ccc',
      wordWrap: { width: 600 }
    }).setOrigin(0.5);

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
