import PlayerController from "./PlayerController.js";

export default class HumanPlayerController extends PlayerController {
  constructor(scene, player, keys) {
    super(scene, player);
    this.keys = keys;
  }

  cancelBlock() {
    this.player.blocking = false;
    this.player.blockCooldown = true;

    if (this.player.blockTimer) {
      this.player.blockTimer.remove();
      this.player.blockTimer = null;
    }

    this.scene.time.delayedCall(this.scene.blockCooldownTime, () => {
      this.player.blockCooldown = false;
    });

    this.scene.tintEffect(this.player, 0x33dbbb, 100);
  }

  update() {
    const { left, right, up, block, attack, special } = this.keys;

    if (block.isDown && !this.player.blockCooldown) {
      if (!this.player.blocking) {
        this.player.blocking = true;

        this.player.blockTimer = this.scene.time.delayedCall(
          this.scene.blockMaxDuration,
          () => {
            this.cancelBlock();
          }
        );
      }
    } else if (this.player.blocking) {
      this.cancelBlock();
    }

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