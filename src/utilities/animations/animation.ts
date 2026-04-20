import { AnimatedSprite, Texture } from "pixi.js";
import { AssetsDB } from "../../../plugins/Assets/_DATA_BASE/AssetsDB";

type TextureKey = keyof typeof AssetsDB.texture;

export class AnimationService {
  static animationsFromFrame(
    name: string,
    start: number,
    end: number,
  ): AnimatedSprite {
    const frames: Texture[] = [];

    for (let i = start; i <= end; i++) {
      const key = `${name}${i.toString().padStart(5, "0")}` as TextureKey;
      const id = AssetsDB.texture[key];

      if (!id) {
        throw new Error(`Missing texture: ${key}`);
      }

      frames.push(Texture.from(id));
    }

    return new AnimatedSprite(frames);
  }
}
