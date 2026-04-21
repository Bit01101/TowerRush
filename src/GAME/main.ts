import { Game } from "../../plugins/Game/Game.ts";
import sdk from "@smoud/playable-sdk";
import { AssetsBase64 } from "../../plugins/Assets/AssetsBase64.ts";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB.ts";
import { Container, Sprite } from "pixi.js";
import { OnClick } from "../../plugins/Utils/UIEvents.ts";
import { AnimPulseIn, Play } from "../../plugins/Utils/Animations.ts";
import gsap from "gsap";
import { AnimationService } from "../utilities/animations/animation.ts";
import { House } from "../components/house.ts";
import { UIScreen } from "../components/uiScreen.ts";

export async function Main(game: Game) {
  await AssetsBase64.loadAll();

  const design = game.config.designSize;

  const root = new Container();
  game.app.stage.addChild(root);
  const worldContainer = new Container();
  const bgLayer = new Container();

  root.addChild(worldContainer);
  worldContainer.addChild(bgLayer);

  let isFirstClick = true;

  let scoreEUR = 40.0;

  // bg
  const bg = AnimationService.animationsFromFrame("BG_", 0, 65);
  bg.animationSpeed = 0.5;
  bg.loop = false;

  bg.position.set(0, 0);
  bg.width = design.x;
  bg.height = design.y - 200;
  bgLayer.addChild(bg);

  // bg front
  const bgFront = AnimationService.animationsFromFrame("BG2_", 0, 65);
  bgFront.animationSpeed = 0.3;
  bgFront.loop = false;

  bgFront.position.set(0, 0);
  bgFront.width = design.x;
  bgFront.height = design.y - 200;
  bgFront.zIndex = 2;

  bgLayer.addChild(bgFront);

  const sun = Sprite.from(AssetsDB.texture.glow_00000);
  bgLayer.addChild(sun);
  sun.anchor.set(0.5);
  sun.scale.set(0.8);
  sun.position.set(design.x / 2, design.y / 1.75);

  game.app.ticker.add((ticker) => {
    sun.rotation += 0.005 * ticker.deltaTime;
  });

  // ui
  const uiScreen = new UIScreen(root, design);
  // Дом
  const house = new House(bgLayer, design);

  // Первый этаж
  house.createHouse();

  //Button
  const buttonCashOut = new Container();
  const bgCashOut = Sprite.from(
    AssetsDB.texture.CASH_OUT_button_00000_00000_00000,
  );
  const textCashOut = Sprite.from(AssetsDB.texture.CASH_OUT_00000_00000);
  bgCashOut.anchor.set(0.5);

  textCashOut.anchor.set(0.5);
  uiScreen.createCashText(bgCashOut, bgCashOut.height * 0.1);

  textCashOut.position.set(0, -bgCashOut.height * 0.05);

  buttonCashOut.addChild(bgCashOut, textCashOut);

  const buttonFeed = new Container();
  const bgFeed = Sprite.from(AssetsDB.texture.Goo_button_00000_00000_00000);
  const textFeed = Sprite.from(AssetsDB.texture.Go_00000_00000_00000);

  bgFeed.anchor.set(0.5);
  textFeed.anchor.set(0.5);
  buttonFeed.addChild(bgFeed, textFeed);

  const BUTTON_WIDTH = design.x * 0.45;

  const scaleCash = BUTTON_WIDTH / bgCashOut.texture.orig.width;
  const scaleFeed = BUTTON_WIDTH / bgFeed.texture.orig.width;

  bgCashOut.scale.set(scaleCash);
  textCashOut.scale.set(scaleCash / 1.5);
  bgFeed.scale.set(scaleFeed);
  textFeed.scale.set(scaleFeed);

  const buttons = [buttonCashOut, buttonFeed];
  const spacing = BUTTON_WIDTH;

  buttons.forEach((btn, i) => {
    btn.position.set((i - (buttons.length - 1) / 2) * spacing, 0);
    uiScreen.getButtonContainer().addChild(btn);
  });

  OnClick(buttonCashOut, Play(AnimPulseIn(buttonCashOut, 0.9, 0.5)));

  let clickProccess = false;

  OnClick(buttonFeed, () => {
    if (house.getIsBuildingStatus() || clickProccess) return;

    clickProccess = true;
    const floors = house.getHouseFloor().length;
    const isDoubleBuild = floors === 5;

    Play(AnimPulseIn(buttonFeed, 0.9, 0.5));

    bg.play();
    bgFront.play();

    setTimeout(() => {
      gsap.to(house.getHouseContainer(), {
        y: design.y * 0.84,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          bgLayer.scale = game.container.width;
          console.log(`game:`, game);
          clickProccess = false;
        },
      });
    }, 500);

    if (house.getHouseFloor().length > 7) return;

    const newScore = uiScreen.createPersentScorePanel(design, scoreEUR);
    uiScreen.animateScore(scoreEUR, newScore);
    scoreEUR = newScore;

    if (!isFirstClick) {
      house.createHouse();

      if (isDoubleBuild) {
        setTimeout(() => {
          house.createHouse();
        }, 1000);
      }
    }

    isFirstClick = false;
  });
}

// 0 , 1 , 2 мд , 3 мд , 4 бд , 5 . 6 бд , 5 бд
