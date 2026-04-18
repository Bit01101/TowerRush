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

export async function Main(game: Game) {
  await AssetsBase64.loadAll();

  const root = new Container();
  game.app.stage.addChild(root);

  const worldContainer = new Container();
  const bgLayer = new Container();
  const uiLayer = new Container();

  root.addChild(worldContainer, uiLayer);
  worldContainer.addChild(bgLayer);

  const design = game.config.designSize;

  let isFirstClick = true;

  // bg
  const bg = AnimationService.animationsFromFrame("BG_", 65);
  bg.animationSpeed = 0.5;
  bg.loop = false;

  bg.position.set(0, 0);
  bg.width = design.x;
  bg.height = design.y - 200;
  bgLayer.addChild(bg);

  // bg front
  const bgFront = AnimationService.animationsFromFrame("BG2_", 65);
  bgFront.animationSpeed = 0.3;
  bgFront.loop = false;

  bgFront.position.set(0, 0);
  bgFront.width = design.x;
  bgFront.height = design.y - 200;
  bgFront.zIndex = 2;

  bgLayer.addChild(bgFront);

  // ui
  const navHeight = 200;

  const nav = Sprite.from(AssetsDB.texture.UI_bcgr_00000);
  uiLayer.addChild(nav);

  nav.width = design.x;
  nav.height = navHeight;
  nav.anchor.set(0.5);
  nav.position.set(design.x / 2, design.y - navHeight / 2);

  const sun = Sprite.from(AssetsDB.texture.glow_00000);
  bgLayer.addChild(sun);
  sun.anchor.set(0.5);
  sun.scale.set(0.8);
  sun.position.set(design.x / 2, design.y / 1.75);

  game.app.ticker.add((ticker) => {
    sun.rotation += 0.005 * ticker.deltaTime;
  });

  const logo = Sprite.from(AssetsDB.texture.logo_00379_00303);
  uiLayer.addChild(logo);
  logo.anchor.set(1, 0);
  logo.scale.set(0.35);
  logo.position.set(design.x, 0);

  const multiplierText = Sprite.from(AssetsDB.texture.MULTIPLIER_00110);
  uiLayer.addChild(multiplierText);
  multiplierText.anchor.set(1, 0.5);
  multiplierText.position.set(design.x, design.y / 3);
  multiplierText.scale = 0.65;

  const buttonsContainer = new Container();
  uiLayer.addChild(buttonsContainer);
  buttonsContainer.position.set(design.x / 2, design.y - navHeight / 2);

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
  textCashOut.scale.set(scaleCash);
  bgFeed.scale.set(scaleFeed);
  textFeed.scale.set(scaleFeed);

  const buttons = [buttonCashOut, buttonFeed];
  const spacing = BUTTON_WIDTH;

  buttons.forEach((btn, i) => {
    btn.position.set((i - (buttons.length - 1) / 2) * spacing, 0);
    buttonsContainer.addChild(btn);
  });

  OnClick(buttonCashOut, Play(AnimPulseIn(buttonCashOut, 0.9, 0.5)));

  OnClick(buttonFeed, () => {
    if (isBuilding) return;

    Play(AnimPulseIn(buttonFeed, 0.9, 0.5));

    bg.play();
    bgFront.play();

    // выплывание
    setTimeout(() => {
      gsap.to(houseContainer, {
        y: design.y * 0.84,
        duration: 1,
        ease: "power2.out",
      });
    }, 500);

    // строительство только со 2-го клика
    if (!isFirstClick && houseFloor.length < 8) createHouse(getNextType());

    isFirstClick = false;
  });
}

// 0 , 1 , 2 мд , 3 мд , 4 бд , 5 . 6 бд , 5 бд
