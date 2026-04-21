// Main.ts

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

export async function Main(game: Game) {
  await AssetsBase64.loadAll();

  const design = game.config.designSize;

  const root = new Container();
  const ui = new UI(game);

  game.app.stage.addChild(root, ui.container);

  const resizer = new Resizer(game.app, design);
  resizer.stopProcess();
  resizer.resize();

  const adaptive = {
    x: resizer.realWidth,
    y: resizer.realHeight,
  };

  const worldContainer = new Container();
  const bgLayer = new Container();

  root.addChild(worldContainer);
  worldContainer.addChild(bgLayer);

  const bg = AnimationService.animationsFromFrame("BG_", 0, 65);
  const ratioBg = bg.texture.height / bg.texture.width;
  bg.animationSpeed = 0.5;
  bg.loop = false;
  bg.width = adaptive.x;
  bg.height = adaptive.x * ratioBg;
  bg.anchor.set(0, 1);
  bg.position.y = adaptive.y - 200;

  const bgFront = AnimationService.animationsFromFrame("BG2_", 0, 65);
  const ratioBgFront = bgFront.texture.height / bgFront.texture.width;
  bgFront.animationSpeed = 0.3;
  bgFront.loop = false;
  bgFront.width = adaptive.x;
  bgFront.height = adaptive.x * ratioBgFront;
  bgFront.anchor.set(0, 1);
  bgFront.position.y = adaptive.y - 200;
  bgFront.zIndex = 2;

  bgLayer.addChild(bg, bgFront);

  const sun = Sprite.from(AssetsDB.texture.glow_00000);
  sun.anchor.set(0.5);
  sun.scale.set(0.8);
  sun.position.set(adaptive.x / 2, adaptive.y / 1.75);

  bgLayer.addChild(sun);

  game.app.ticker.add((t) => {
    sun.rotation += 0.005 * t.deltaTime;
  });

  // ---------------- UI ----------------
  const uiScreen = new UIScreen(ui, adaptive);
  const house = new House(bgLayer, adaptive);
  const winPanel = new WinPanel(ui, adaptive, uiScreen);

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
  });

  controller.bind(buttonFeed, buttonCashOut);
}
