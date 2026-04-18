import {AnimatedSprite, Assets} from "pixi.js";

// =====================================================================================

export function CreateVFX(key: string, loop: boolean = true, speedMod: number  = 1, onComplete: (() => void) | null = null): AnimatedSprite {
    const vfx = AnimatedSprite.fromFrames(Assets.get(key).animations[key]);
    vfx.anchor.set(.5);
    vfx.animationSpeed = defaultSpeed(vfx) * speedMod;
    vfx.loop = loop;
    vfx.play();

    if (onComplete)
        vfx.onComplete = onComplete;
    else if (!loop)
        vfx.onComplete = () => {
            vfx.stop();
            vfx.destroy();
        };

    return vfx;
}

// =====================================================================================

export function defaultSpeed(anim: AnimatedSprite) {
    return 1 / 60 * anim.textures.length;
}

export function setAnimDuration(anim: AnimatedSprite, duration: number = 1) {
    anim.animationSpeed = defaultSpeed(anim) / duration;
}

// =====================================================================================