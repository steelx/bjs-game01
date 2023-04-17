import Player from "./Player"
import Game from "./Game"

// Mock the methods we don't want to test in Game class
jest.mock("./Game", () => {
    return jest.fn().mockImplementation(() => {
        return {
            scene: {
                getMaterialByName: jest.fn(),
                registerBeforeRender: jest.fn()
            }
        };
    });
});

describe("Player", () => {
    let game: Game;

    beforeEach(() => {
        // Set up a mock game object
        game = new Game(document.createElement("canvas"));
    });

    test("Player should be initialized", () => {
        const player = new Player(game);

        expect(player).toBeInstanceOf(Player);
    });

    test("Player should have physics body", () => {
        const player = new Player(game);

        expect(player.body).toBeDefined();
    });

    test("Player should start at the correct height", () => {
        const player = new Player(game);

        expect(player.position.y).toBe(Player.START_HEIGHT);
    });

    // Add any additional tests as needed
});
