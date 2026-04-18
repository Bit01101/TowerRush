import { Container, Sprite } from "pixi.js";
import { AssetsDB } from "../../../plugins/Assets/_DATA_BASE/AssetsDB";

export class ButtonCashOut {
  private container: Container;
  private sprite: Sprite;
  private text: Sprite;

  constructor() {
    this.container = new Container();

    this.sprite = Sprite.from(
      AssetsDB.texture.CASH_OUT_button_00000_00000_00000,
    );

    this.text = Sprite.from(AssetsDB.texture.CASH_OUT_00000_00000);
    this.sprite.eventMode = "static";

    this.build();
  }

  private build() {
    this.sprite.anchor.set(0.5);
    this.text.anchor.set(0.5);

    this.container.addChild(this.sprite, this.text);
  }

  getView() {
    return this.container;
  }
}
