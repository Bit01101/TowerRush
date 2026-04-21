import gsap from "gsap";
import { Container } from "pixi.js";

export class Zoom {
  currentPosition: number = 0;
  static followY(container: Container, targetY: number, screenHeight: number) {
    const centerY = screenHeight / 2;

    const targetPosition = centerY - targetY;

    gsap.to(container, {
      y: targetPosition,
      duration: 1,
      ease: "power2.out",
    });
  }
}
