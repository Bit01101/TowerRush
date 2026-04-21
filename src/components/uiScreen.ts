import { AnimatedSprite, Container, HTMLText, Sprite } from "pixi.js";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import gsap from "gsap";
import { RapidGrowth } from "./rapidGrowth";
import { Cover } from "../../plugins/Utils/Components/Cover";
import { AnimationService } from "../utilities/animations/animation";

type Viewport = { x: number; y: number };

export class UIScreen {
  navHeight = 200;
  uiLayer = new Container();
  buttonsContainer = new Container();
  private scoreText!: HTMLText;
  private cover: Cover;
  private rapid!: RapidGrowth;
  private rapidShown = false;

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
    parent: Container,
    private pos: Viewport,
  ) {
    parent.addChild(this.uiLayer);

    this.cover = new Cover();
    parent.addChild(this.cover);

    this.rapid = new RapidGrowth();

    this.createNav(pos);
    this.createLogo(pos);
    this.createModeText(pos);
    this.createButtonContainer(pos);

    this.uiLayer.width = parent.width;
    this.uiLayer.height = parent.height;
  }

  private createNav(pos: { x: number; y: number }) {
    const nav = Sprite.from(AssetsDB.texture.UI_bcgr_00000);

    this.uiLayer.addChild(nav);

    nav.width = pos.x;
    nav.height = 100;

    nav.anchor.set(0.5, 1);
    nav.position.set(pos.x / 2, pos.y);
  }

  private createLogo(pos: { x: number; y: number }) {
    const logo = Sprite.from(AssetsDB.texture.logo_00379_00303);
    this.uiLayer.addChild(logo);
    logo.anchor.set(1, 0);
    logo.scale.set(0.35);
    logo.position.set(pos.x, 0);
  }

  private createModeText(pos: { x: number; y: number }) {
    this.currentMode = Sprite.from(
      this.resultMultiply[this.borderList.length]?.mode ?? "MULTIPLIER_00110",
    );
    this.uiLayer.addChild(this.currentMode);
    this.currentMode.anchor.set(1, 0.5);
    this.currentMode.position.set(pos.x, pos.y / 3);
    this.currentMode.scale = 0.65;
  }

  public createPersentScorePanel(
    pos: { x: number; y: number },
    score: number,
  ): number {
    const containerScore = new Container();
    const border = Sprite.from(AssetsDB.texture.Plach_00000);
    const textScore = Sprite.from(
      this.resultMultiply[this.borderList.length].imageName,
    );
    const textScoreCenter = Sprite.from(
      this.resultMultiply[this.borderList.length].imageNameCenter,
    );

    containerScore.addChild(border);
    containerScore.addChild(textScore);
    containerScore.addChild(textScoreCenter);
    this.uiLayer.addChild(containerScore);

    border.anchor.set(0.5);
    border.position.set(0);
    border.scale.set(0.5);
    border.alpha = 0;
    gsap.to(border, {
      alpha: 100,
      duration: 100,
    });

    containerScore.position.set(pos.x - border.width / 2, pos.y / 3 + 50);

    textScore.anchor.set(0.5);
    textScore.scale.set(0.25);

    textScoreCenter.anchor.set(0.5);

    // старт: центр экрана
    const globalStart = { x: pos.x / 2, y: pos.y / 3 };
    const localStart = containerScore.toLocal(globalStart);

    textScoreCenter.position.set(localStart.x + localStart.x / 2, localStart.y);

    textScoreCenter.scale.set(0);
    textScoreCenter.rotation = 0;

    const tl = gsap.timeline();

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
    this.borderList.forEach((c, i) =>
      gsap.to(c, {
        x: pos.x - border.width / 2,
        y: pos.y / 3 + (i + 1) * 50,
        onComplete: () => this.updateMode(),
      }),
    );

    const index = this.borderList.length - 1;
    const degree = this.resultMultiply[index]?.degree ?? 1;

    return score * degree;
  }

  private updateMode() {
    const index = this.borderList.length - 1;
    const config = this.resultMultiply[index];

    if (!config) return;

    const mode = config.mode;

    if (mode === "VOID_MODE_00280" && !this.rapidShown) {
      this.rapid.showPanelRapid(this.uiLayer, this.pos, 2500);
      this.rapidShown = true;
    }

    this.currentMode.texture = Sprite.from(AssetsDB.texture[mode]).texture;
  }

  private createButtonContainer(pos: { x: number; y: number }) {
    this.uiLayer.addChild(this.buttonsContainer);
    this.buttonsContainer.position.set(
      pos.x / 2,
      pos.y - this.getNavHeight() / 2,
    );
  }

  public createButtons() {
    const navWidth = this.pos.x;
    const targetWidth = navWidth * 0.2;

    const buttonCashOut = new Container();
    const bgCashOut = Sprite.from(
      AssetsDB.texture.CASH_OUT_button_00000_00000_00000,
    );
    const textCashOut = Sprite.from(AssetsDB.texture.CASH_OUT_00000_00000);

    bgCashOut.anchor.set(0.5);
    textCashOut.anchor.set(0.5);
    textCashOut.scale.set(0.75);
    textCashOut.position.y = bgCashOut.height * -0.1;

    buttonCashOut.addChild(bgCashOut, textCashOut);

    this.createCashText(bgCashOut, bgCashOut.height * 0.1);

    const buttonFeed = new Container();
    const bgFeed = Sprite.from(AssetsDB.texture.Goo_button_00000_00000_00000);
    const textFeed = Sprite.from(AssetsDB.texture.Go_00000_00000_00000);

    bgFeed.anchor.set(0.5);
    textFeed.anchor.set(0.5);

    buttonFeed.addChild(bgFeed, textFeed);

    const scaleCash = targetWidth / bgCashOut.texture.orig.width;
    const scaleFeed = targetWidth / bgFeed.texture.orig.width;

    buttonCashOut.scale.set(Math.min(1, scaleCash));
    buttonFeed.scale.set(Math.min(1, scaleFeed));

    const spacing = navWidth * 0.25;

    buttonCashOut.position.set(-spacing / 2, 0);
    buttonFeed.position.set(spacing / 2, 0);

    this.buttonsContainer.addChild(buttonCashOut, buttonFeed);

    return { buttonCashOut, buttonFeed };
  }

  public getButtonContainer() {
    return this.buttonsContainer;
  }

  public getNavHeight() {
    return this.navHeight;
  }

  setScore(v: number) {
    this.scoreText.text = `${v} EUR`;
  }

  createCashText(parent: Container, offset: number) {
    this.scoreText = new HTMLText({
      text: "40.00 EUR",
      style: {
        fill: "#fff",
        fontSize: 48,
      },
    });

    this.scoreText.anchor.set(0.5);
    this.scoreText.position.set(0, offset);

    parent.addChild(this.scoreText);
  }

  animateScore(from: number, to: number) {
    const obj = { value: from };

    gsap.to(obj, {
      value: Math.floor(to),
      duration: 0.6,
      ease: "power2.out",

      onUpdate: () => {
        this.scoreText.text = `${this.formatNumber(obj.value)} EUR`;
      },
    });
  }

  formatNumber(value: number) {
    return value.toLocaleString("fr-FR").replace(",", ".");
  }

  public cursorTutorialForFeedButtonShow(buttonFeed: Container) {
    if (!this.cursor.parent) buttonFeed.addChild(this.cursor);
    this.cursor.scale.set(0.5);
    this.cursor.anchor.set(0, 0);
    this.cursor.position.set(this.cursor.width / 2, 0);
    this.cursor.play();
  }

  public cursorTutorialForOutCashButtonShow(buttonCashOut: Container) {
    if (!this.cursor.parent) buttonCashOut.addChild(this.cursor);
    this.cursor.scale.set(0.5);
    this.cursor.anchor.set(0, 0);
    this.cursor.position.set(this.cursor.width / 2, 0);
    this.cursor.play();
  }

  public cursorTutorialDisable(buttonFeed: Container) {
    if (this.cursor.parent) {
      this.cursor.stop();
      buttonFeed.removeChild(this.cursor);
    }
  }
}
