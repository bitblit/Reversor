import {Game} from "./game";
import {FirstOpen} from "./players/first-open";
import {Random} from "./players";
import {Board} from "./model";
import {Cheater} from "./players/cheater";

describe('#gameCompletes', function () {
  xit('should complete', function () {
    const game: Game = new Game(new Random(), new FirstOpen());
    const end: Board = game.run(true);
    expect(end).not.toBeNull();
  });
  it('should prevent cheating', function () {
    const game: Game = new Game(new Random(), new Cheater());
    const end: Board = game.run(true);
    expect(end).not.toBeNull();
    expect(game.currentStep).toEqual(60);
  });
});
