import { Game } from "../plugins/Game/Game.ts";
import { GAME_CONFIG } from "./config.ts";
import { AssetsBase64 } from "../plugins/Assets/AssetsBase64.ts";
import { AssetsDB } from "../plugins/Assets/_DATA_BASE/AssetsDB.ts";
import { Main } from "./GAME/main.ts";
import {
  AddAutoIllustrativeText,
  AddBackground,
} from "../plugins/Game/GameUIUtils.ts";

// =====================================================================================

export const game = new Game(GAME_CONFIG);

// =====================================================================================

window.onload = async () => {
  await game.initialise();

  // GAME BACKGROUND
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (AssetsDB.texture && AssetsDB.texture.background)
    await AddBackground(AssetsDB.texture.BG2_00000);
  game.resize();

  // LOADING
  await AssetsBase64.loadAll();

  await Main(game);

  // FOR IRON-SOURCE
  AddAutoIllustrativeText();

  game.resize();
};

// =====================================================================================
