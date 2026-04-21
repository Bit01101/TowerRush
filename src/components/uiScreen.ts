import { AnimatedSprite, Container, HTMLText, Sprite } from "pixi.js";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import gsap from "gsap";
import { RapidGrowth } from "./rapidGrowth";
import { AnimationService } from "../utilities/animations/animation";
import { UI, WidgetRoot } from "../../plugins/Game/UI";

type Viewport = { x: number; y: number };
type CursorMode = "feed" | "cash" | "win" | null;

export class UIScreen {
  ui: UI;
  navHeight = 200;
  buttonsContainer = new Container();
  private scoreText!: HTMLText;
  private rapid!: RapidGrowth;
  private rapidShown = false;
  private activeCursorMode: CursorMode = null;

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
  ) {
    this.ui = ui;

    this.rapid = new RapidGrowth();

    this.createNav(pos);
    this.createLogo();
    this.createModeText();
    this.createButtonContainer();
  }

  private createNav(pos: { x: number; y: number }) {
    const nav = Sprite.from(AssetsDB.texture.UI_bcgr_00000);

    this.ui.add(nav, WidgetRoot.BOTTOM);

    nav.anchor.set(0.5);

    nav.width = pos.x;
    nav.height = this.navHeight;
  }

  private createLogo() {
    const logo = Sprite.from(AssetsDB.texture.logo_00379_00303);

    logo.anchor.set(0.5);
    logo.scale.set(0.35);

    this.ui.add(logo, WidgetRoot.TOP_RIGHT, { x: -5, y: 5 });
    console.log(logo.getBounds());
    console.log(logo.position);
  }

  private createModeText() {
    this.currentMode = Sprite.from(
      this.resultMultiply[this.borderList.length]?.mode ?? "MULTIPLIER_00110",
    );
    this.currentMode.anchor.set(0.5);
    this.ui.add(this.currentMode, WidgetRoot.RIGHT, {
      x: 0,
      y: this.pos.y / 3 - this.pos.y / 2,
    });
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
    this.ui.add(containerScore, WidgetRoot.RIGHT);

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
      this.rapid.showPanelRapid(this.ui.container, this.pos, 2500);
      this.rapidShown = true;
    }

    this.currentMode.texture = Sprite.from(AssetsDB.texture[mode]).texture;
  }

  private createButtonContainer() {
    this.ui.add(this.buttonsContainer, WidgetRoot.BOTTOM, {
      x: 0,
      y: this.navHeight / 4,
    });
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

  private showCursor(target: Container, mode: CursorMode) {
    if (this.cursor.parent) {
      this.cursor.stop();
      this.cursor.parent.removeChild(this.cursor);
    }

    this.activeCursorMode = mode;

    target.addChild(this.cursor);

    this.cursor.scale.set(0.5);
    this.cursor.anchor.set(0, 0);
    this.cursor.position.set(this.cursor.width / 2, 0);

    this.cursor.play();
  }
  private hideCursor() {
    if (this.cursor.parent) {
      this.cursor.stop();
      this.cursor.parent.removeChild(this.cursor);
    }
    this.activeCursorMode = null;
  }

  public cursorFeedShow(button: Container) {
    this.showCursor(button, "feed");
  }

  public cursorCashOutShow(button: Container) {
    this.showCursor(button, "cash");
  }

  public cursorWinShow(panel: Container) {
    this.showCursor(panel, "win");
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
}
