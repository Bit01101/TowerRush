import { Game } from "../../plugins/Game/Game.ts";
import sdk from "@smoud/playable-sdk";
import { AssetsBase64 } from "../../plugins/Assets/AssetsBase64.ts";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB.ts";
import { AnimatedSprite, Container, Sprite, Texture } from "pixi.js";
import { OnClick } from "../../plugins/Utils/UIEvents.ts";
import { AnimPulseIn, Play } from "../../plugins/Utils/Animations.ts";
import gsap from "gsap";

export async function Main(game: Game) {
  type TypeFloor =
    | "basis_tower_00000_00000"
    | "Home1_00000_00000"
    | "Home2_00000_00169"
    | "Home3_00000_00645"
    | "house_4_00224"
    | "house_500000"
    | "house_6_00000";

  type TypeTree = "Tree1_00000" | "Tree2_00000";

  const FLOOR_CONFIG: Record<
    TypeFloor,
    { offsetY: number; scaleLoss: number; tree: TypeTree | null }
  > = {
    basis_tower_00000_00000: { offsetY: 0.25, scaleLoss: 0.15, tree: null },
    Home1_00000_00000: { offsetY: 0.4, scaleLoss: 0.15, tree: null },
    Home2_00000_00169: { offsetY: 0.475, scaleLoss: 0.15, tree: "Tree1_00000" },
    Home3_00000_00645: {
      offsetY: 0.525,
      scaleLoss: 0.085,
      tree: "Tree1_00000",
    },
    house_4_00224: { offsetY: 0.595, scaleLoss: 0.12, tree: "Tree2_00000" },
    house_500000: { offsetY: 0.626, scaleLoss: 0.11, tree: "Tree2_00000" },
    house_6_00000: { offsetY: 0.626, scaleLoss: 0.1, tree: "Tree2_00000" },
  };

  const FLOOR_ORDER: TypeFloor[] = [
    "basis_tower_00000_00000",
    "Home1_00000_00000",
    "Home2_00000_00169",
    "Home3_00000_00645",
    "house_4_00224",
    "house_500000",
    "house_6_00000",
  ];

  interface IFloorData {
    id: number;
    height: number;
    width: number;
    type: TypeFloor;
  }

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
  let isBuilding = false;

  const houseFloor: IFloorData[] = [];

  type TextureKey = keyof typeof AssetsDB.texture;

  // bg
  const framesBG: Texture[] = [];

  for (let i = 0; i <= 65; i++) {
    const key = `BG_${i.toString().padStart(5, "0")}` as TextureKey;
    const id = AssetsDB.texture[key];
    if (!id) continue;
    framesBG.push(Texture.from(id));
  }

  const bg = new AnimatedSprite(framesBG);
  bg.animationSpeed = 0.5;
  bg.loop = false;

  bg.position.set(0, 0);
  bg.width = design.x;
  bg.height = design.y - 200;
  bgLayer.addChild(bg);

  // bg front
  const framesBGFront: Texture[] = [];

  for (let i = 0; i <= 65; i++) {
    const key = `BG2_${i.toString().padStart(5, "0")}` as TextureKey;
    const id = AssetsDB.texture[key];
    if (!id) continue;
    framesBGFront.push(Texture.from(id));
  }

  const bgFront = new AnimatedSprite(framesBGFront);
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
  const houseContainer = new Container();
  bgLayer.addChild(houseContainer);
  houseContainer.zIndex = 1;
  houseContainer.position.set(design.x / 2, design.y * 1.11);

  let currentHeight = 0;
  let lastFloorContainer: Container | null = null;
  let lastSpriteTree: Sprite | null = null;

  function createHouse(type: TypeFloor) {
    if (isBuilding) return;
    isBuilding = true;

    const floorContainer = new Container(); // 👈 ОБЩИЙ контейнер
    const floor = Sprite.from(AssetsDB.texture[type]);
    const config = FLOOR_CONFIG[type];

    floor.anchor.set(0.5, 1);

    const scale =
      1 -
      houseFloor.length *
        config.scaleLoss *
        (houseFloor.length === 7 ? 0.8 : 1) -
      0.2;

    floor.scale.set(scale);
    floor.height = 0;

    floor.position.set(0, 0);

    floorContainer.position.set(0, -currentHeight);
    floorContainer.addChild(floor);

    if (lastSpriteTree && lastFloorContainer) {
      lastFloorContainer.removeChild(lastSpriteTree);
      console.log("LastSprite есть");
    }

    if (config.tree) {
      const tree = Sprite.from(config.tree);

      lastSpriteTree = tree;
      lastFloorContainer = floorContainer;

      let offsetY = 0;

      tree.anchor.set(0.5, 1);
      tree.scale.set(scale);

      if (type === "Home3_00000_00645") {
        offsetY = 10;
        tree.scale.set(scale * 0.9);
      } else if (type === "house_4_00224") offsetY = -5;

      tree.position.set(0, offsetY);
      tree.height = 0;

      floorContainer.addChild(tree);

      gsap.to(tree, {
        height: floor.texture.orig.height * scale,
        duration: 1,
        ease: "power2.inOut",
      });
    }

    houseContainer.addChild(floorContainer);

    const realHeight = floor.texture.orig.height * scale;

    gsap.to(floor, {
      height: realHeight,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        isBuilding = false;
      },
    });

    currentHeight += realHeight;
    currentHeight -=
      realHeight * config.offsetY * (houseFloor.length > 5 ? 1.028 : 1);

    houseFloor.push({
      id: houseFloor.length,
      height: realHeight,
      width: floor.width,
      type,
    });
  }

  function getNextType(): TypeFloor {
    return FLOOR_ORDER[houseFloor.length] ?? "house_500000";
  }

  // Первый этаж
  createHouse(getNextType());

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
