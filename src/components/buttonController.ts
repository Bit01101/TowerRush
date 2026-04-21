type ButtonControllerDeps = {
  ui: UIScreen;
  house: House;
  winPanel: WinPanel;
  adaptive: { x: number; y: number };
  worldContainer: Container;
};

class ButtonController {
  private isFirstClick = true;
  private isFeedLocked = false;
  private isCashLocked = false;
  private score = 40;

  constructor(private deps: ButtonControllerDeps) {}
}
