export default class PlayerEntryScene extends Phaser.Scene {
  constructor() {
    super('PlayerEntryScene');
  }

  preload() {
    this.load.audio('selectMusic', 'assets/audio/select-soundtrack.mp3');
  }

  create() {
    this.music = this.sound.add('selectMusic', { loop: true });
    this.music.play();

    this.players = [
      { label: 'Player One', initials: '', done: false },
      { label: 'Player Two', initials: '', done: false }
    ];
    this.currentIndex = 0;

    this.input.keyboard.on('keydown', this.handleKeyInput, this);

    this.instructionText = this.add.text(400, 80, 'Enter 3-letter initials (A–Z, 0–9)', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.entryTexts = this.players.map((player, idx) => {
      return this.add.text(400, 180 + idx * 60, `${player.label}: ___`, {
        fontSize: '32px',
        color: '#ffffaa'
      }).setOrigin(0.5);
    });

    this.promptText = this.add.text(400, 400, 'Press ENTER to continue', {
      fontSize: '18px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    this.updateText();
  }

  handleKeyInput(event) {
    const code = event.key.toUpperCase();
    const player = this.players[this.currentIndex];

    if (/^[A-Z0-9]$/.test(code) && player.initials.length < 3) {
      player.initials += code;
      this.updateText();
    } else if (event.key === 'Backspace' && player.initials.length > 0) {
      player.initials = player.initials.slice(0, -1);
      this.updateText();
    } else if (event.key === 'Enter') {
      if (player.initials.length === 3) {
        player.done = true;
        this.currentIndex++;
        if (this.currentIndex >= this.players.length) {
          this.finalizePlayers();
        } else {
          this.updateText();
        }
      } else {
        this.promptText.setText('Enter 3 characters to continue');
      }
    }
  }

  updateText() {
    this.entryTexts.forEach((text, idx) => {
      const p = this.players[idx];
      const display = p.initials.padEnd(3, '_');
      const isCurrent = idx === this.currentIndex;
      text.setText(`${p.label}: ${display}`);
      text.setColor(isCurrent ? '#ffffff' : '#ffffaa');
    });

    if (this.currentIndex === 0) {
      this.promptText.setText('Press ENTER to move on to Player Two');
    } else {
      this.promptText.setText('Press ENTER to select characters');
    }
  }

  finalizePlayers() {
    const [one, two] = Phaser.Utils.Array.Shuffle(this.players);

    this.scene.start('SelectScene', {
      p1Name: one.initials,
      p2Name: two.initials
    });
  }
}
