import { Container } from "pixi.js";

export class Zoom {
  public static zoom(container: Container, degree: number) {
    container.scale = degree * 1;
  }
}
