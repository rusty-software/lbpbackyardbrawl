export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  init(data) {
    this.p1Character = data.p1Character;
    this.p2Character = data.p2Character;
  }

  preload() {
    this.load.image('chase', 'assets/chase.png');
    this.load.image('curtis', 'assets/curtis.png');
    this.load.image('bg', 'assets/background-01.png');
    this.load.image('platform', 'assets/platform.png');
  }

  create() {
    this.gameOver = false;
    this.attackDuration = 150;

    this.add.image(400, 300, 'bg').setDepth(-1);

    this.ground = this.add.rectangle(400, 580, 800, 40, 0x888888);
    this.physics.add.existing(this.ground, true);

    this.platforms = this.physics.add.staticGroup();
    [[400, 400, 0.5], [150, 300, 0.4], [650, 300, 0.4]].forEach(([x, y, scale]) => {
      this.platforms.create(x, y, 'platform').setScale(scale).refreshBody();
    });

    this.add.text(20, 50, `P1: ${this.p1Character.name}`, { fontSize: '16px', color: '#fff' });
    this.add.text(620, 50, `P2: ${this.p2Character.name}`, { fontSize: '16px', color: '#fff' });

    this.p1Controls = this.input.keyboard.addKeys({ left: 'A', right: 'D', up: 'W', attack: 'F' });
    this.p2Controls = this.input.keyboard.addKeys({ left: 'LEFT', right: 'RIGHT', up: 'UP', attack: 'L' });

    this.player1 = this.createPlayer(200, 400, this.p1Character, this.p1Controls, false);
    this.player2 = this.createPlayer(600, 400, this.p2Character, this.p2Controls, true);

    this.player1.combat = this.setupAttack(this.player1, this.player2, 0xffff00);
    this.player2.combat = this.setupAttack(this.player2, this.player1, 0xff00ff);

    this.updateHealthBars();
  }

  createPlayer(x, y, characterData, controls, isPlayer2) {
    const player = this.physics.add.sprite(x, y, characterData.sprite);
    player.setCollideWorldBounds(true).setBounce(0.2).setFlipX(isPlayer2);
    this.physics.add.collider(player, this.ground);
    this.physics.add.collider(player, this.platforms);
    player.character = characterData;
    player.controls = controls;
    player.health = 100;
    player.healthBar = this.add.rectangle(
      isPlayer2 ? 780 : 20,
      20,
      200,
      20,
      isPlayer2 ? 0x0000ff : 0xff0000
    ).setOrigin(isPlayer2 ? 1 : 0, 0);
    player.healthBar.setScale(1, 1);
    return player;
  }

  setupAttack(attacker, defender, color) {
    const hitbox = this.add.rectangle(0, 0, 40, 30, color, 0.5);
    this.physics.add.existing(hitbox);
    hitbox.body.setAllowGravity(false);
    hitbox.body.setImmovable(true);
    hitbox.setVisible(false);

    const state = { canAttack: true, hitLanded: false, hitbox };

    this.physics.add.overlap(hitbox, defender, () => {
      if (!state.hitLanded) {
        state.hitLanded = true;
        defender.health = Math.max(0, defender.health - attacker.character.strength);
        defender.setTint(0xff0000);
        this.time.delayedCall(100, () => defender.clearTint());
        this.updateHealthBars();
        if (defender.health <= 0) this.handleWin(attacker === this.player1 ? 1 : 2);
      }
    });

    return state;
  }

  updateHealthBars() {
    this.tweens.add({ targets: this.player1.healthBar, props: { scaleX: { value: this.player1.health / 100, duration: 150 } } });
    this.tweens.add({ targets: this.player2.healthBar, props: { scaleX: { value: this.player2.health / 100, duration: 150 } } });
  }

  handleWin(winner) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.scene.launch('WinScene', { winner });
    this.time.delayedCall(300, () => this.scene.pause());
  }

  setVelocity(player) {
    const { left, right, up } = player.controls;
    if (left.isDown) player.setVelocityX(-player.character.speed);
    else if (right.isDown) player.setVelocityX(player.character.speed);
    else player.setVelocityX(0);

    if (up.isDown && player.body.blocked.down) {
      player.setVelocityY(player.character.jump);
    }
  }

  setDirection(one, other) {
    const pVelX = one.body.velocity.x;
    if (Math.abs(pVelX) > 5) one.setFlipX(pVelX < 0);
    else one.setFlipX(one.x > other.x);
  }

  handleAttack(player) {
    const { attack } = player.controls;
    const { canAttack, hitbox } = player.combat;

    if (Phaser.Input.Keyboard.JustDown(attack) && canAttack) {
      player.combat.canAttack = false;
      player.combat.hitLanded = false;

      const direction = player.flipX ? -1 : 1;
      hitbox.setPosition(player.x + (direction * 40), player.y);
      hitbox.setVisible(true);
      hitbox.body.enable = true;

      this.time.delayedCall(30, () => hitbox.body.enable = false);
      this.time.delayedCall(this.attackDuration, () => hitbox.setVisible(false));
      this.time.delayedCall(player.character.cooldown || 500, () => player.combat.canAttack = true);
    }
  }

  update() {
    if (this.gameOver) return;

    [this.player1, this.player2].forEach(player => this.setVelocity(player));
    this.setDirection(this.player1, this.player2);
    this.setDirection(this.player2, this.player1);
    this.handleAttack(this.player1);
    this.handleAttack(this.player2);
  }
}
