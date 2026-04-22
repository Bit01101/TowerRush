import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { UI } from "../../plugins/Game/UI";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import { AnimationService } from "../utilities/animations/animation";
import gsap from "gsap";
import { UIScreen } from "./uiScreen";
import { sound } from "@pixi/sound";
import { i18n } from "../utilities/localize";
import { AnimatedText } from "../../plugins/Utils/Components/AnimatedText";

export class WinPanel {
  winPanel = new Container();

  cursor: AnimatedSprite = AnimationService.animationsFromFrame(
    "hand_bonus_",
    0,
    114,
  );

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

    this.getSoundtBigWin();

    gsap.to(this.winPanel, {
      scale: 1,
      duration: 2,
      ease: "elastic.out",
    });

    const spriteBG = Sprite.from(AssetsDB.texture.Big_win_Plach_00000);
    const spriteCity = Sprite.from(
      AssetsDB.texture.big_win_home_00000_00000_00033,
    );

    const textYouWin = new Text({
      text: i18n.t("YOU_WIN"),
      style: {
        fill: "#ff0",
        fontSize: 128,
        fontFamily: AssetsDB.font.Montserrat_ExtraBold,
      },
    });

    const textScoreWin = new AnimatedText(
      {
        style: {
          fontSize: 64,
          fill: "#0f0",
          fontFamily: AssetsDB.font.Montserrat_ExtraBold,
        },
      },
      0, // initValue
      1, // animDuration
      "", // prefix
      " EUR", // postfix
      0, // roundTo
    );
    textScoreWin.setValue(0, parseFloat(this.uiScreen.getScore().text));

    const buttonCollectWin = Sprite.from(
      AssetsDB.texture.COLLECT_WIN_All_00036_00085_00000,
    );

    const overlay = this.createDarkOverlay(this.vp);

    this.ui.add(overlay);
    this.ui.add(this.winPanel);

    spriteBG.scale.set(1.5);
    textYouWin.scale.set(0.8);

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

    this.showCursor(buttonCollectWin);

    const bounds = this.winPanel.getLocalBounds();

    const scaleX = (this.vp.x * 0.7) / bounds.width;
    const scaleY = (this.vp.y * 0.7) / bounds.height;

    const scale = Math.min(scaleX, scaleY, 1);

    this.winPanel.scale.set(scale);
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

  private showCursor(target: Container) {
    this.cursor.alpha = 0;

    gsap.to(this.cursor, {
      alpha: 1,
      duration: 3,
      onComplete: () => {
        if (this.cursor.parent) {
          this.cursor.stop();
          this.cursor.parent.removeChild(this.cursor);
        }

        target.addChild(this.cursor);

        this.cursor.zIndex = 999;

        this.cursor.scale.set(0.5);
        this.cursor.anchor.set(0, 0);
        this.cursor.position.set(0, 0);
        console.log(this.cursor.getBounds());

        this.cursor.play();
      },
    });
  }

  public getSoundtBigWin() {
    sound.play(AssetsDB.audio.huge_win);
  }
}
