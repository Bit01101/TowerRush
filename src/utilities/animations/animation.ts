import { AnimatedSprite, Texture } from "pixi.js";
import { AssetsDB } from "../../../plugins/Assets/_DATA_BASE/AssetsDB";

type TextureKey = keyof typeof AssetsDB.texture;

export class AnimationService {
  static animationsFromFrame(name: string, step: number): AnimatedSprite {
    const framesBG: Texture[] = [];
    for (let i = 0; i <= step; i++) {
      const key = `${name}${i.toString().padStart(5, "0")}` as TextureKey;
      const id = AssetsDB.texture[key];
      if (!id) continue;
      framesBG.push(Texture.from(id));
    }
    return new AnimatedSprite(framesBG);
  }
}
