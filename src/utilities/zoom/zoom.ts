import { Container } from "pixi.js";
import gsap from "gsap";
import { House } from "../../components/house";

export class Zoom {
  private targetY = 0;
  private container: Container;

  constructor(
    private world: Container,
    private house: House,
    private screenHeight: number,
  ) {
    this.container = world;
  }

  public followHouse() {
    const topY = this.house.getHouseHeight() - this.screenHeight * 0.3;

    const targetY = topY;

    gsap.killTweensOf(this.world);

    gsap.to(this.world, {
      y: targetY,
      duration: 0.5,
    });
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
