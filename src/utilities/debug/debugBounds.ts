import { Container, Graphics } from "pixi.js";

export function debugBounds(parent: Container, target: Container) {
  const g = new Graphics();

  const update = () => {
    g.clear();

    const b = target.getBounds();

    g.rect(b.x, b.y, b.width, b.height).stroke({ width: 2 });
  };

  update();
  parent.addChild(g);

  return update;
}
