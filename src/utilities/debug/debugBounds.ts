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

export function createScreenDebug(app: any, parent: any) {
  const rect = new Graphics();
  parent.addChild(rect);

  function draw() {
    const w = app.renderer.width;
    const h = app.renderer.height;

    rect.clear();

    rect.rect(0, 0, w, h);
    rect.stroke({ width: 2, color: 0xff0000 });

    rect.fill({ color: 0xff0000, alpha: 0.05 });
  }

  draw();

  app.ticker.add(() => {
    draw();
  });

  window.addEventListener("resize", draw);

  return rect;
}
