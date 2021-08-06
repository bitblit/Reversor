import {Game} from "./game";
import {FirstOpen} from "./players/first-open";
import {Random} from "./players";
import {Board} from "./model";

describe('#gameCompletes', function () {
  it('should complete', function () {
    const game: Game = new Game(new Random(), new FirstOpen());
    const end: Board = game.run(true);
    expect(end).not.toBeNull();
  });
});
