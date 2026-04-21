import { AnimatedSprite, Container, Graphics, Sprite } from "pixi.js";
import { UI } from "../../plugins/Game/UI";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import { AnimationService } from "../utilities/animations/animation";
import gsap from "gsap";
import { UIScreen } from "./uiScreen";

export class WinPanel {
  winPanel = new Container();
  constructor(
    private ui: UI,
    private vp: { x: number; y: number },
    private uiScreen: UIScreen,
  ) {
    this.winPanel.scale = 0.2;
  }

  createWinPanel() {
    const animPart: AnimatedSprite = AnimationService.animationsFromFrame(
      "big_win_all_00000_",
      0,
      119,
    );

    gsap.to(this.winPanel, {
      scale: 1,
      duration: 2,
      ease: "elastic.out",
    });
    this.uiScreen.cursorWinPanel(this.winPanel);

    const spriteBG = Sprite.from(AssetsDB.texture.Big_win_Plach_00000);
    const spriteCity = Sprite.from(
      AssetsDB.texture.big_win_home_00000_00000_00033,
    );
    const textYouWin = Sprite.from(AssetsDB.texture.You_win_00000);
    const textScoreWin = Sprite.from(AssetsDB.texture.EURO_00085);

    const buttonCollectWin = Sprite.from(
      AssetsDB.texture.COLLECT_WIN_All_00036_00085_00000,
    );

    const overlay = this.createDarkOverlay(this.vp);

    this.ui.add(overlay);
    this.ui.add(this.winPanel);

    spriteBG.scale.set(1.5);
    textYouWin.scale.set(0.8);
    // textScoreWin.scale.set(0.8);

    animPart.anchor.set(0.5);
    spriteBG.anchor.set(0.5);
    spriteCity.anchor.set(0.5);
    textYouWin.anchor.set(0.5);
    textScoreWin.anchor.set(0.5);

    buttonCollectWin.anchor.set(0.5);

    animPart.play();
    animPart.animationSpeed = 0.5;

    animPart.position.y = -spriteBG.height / 3;
    spriteCity.position.y = -spriteBG.height / 3;
    textScoreWin.position.y = textYouWin.height;
    buttonCollectWin.position.y = this.vp.y / 2 - buttonCollectWin.height / 2;

    this.winPanel.addChild(
      animPart,
      spriteBG,
      spriteCity,
      textYouWin,
      textScoreWin,
      buttonCollectWin,
    );
  }

  createDarkOverlay(vp: { x: number; y: number }) {
    const overlay = new Graphics();

    overlay.clear();
    overlay.beginFill(0x000000, 0.8);
    overlay.drawRect(-vp.x / 2, -vp.y / 2, vp.x, vp.y);
    overlay.endFill();

    overlay.eventMode = "static"; // чтобы ловить клики
    overlay.cursor = "auto";

    return overlay;
  }
}
