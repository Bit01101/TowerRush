import { Container, Sprite } from "pixi.js";
import { Game } from "../../plugins/Game/Game";
import { AssetsDB } from "../../plugins/Assets/_DATA_BASE/AssetsDB";
import { ButtonCashOut } from "./button/buttonCashOut";

export class NavPanel {
  public container: Container;
  private bg: Sprite;
  private buttons: Container[] = [];
  private game: Game;

  constructor(game: Game) {
    this.game = game;
    this.container = new Container();

    this.bg = Sprite.from(AssetsDB.texture.UI_bcgr_00000);
    this.init();

    this.game.app.stage.addChild(this.container);
  }

  private init() {
    const w = this.game.app.screen.width;
    const h = this.game.app.screen.height;

    this.bg.anchor.set(0.5, 1);

    const scaleX = w / this.bg.texture.width;
    this.bg.scale.set(scaleX);

    this.bg.position.set(w / 2, 0); // внутри контейнера

    this.container.addChild(this.bg);

    // сам контейнер фиксируем внизу
    this.container.position.set(0, h);
  }

  private layoutButtons() {
    const w = this.game.app.screen.width;

    const count = this.buttons.length;
    if (count === 0) return;

    const spacing = w / (count + 1);

    this.buttons.forEach((btn, i) => {
      btn.position.set(spacing * (i + 1) - w / 2, -this.bg.height / 2);
    });
  }

  addComponent(button: ButtonCashOut) {
    const view = button.getView();

    this.container.addChild(view);
    this.buttons.push(view);

    this.layoutButtons();
  }
}
