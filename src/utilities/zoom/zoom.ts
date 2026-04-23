import { Container } from "pixi.js";
import gsap from "gsap";
import { House } from "../../components/house";
import { UIScreen } from "../../components/uiScreen";

export class Zoom {
  private targetY = 0;
  private container: Container;

  constructor(
    private world: Container,
    private house: House,
    private screenHeight: number,
    private vp: { x: number; y: number },
  ) {
    this.container = world;
  }

  public followHouse() {
    const topY = this.house.getHouseHeight() - this.screenHeight * 0.3;

    const bgHeight = this.world.height;
    const minY = -(bgHeight - this.screenHeight) - this.screenHeight * 1;
    const maxY =
      UIScreen.getOrientation(this.vp) === "landscape"
        ? this.screenHeight
        : 100; // верх сцены

    const targetY = this.clamp(topY, minY, maxY);

    gsap.killTweensOf(this.world);

    gsap.to(this.world, {
      y: targetY,
      duration: 0.5,
    });
  }
  private clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
  public snapToFloor(index: number) {
    const floors = this.house.getHouseFloor();
    const floor = floors[index];
    if (!floor) return;

    const y = this.screenHeight / 2 - floor.height * index;

    gsap.to(this.container, {
      y,
      duration: 0.6,
      ease: "power2.out",
    });
  }
}
