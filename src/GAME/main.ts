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
import { debugBounds } from "../utilities/debug/debugBounds.ts";
import { Resizer } from "../../plugins/Game/Resizer.ts";
import { Zoom } from "../utilities/zoom/zoom.ts";

export async function Main(game: Game) {
  await AssetsBase64.loadAll();

  const design = game.config.designSize;

  const root = new Container();
  game.app.stage.addChild(root);

  const resizer = new Resizer(game.app, design);

  resizer.stopProcess();
  resizer.resize();

  const adaptive = { x: resizer.realWidth, y: resizer.realHeight };

  const worldContainer = new Container();
  const bgLayer = new Container();

  root.addChild(worldContainer);
  worldContainer.addChild(bgLayer);

  let isFirstClick = true;
  let scoreEUR = 40.0;

  debugBounds(root, root);

  // bg
  const bg = AnimationService.animationsFromFrame("BG_", 0, 65);
  bg.animationSpeed = 0.5;
  bg.loop = false;

  const textureWidthBG = bg.texture.width;
  const textureHeightBG = bg.texture.height;
  const ratioBG = textureHeightBG / textureWidthBG;

  bg.width = adaptive.x;
  bg.height = adaptive.x * ratioBG;

  bg.anchor.set(0, 1);
  bg.position.set(0, adaptive.y - 200);

  bgLayer.addChild(bg);

  // bg front
  const bgFront = AnimationService.animationsFromFrame("BG2_", 0, 65);
  bgFront.animationSpeed = 0.3;
  bgFront.loop = false;

  const textureWidthBGFront = bgFront.texture.width;
  const textureHeightBGFront = bgFront.texture.height;
  const ratioBGFront = textureHeightBGFront / textureWidthBGFront;

  bgFront.position.set(0);

  bgFront.width = adaptive.x;
  bgFront.height = adaptive.y * ratioBGFront;

  bgFront.anchor.set(0, 1);
  bgFront.position.set(0, adaptive.y - 200);

  bgFront.zIndex = 2;

  bgLayer.addChild(bgFront);

  const sun = Sprite.from(AssetsDB.texture.glow_00000);
  const sunTextureWidth = sun.texture.width;
  const sunTextureHeight = sun.texture.height;

  const ratioSun = sunTextureHeight / sunTextureWidth;

  sun.width = sunTextureWidth;
  sun.height = sunTextureHeight * ratioSun;

  bgLayer.addChild(sun);
  sun.anchor.set(0.5);
  sun.scale.set(ratioSun);
  sun.position.set(adaptive.x / 2, adaptive.y / 1.75);

  game.app.ticker.add((ticker) => {
    sun.rotation += 0.005 * ticker.deltaTime;
  });

  // ui
  const uiScreen = new UIScreen(root, adaptive);
  // Дом
  const house = new House(bgLayer, adaptive);

  // Первый этаж
  house.createHouse();

  //Button
  const { buttonCashOut, buttonFeed } = uiScreen.createButtons();

  OnClick(buttonCashOut, Play(AnimPulseIn(buttonCashOut, 0.9, 0.5)));

  let clickProccess = false;

  uiScreen.cursorTutorialForFeedButtonShow(buttonFeed);

  OnClick(buttonFeed, () => {
    if (house.getIsBuildingStatus() || clickProccess) return;

    uiScreen.cursorTutorialDisable(buttonFeed);
    clickProccess = true;
    const floors = house.getHouseFloor().length;
    const isDoubleBuild = floors === 5;

    Play(AnimPulseIn(buttonFeed, 0.9, 0.5));

    bg.play();
    bgFront.play();

    setTimeout(() => {
      gsap.to(house.getHouseContainer(), {
        y: adaptive.y * 0.84,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          console.log(`game:`, game);
          clickProccess = false;
          if (house.getHouseFloor().length < 8)
            uiScreen.cursorTutorialForFeedButtonShow(buttonFeed);
          else if (house.getHouseFloor().length === 8)
            uiScreen.cursorTutorialForOutCashButtonShow(buttonCashOut);
        },
      });
    }, 500);

    if (house.getHouseFloor().length > 7) return;

    Zoom.zoom(worldContainer, house.getHouseFloor().length);

    const newScore = uiScreen.createPersentScorePanel(adaptive, scoreEUR);
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
