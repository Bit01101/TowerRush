import { AnimatedSprite, Container } from "pixi.js";
import gsap from "gsap";
import { OnClick } from "../../plugins/Utils/UIEvents";
import { AnimPulseIn, Play } from "../../plugins/Utils/Animations";
import { UIScreen } from "../components/uiScreen";
import { House } from "../components/house";
import { WinPanel } from "../components/winPanel";
import { sound } from "@pixi/sound";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import { Zoom } from "../utilities/zoom/zoom";

type ButtonControllerDeps = {
  ui: UIScreen;
  house: House;
  winPanel: WinPanel;
  adaptive: { x: number; y: number };
  bg: AnimatedSprite;
  bgFront: AnimatedSprite;
  worldContainer: Container;
  zoom: Zoom;
};

export class ButtonController {
  private isFirstClick = true;
  private isFeedLocked = false;
  private isCashLocked = false;
  private isGameFinished = false;
  private bgPlayed = false;

  private score = 40;

  constructor(private deps: ButtonControllerDeps) {}

  bind(buttonFeed: Container, buttonCashOut: Container) {
    this.bindFeed(buttonFeed, buttonCashOut);
    this.bindCash(buttonCashOut);
  }

  private playBgIntro() {
    if (this.bgPlayed) return;
    this.bgPlayed = true;

    this.deps.bg.play();
    this.deps.bgFront.play();
  }

  private bindFeed(buttonFeed: Container, buttonCashOut: Container) {
    OnClick(buttonFeed, () => {
      this.getButtonClickSound();
      if (
        this.isFeedLocked ||
        this.isGameFinished ||
        this.deps.house.getIsBuildingStatus()
      )
        return;

      this.isFeedLocked = true;

      this.playBgIntro();

      const floors = this.deps.house.getHouseFloor().length;
      const isDoubleBuild = floors === 5;

      Play(AnimPulseIn(buttonFeed, 0.9, 0.5));

      setTimeout(() => {
        gsap.to(this.deps.house.getHouseContainer(), {
          y: this.deps.adaptive.y * 0.84,
          duration: 1,
          ease: "power2.out",
          onComplete: () => {
            this.isFeedLocked = false;

            if (this.isGameFinished) return;

            if (this.deps.house.getHouseFloor().length < 8)
              this.deps.ui.cursorFeedShow(buttonFeed);
            else this.deps.ui.cursorCashOutShow(buttonCashOut);
          },
        });
      }, 500);

      if (this.deps.house.getHouseFloor().length <= 7) {
        this.deps.house.getSoundBuild();
        this.deps.ui.cursorFeedDisable();
        const newScore = this.deps.ui.createPersentScorePanel(
          this.deps.adaptive,
          this.score,
        );

        this.score = newScore;

        this.deps.ui.setScore(this.score);

        this.getSoundScore();
        if (!this.isFirstClick) {
          this.deps.house.createHouse();
          setInterval(() => {
            if (UIScreen.getOrientation(this.deps.adaptive) === "portrait")
              return;
            this.deps.zoom.followHouse();
          }, 500);

          if (isDoubleBuild)
            setTimeout(() => this.deps.house.createHouse(), 1000);
        }
      }

      this.isFirstClick = false;
    });
  }

  private bindCash(buttonCashOut: Container) {
    OnClick(buttonCashOut, () => {
      if (this.isCashLocked) return;
      if (this.deps.house.getHouseFloor().length < 8) return;

      this.isGameFinished = true;

      this.deps.ui.cursorCashOutDisable();

      this.isCashLocked = true;

      this.deps.winPanel.createWinPanel();
      Play(AnimPulseIn(buttonCashOut, 0.9, 0.5));
    });
  }
  private getButtonClickSound() {
    sound.play(AssetsDB.audio.CLICK);
  }
  public getSoundScore() {
    sound.play(AssetsDB.audio.buy_coins_game);
  }
  public getSoundtCashOut() {
    sound.play(AssetsDB.audio.common_win_bet);
  }
  public getScore() {
    return this.score;
  }
}
