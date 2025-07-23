import PlayerController from "./PlayerController.js";

export default class HumanPlayerController extends PlayerController {
  constructor(scene, player, keys) {
    super(scene, player);
    this.keys = keys;
  }

  update() {
    const { left, right, up, attack, special } = this.keys;

    if (left.isDown) this.player.setVelocityX(-this.player.character.speed);
    else if (right.isDown) this.player.setVelocityX(this.player.character.speed);
    else this.player.setVelocityX(0);

    if (up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(this.player.character.jump);
    }

    if (Phaser.Input.Keyboard.JustDown(attack)) {
      this.scene.handleAttack(this.player);
    }

    if (Phaser.Input.Keyboard.JustDown(special)) {
      this.scene.handleSpecialProjectile(this.player);
    }
  }
}