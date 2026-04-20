import { AnimationService } from "../utilities/animations/animation";
import { Container } from "pixi.js";

type Viewport = { x: number; y: number };

export class RapidGrowth {
  container = new Container();

  bgRapid = AnimationService.animationsFromFrame("A1108_10_9x16_", 257, 273);
  rapidText = AnimationService.animationsFromFrame("RAPID_GROWTH_", 0, 40);

  constructor() {
    this.container.addChild(this.bgRapid);
    this.container.addChild(this.rapidText);

    this.container.zIndex = 999;
  }

  private fitToScreen(vp: Viewport) {
    const centerX = vp.x / 2;
    const centerY = vp.y / 2;

    this.bgRapid.anchor.set(0.5);
    this.rapidText.anchor.set(0.5);

    this.bgRapid.position.set(centerX, centerY);
    this.rapidText.position.set(centerX, centerY);

    const scaleX = vp.x / this.bgRapid.width;
    const scaleY = vp.y / this.bgRapid.height;

    const scale = Math.max(scaleX, scaleY);

    this.bgRapid.scale.set(scale);

    this.rapidText.scale.set(Math.min(scale, 1));
  }

  public async showPanelRapid(
    parent: Container,
    vp: Viewport,
    timeClose: number,
  ) {
    parent.addChild(this.container);

    this.fitToScreen(vp);

    this.bgRapid.play();
    this.rapidText.play();
    this.rapidText.loop = false;

    setTimeout(() => {
      if (this.container.parent)
        this.container.parent.removeChild(this.container);
    }, timeClose);
  }
}
