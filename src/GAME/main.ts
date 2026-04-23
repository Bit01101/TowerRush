import { Container, Sprite } from "pixi.js";
import { Game } from "../../plugins/Game/Game";
import { AssetsBase64 } from "../../plugins/Assets/AssetsBase64";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import { AnimationService } from "../utilities/animations/animation";
import { Resizer } from "../../plugins/Game/Resizer";
import { UI } from "../../plugins/Game/UI";

import { UIScreen } from "../components/uiScreen";
import { House } from "../components/house";
import { WinPanel } from "../components/winPanel";
import { ButtonController } from "../components/buttonController";
import { sound } from "@pixi/sound";
import { Zoom } from "../utilities/zoom/zoom";

export async function Main(game: Game) {
  await AssetsBase64.loadAll();

  if (!sound.exists("desert_winds"))
    sound.add("desert_winds", "assets/Audio/desert_winds.mp3");

  // localize.setLang(LANGUAGE);

  sound.play("desert_winds", {
    loop: true,
    volume: 1,
  });

  const root = new Container();
  const ui = new UI(game);

  game.app.stage.addChild(root, ui.container);

  const design = game.config.designSize;

  const resizer = new Resizer(game.app, design);
  resizer.stopProcess();
  resizer.resize();

  const adaptive = {
    x: resizer.realWidth,
    y: resizer.realHeight,
  };

  const worldContainer = new Container();
  const bgLayer = new Container();

  worldContainer.addChild(bgLayer);
  root.addChild(worldContainer);

  worldContainer.position.set(0);
  bgLayer.position.set(0);

  const isPortrait = adaptive.x / adaptive.y <= 0.7;

  const percent = adaptive.y * 0.2;
  const offset = adaptive.y - percent;
  const groundY = offset;

  const bg = AnimationService.animationsFromFrame("BG_", 0, 65);

  bg.animationSpeed = 0.5;
  bg.loop = false;

  if (isPortrait) {
    const ratio = bg.texture.width / bg.texture.height;

    bg.height = adaptive.y;
    bg.width = adaptive.y * ratio;

    bg.anchor.set(0.5, 1);
    bg.position.set(adaptive.x / 2, adaptive.y);
  } else {
    const ratio = bg.texture.height / bg.texture.width;

    bg.width = adaptive.x;
    bg.height = adaptive.x * ratio;

    bg.anchor.set(0, 1);
    bg.position.y = offset;
  }

  const bgFront = AnimationService.animationsFromFrame("BG2_", 0, 65);

  bgFront.animationSpeed = 0.3;
  bgFront.loop = false;
  bgFront.width = adaptive.x;
  bgFront.anchor.set(0, 1);
  bgFront.position.y = offset;
  bgFront.zIndex = 2;

  if (isPortrait) {
    const ratioBgFront = bgFront.texture.height / bgFront.texture.width;
    bgFront.height = adaptive.x * ratioBgFront;
  }

  bgLayer.addChild(bg, bgFront);

  const cloud_0 = Sprite.from(AssetsDB.texture.cloud_00000);
  const cloud_1 = Sprite.from(AssetsDB.texture.cloud_00000);
  const cloud_2 = Sprite.from(AssetsDB.texture.cloud_00000);

  cloud_0.y = adaptive.y * 0.2;
  cloud_1.y = adaptive.y * 0.3;
  cloud_2.y = adaptive.y * 0.15;

  cloud_0.x = 0;
  cloud_1.x = adaptive.x * 0.4;
  cloud_2.x = adaptive.x * 0.8;

  cloud_0.alpha = 0.6;
  cloud_1.alpha = 0.5;
  cloud_2.alpha = 0.4;

  bgLayer.addChild(cloud_0, cloud_1, cloud_2);

  function moveCloud(cloud: Sprite, speed: number, width: number) {
    cloud.x += speed;

    if (cloud.x > width + 200) cloud.x = -200;
  }

  const sun = Sprite.from(AssetsDB.texture.glow_00000);
  sun.anchor.set(0.5);
  sun.scale.set(0.8);
  sun.position.set(adaptive.x / 2, adaptive.y / 1.75);

  bgLayer.addChild(sun);

  game.app.ticker.add((t) => {
    sun.rotation += 0.005 * t.deltaTime;

    const speed = 0.3 * t.deltaTime;

    moveCloud(cloud_0, speed, adaptive.x);
    moveCloud(cloud_1, speed * 0.6, adaptive.x);
    moveCloud(cloud_2, speed * 0.4, adaptive.x);
  });

  const uiScreen = new UIScreen(ui, adaptive, percent);
  const house = new House(bgLayer, adaptive, groundY);
  const winPanel = new WinPanel(ui, adaptive, uiScreen);
  console.log({
    design,
    adaptive,
  });
  const zoom = new Zoom(bgLayer, house, adaptive.y, adaptive);

  house.createHouse();
  const { buttonCashOut, buttonFeed } = uiScreen.createButtons();

  const controller = new ButtonController({
    ui: uiScreen,
    house,
    winPanel,
    adaptive,
    bg,
    bgFront,
    worldContainer,
    zoom,
  });

  controller.bind(buttonFeed, buttonCashOut);
}
