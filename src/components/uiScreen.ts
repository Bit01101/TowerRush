import { AnimatedSprite, Container, Sprite, Text } from "pixi.js";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import gsap from "gsap";
import { RapidGrowth } from "./rapidGrowth";
import { AnimationService } from "../utilities/animations/animation";
import { UI, WidgetRoot } from "../../plugins/Game/UI";
import { sound } from "@pixi/sound";
import { i18n } from "../utilities/localize";
import { AnimatedText } from "../../plugins/Utils/Components/AnimatedText";

type Viewport = { x: number; y: number };
type Orientation = "portrait" | "landscape";

export class UIScreen {
  ui: UI;
  buttonsContainer = new Container();
  private prevScore = 40;

  private scoreText!: AnimatedText;
  private rapid!: RapidGrowth;
  private rapidShown = false;
  private orientation: "portrait" | "landscape";

  borderList: Container[] = [];

  currentMode: Sprite = Sprite.from("MULTIPLIER_00110");

  cursor: AnimatedSprite = AnimationService.animationsFromFrame(
    "hand_bonus_",
    0,
    114,
  );

  resultMultiply: Record<
    number,
    {
      imageNameCenter: string;
      imageName: string;
      degree: number;
      mode: "MULTIPLIER_00110" | "VOID_MODE_00280" | "INStability_00280";
    }
  > = {
    0: {
      imageNameCenter: "x1__3_00000",
      imageName: "x1_3_00000",
      degree: 1.3,
      mode: "MULTIPLIER_00110",
    },
    1: {
      imageNameCenter: "x1__9_00000",
      imageName: "x1_9_00000",
      degree: 1.9,
      mode: "MULTIPLIER_00110",
    },
    2: {
      imageNameCenter: "x2__6_00000",
      imageName: "x2_6_00000",
      degree: 2.6,
      mode: "VOID_MODE_00280",
    },
    3: {
      imageNameCenter: "x_3_00000",
      imageName: "x3_00000",
      degree: 3,
      mode: "VOID_MODE_00280",
    },
    4: {
      imageNameCenter: "x_4_00000",
      imageName: "x4_00000",
      degree: 4,
      mode: "VOID_MODE_00280",
    },
    5: {
      imageNameCenter: "x7__2_00000",
      imageName: "x7_2_00000",
      degree: 7.2,
      mode: "INStability_00280",
    },
    6: {
      imageNameCenter: "x11__5_00000",
      imageName: "x11_5_00000",
      degree: 11.5,
      mode: "INStability_00280",
    },
  };

  constructor(
    ui: UI,
    private pos: Viewport,
    private navHeight: number,
  ) {
    this.ui = ui;
    this.rapid = new RapidGrowth();

    this.createNav(pos);
    this.createLogo();
    this.createModeText();
    this.createButtonContainer();
    this.orientation = this.getOrientation(pos);
  }

  private createNav(pos: Viewport) {
    const nav = Sprite.from(AssetsDB.texture.UI_bcgr_00000);
    this.ui.add(nav, WidgetRoot.BOTTOM);

    nav.anchor.set(0.5);
    nav.width = pos.x;
    nav.height = pos.y * 0.2;
  }

  private createLogo() {
    const logo = Sprite.from(AssetsDB.texture.logo_00379_00303);
    logo.anchor.set(0.5);
    logo.scale.set(0.35);

    this.ui.add(logo, WidgetRoot.TOP_RIGHT, { x: -5, y: 5 });
  }

  private createModeText() {
    this.currentMode = Sprite.from("MULTIPLIER_00110");
    this.currentMode.anchor.set(0.5);

    this.ui.add(this.currentMode, WidgetRoot.RIGHT, {
      x: 0,
      y: this.pos.y / 3 - this.pos.y / 2,
    });

    this.currentMode.scale.set(0.65);
  }

