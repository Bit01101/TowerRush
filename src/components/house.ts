import { Container, Sprite } from "pixi.js";
import { TypeFloor } from "../type/typeFloor";
import { TypeTree } from "../type/typeTree";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import { IFloorData } from "../interfase/iFloorData";
import gsap from "gsap";
import { sound } from "@pixi/sound";

export class House {
  currentHeight = 0;
  lastFloorContainer: Container | null = null;
  lastSpriteTree: Sprite | null = null;
  isBuilding = false;
  houseFloor: IFloorData[] = [];
  houseContainer = new Container();
  ratio = 1;

  FLOOR_CONFIG: Record<
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

  FLOOR_ORDER: TypeFloor[] = [
    "basis_tower_00000_00000",
    "Home1_00000_00000",
    "Home2_00000_00169",
    "Home3_00000_00645",
    "house_4_00224",
    "house_500000",
    "house_6_00000",
  ];

  constructor(
    private parent: Container,
    pos: { x: number; y: number },
    private groundY: number,
  ) {
    this.parent.addChild(this.houseContainer);

    this.houseContainer.zIndex = 1;

    this.houseContainer.x = pos.x / 2;

    this.houseContainer.y = this.groundY + this.groundY;
  }

  public createHouse(): number {
    const type = this.getNextType();
    if (this.isBuilding) return 0;
    this.isBuilding = true;

    const floorContainer = new Container();
    const floor = Sprite.from(AssetsDB.texture[type]);
    const config = this.FLOOR_CONFIG[type];

    floor.anchor.set(0.5, 1);

    const scale =
      1 -
      this.houseFloor.length *
        config.scaleLoss *
        (this.houseFloor.length === 7 ? 0.8 : 1) -
      0.1;

    floor.scale.set(scale);
    floor.scale.y = 0;

    floor.position.set(0, 0);

    floorContainer.position.set(0, -this.currentHeight);
    floorContainer.addChild(floor);

    if (this.lastSpriteTree && this.lastFloorContainer)
      this.lastFloorContainer.removeChild(this.lastSpriteTree);

    let tree: Sprite | null = null;

    if (config.tree) {
      tree = Sprite.from(config.tree);

      this.lastSpriteTree = tree;
      this.lastFloorContainer = floorContainer;

      let offsetY = 0;

      tree.anchor.set(0.5, 1);

      if (type === "Home3_00000_00645") offsetY = 30;
      else if (type === "house_6_00000") offsetY = -15;

      tree.position.set(0, offsetY);

      tree.scale.set(scale);
      tree.scale.y = 0;

      floorContainer.addChild(tree);
    }

    this.houseContainer.addChild(floorContainer);

    const realHeight = floor.texture.orig.height * scale;

    gsap.to(floor.scale, {
      y: scale,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        this.isBuilding = false;
      },
    });
    const tl = gsap.timeline({
      onComplete: () => {
        this.isBuilding = false;
      },
    });

    tl.to(floor.scale, {
      y: scale,
      duration: 1,
      ease: "power2.out",
    });

    if (tree) {
      tl.to(
        tree.scale,
        {
          y: scale,
          duration: 1,
          ease: "power2.out",
        },
        "<",
      );
    }
    this.currentHeight += realHeight;
    this.currentHeight -=
      realHeight * config.offsetY * (this.houseFloor.length > 5 ? 1.028 : 1);

    this.houseFloor.push({
      id: this.houseFloor.length,
      height: realHeight,
      width: floor.width,
      type,
    });
    return realHeight;
  }

  public getTopGlobalY(): number {
    return this.houseContainer.toGlobal({
      x: 0,
      y: -this.currentHeight,
    }).y;
  }

  public getHouseHeight(): number {
    return this.currentHeight;
  }

  public getNextType(): TypeFloor {
    return this.FLOOR_ORDER[this.houseFloor.length] ?? "house_500000";
  }

  public getHouseContainer(): Container {
    return this.houseContainer;
  }
  public getIsBuildingStatus(): boolean {
    return this.isBuilding;
  }
  public getHouseFloor(): IFloorData[] {
    return this.houseFloor;
  }
  public getTopY(): number {
    return this.houseContainer.y - this.currentHeight;
  }
  public getSoundBuild() {
    sound.play(AssetsDB.audio.Soft_Slide_02___Short_02);
  }
}
