import {Assets, Texture} from "pixi.js";
import {AssetsDB} from "./_DATA_BASE/AssetsDB.ts";

// =====================================================================================

export function texturePack(targetKey: string): Texture[] {
    return Object.keys(AssetsDB.texture)
        .filter(key => key.includes(targetKey))
        .sort((a, b) => extractFirstInt(a) - extractFirstInt(b))
        .map(key => Assets.get<Texture>(key));

    function extractFirstInt(str: string): number {
        const match = str.match(/-?\d+/);
        return match ? parseInt(match[0], 10) : NaN;
    }
}

// =====================================================================================