  public createPersentScorePanel(pos: Viewport, score: number): number {
    const containerScore = new Container();
    const border = Sprite.from(AssetsDB.texture.Plach_00000);

    const maxIndex = Object.keys(this.resultMultiply).length - 1;

    const index = Math.min(this.borderList.length, maxIndex);
    const config = this.resultMultiply[index];

    const textScore = Sprite.from(config.imageName);
    const textScoreCenter = Sprite.from(config.imageNameCenter);

    containerScore.addChild(border, textScore, textScoreCenter);
    this.ui.add(containerScore, WidgetRoot.RIGHT);

    border.anchor.set(0.5);
    border.position.set(0);
    border.scale.set(0.5);
    border.alpha = 0;

    gsap.to(border, { alpha: 1, duration: 0.2 });

    containerScore.position.set(pos.x - border.width / 2, pos.y / 3 + 50);

    textScore.anchor.set(0.5);
    textScore.scale.set(0.25);

    textScoreCenter.anchor.set(0.5);

    const globalStart = { x: pos.x / 2, y: pos.y / 3 };
    const localStart = containerScore.toLocal(globalStart);

    textScoreCenter.position.set(localStart.x + localStart.x / 2, localStart.y);

    textScoreCenter.scale.set(0);
    textScoreCenter.rotation = 0;

    const tl = gsap.timeline();
    this.getSoundShowScore();
    tl.to(textScoreCenter, {
      scale: 0.8,
      duration: 0.3,
      ease: "back.out(3)",
    });

    tl.to(
      textScoreCenter,
      {
        rotation: 0.3,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
      "<",
    );

    tl.to(textScoreCenter, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    tl.to(
      textScoreCenter.scale,
      {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => textScoreCenter.destroy(),
      },
      "<",
    );

    this.borderList.unshift(containerScore);

    this.borderList.forEach((c, i) => {
      gsap.to(c, {
        y: pos.y / 3 + (i + 1) * 50,
        duration: 0.3,
        onComplete: () => this.updateMode(),
      });
    });

    return score * config.degree;
  }

  private updateMode() {
    const index = this.borderList.length - 1;

    const config = this.resultMultiply[index];
    if (!config) return;

    if (config.mode === "VOID_MODE_00280" && !this.rapidShown) {
      this.rapid.showPanelRapid(this.ui.container, this.pos, 2500);
      this.rapidShown = true;
    }

    this.currentMode.texture = Sprite.from(
      AssetsDB.texture[config.mode],
    ).texture;
  }

  private createButtonContainer() {
    this.ui.add(this.buttonsContainer, WidgetRoot.BOTTOM);
  }

  public createButtons() {
    const buttonCashOut = new Container();
    const buttonFeed = new Container();

    const bgCashOut = Sprite.from(
      AssetsDB.texture.CASH_OUT_button_00000_00000_00000,
    );
    const bgFeed = Sprite.from(AssetsDB.texture.Goo_button_00000_00000_00000);

    const textCashOut = new Text({
      text: i18n.t("CASH_OUT"),
      style: {
        fill: "#fff",
        fontSize: 64,
        fontFamily: AssetsDB.font.Montserrat_ExtraBold,
      },
    });

    const textFeed = new Text({
      text: i18n.t("FEED"),
      style: {
        fill: "#fff",
        fontSize: 64,
        fontFamily: AssetsDB.font.Montserrat_ExtraBold,
      },
    });

    bgCashOut.anchor.set(0.5);
    textCashOut.anchor.set(0.5);
    buttonCashOut.addChild(bgCashOut, textCashOut);
    this.createCashText(bgCashOut, bgCashOut.texture.orig.height * 0.2);
    textCashOut.position.set(0, -bgCashOut.texture.orig.height * 0.2);

    bgFeed.anchor.set(0.5);
    textFeed.anchor.set(0.5);
    buttonFeed.addChild(bgFeed, textFeed);

    this.buttonsContainer.addChild(buttonFeed, buttonCashOut);

    this.layoutButtons(buttonFeed, buttonCashOut);

    return { buttonCashOut, buttonFeed };
  }

  public getButtonContainer() {
    return this.buttonsContainer;
  }

  public getNavHeight() {
    return this.navHeight;
  }

  public getScore(): AnimatedText {
    return this.scoreText;
  }

  setScore(v: number) {
    this.scoreText.setValue(this.prevScore, v);

    this.prevScore = v;
  }

  createCashText(parent: Container, offset: number) {
    this.scoreText = new AnimatedText(
      {
        style: {
          fontSize: 64,
          fill: "#fff",
        },
      },
      40, // initValue
      0.6, // animDuration
      "", // prefix
      " EUR", // postfix
      2, // roundTo
    );

    this.scoreText.position.set(0, offset);
    this.scoreText.anchor?.set?.(0.5);

    parent.addChild(this.scoreText as AnimatedText);
  }

  formatNumber(value: number) {
    return value.toLocaleString("fr-FR").replace(",", ".");
  }

  private showCursor(target: Container) {
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
  }

  private hideCursor() {
    if (this.cursor.parent) {
      this.cursor.stop();
      this.cursor.parent.removeChild(this.cursor);
    }
  }

  public cursorFeedShow(button: Container) {
    this.showCursor(button);
  }

  public cursorCashOutShow(button: Container) {
    this.showCursor(button);
  }

  public cursorWinShow(panel: Container) {
    this.showCursor(panel);
  }

  public cursorFeedDisable() {
    this.hideCursor();
  }

  public cursorCashOutDisable() {
    this.hideCursor();
  }

  public cursorWinDisable() {
    this.hideCursor();
  }
  public getSoundShowScore() {
    sound.play(AssetsDB.audio.fire_light_zjugrzn_);
  }

  private layoutButtons(buttonCashOut: Container, buttonFeed: Container) {
    const isPortrait = this.orientation === "portrait";

    if (!isPortrait) this.layoutLandscape(buttonFeed, buttonCashOut);
    else this.layoutPortrait(buttonCashOut, buttonFeed);
  }

  private layoutLandscape(a: Container, b: Container) {
    const gap = 40;

    const maxWidth = this.pos.x * 0.9;
    const totalWidth = a.width + b.width + gap;

    const scale = Math.min(1, maxWidth / totalWidth);
    const finalScale = Math.max(scale, 0.6);

    a.scale.set(finalScale);
    b.scale.set(finalScale);

    const wA = a.width;
    const wB = b.width;

    const total = wA + gap + wB;

    // центр по X
    const startX = -total / 2;

    a.x = startX + wA / 2;
    b.x = a.x + wA / 2 + gap + wB / 2;

    // ключевое: центр по Y внутри nav
    const navCenterY = 0;

    a.y = navCenterY;
    b.y = navCenterY;
  }

  private layoutPortrait(a: Container, b: Container) {
    const navHeight = this.getNavHeight();

    const padding = 20;
    const gap = 16;

    const available = navHeight - padding * 2;

    const maxHeight = (available - gap) / 2;

    const scale = Math.min(maxHeight / a.height, maxHeight / b.height, 1);

    a.scale.set(scale);
    b.scale.set(scale);

    a.x = 0;
    b.x = 0;

    const totalHeight = a.height + gap + b.height;

    const startY = -totalHeight / 2;

    a.y = startY + a.height / 2;

    b.y = a.y + a.height / 2 + gap + b.height / 2;
  }

  getOrientation(vp: { x: number; y: number }): Orientation {
    const aspect = vp.x / vp.y;

    if (aspect <= 0.7) return "portrait";
    return "landscape";
  }
}
