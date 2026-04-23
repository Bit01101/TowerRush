import { AnimationService } from "../utilities/animations/animation";
import { Container, Text } from "pixi.js";
import { i18n } from "../utilities/localize";
import { gsap } from "gsap";

type Viewport = { x: number; y: number };

export class RapidGrowth {
  container = new Container();

  bgRapid = AnimationService.animationsFromFrame("A1108_10_9x16_", 257, 273);
  rapidText = new Text({
    text: i18n.t("RAPID_GROWTH"),
    style: {
      fill: "#E57501",
      fontSize: 128,
      fontFamily: "Montserrat_ExtraBold",
    },
  });

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

    this.bgRapid.width = vp.x;
    this.bgRapid.height = vp.y;

    const maxWidth = vp.x * 0.9;

    this.rapidText.scale.set(1);

    if (this.rapidText.width > maxWidth) {
      const scale = maxWidth / this.rapidText.width;
      this.rapidText.scale.set(scale);
    }
  }

  public async showPanelRapid(
    parent: Container,
    vp: Viewport,
    timeClose: number,
  ) {
    parent.addChild(this.container);

    this.fitToScreen(vp);

    this.bgRapid.play();

    setTimeout(() => {
      if (this.container.parent)
        this.container.parent.removeChild(this.container);
    }, timeClose);

    const baseScale = this.rapidText.scale.x;

    this.rapidText.scale.set(0);

    gsap.to(this.rapidText.scale, {
      x: baseScale,
      y: baseScale,
      duration: 2,
      ease: "elastic.out",
    });
  }
}
