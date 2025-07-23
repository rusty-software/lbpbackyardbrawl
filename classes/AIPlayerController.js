import PlayerController from "./PlayerController.js";

export default class AIPlayerController extends PlayerController {
  constructor(scene, player, target) {
    super(scene, player);
    this.target = target;
  }

  update() {
    const ai = this.player;
    const opponent = this.target;

    if (ai.x < opponent.x - 20) ai.setVelocityX(ai.character.speed);
    else if (ai.x > opponent.x + 20) ai.setVelocityX(-ai.character.speed);
    else ai.setVelocityX(0);

    if (Phaser.Math.Between(0, 100) < 1 && ai.body.blocked.down) {
      ai.setVelocityY(ai.character.jump);
    }

    if (Math.abs(ai.x - opponent.x) < 50 && this.scene.time.now > (ai.nextAttack || 0)) {
      this.scene.handleAttack(ai);
      ai.nextAttack = this.scene.time.now + (ai.character.cooldown || 800);
    }

    if (ai.canUseSpecial && Phaser.Math.Between(0, 1000) < 4) {
      this.scene.handleSpecialProjectile(ai);
    }
  }
}