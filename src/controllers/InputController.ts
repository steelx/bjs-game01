// src/controllers/InputController.ts
import { Scene, Vector3 } from "@babylonjs/core";
import Game from "../Game";
import Player from "../Player";

const BLOCK_SIZE = 1;

export default class InputController {
    private game: Game;
    private scene: Scene;
    private player: Player;

    constructor(game: Game, player: Player) {
        this.game = game;
        this.scene = game.scene;
        this.player = player;

        // Add event listeners for keyboard and gamepad input
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("gamepadconnected", this.handleGamepadConnected.bind(this));
        window.addEventListener("gamepaddisconnected", this.handleGamepadDisconnected.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowUp":
                this.movePlayer(new Vector3(0, 0, -BLOCK_SIZE));
                break;
            case "ArrowDown":
                this.movePlayer(new Vector3(0, 0, BLOCK_SIZE));
                break;
            case "ArrowLeft":
                this.movePlayer(new Vector3(BLOCK_SIZE, 0, 0));
                break;
            case "ArrowRight":
                this.movePlayer(new Vector3(-BLOCK_SIZE, 0, 0));
                break;
        }
    }

    private handleGamepadConnected(event: GamepadEvent) {
        console.log("Gamepad connected:", event.gamepad.id);
    }

    private handleGamepadDisconnected(event: GamepadEvent) {
        console.log("Gamepad disconnected:", event.gamepad.id);
    }

    private handleGamepadInput() {
        const gamepad = navigator.getGamepads()[0];

        if (gamepad) {
            const threshold = 0.2;

            const x = Math.abs(gamepad.axes[0]) > threshold ? gamepad.axes[0] : 0;
            const z = Math.abs(gamepad.axes[1]) > threshold ? -gamepad.axes[1] : 0;

            if (x || z) {
                const movement = new Vector3(x * BLOCK_SIZE, 0, z * BLOCK_SIZE);
                this.movePlayer(movement);
            }
        }
    }

    private movePlayer(movement: Vector3) {
        const newPosition = this.player.position.add(movement);
        const gridPosition = newPosition.clone();
        gridPosition.x = Math.round(gridPosition.x / BLOCK_SIZE) * BLOCK_SIZE;
        gridPosition.z = Math.round(gridPosition.z / BLOCK_SIZE) * BLOCK_SIZE;

        this.player.position.copyFromFloats(gridPosition.x, this.player.position.y, gridPosition.z);
    }

    public update() {
        // Handle gamepad input
        this.handleGamepadInput();
    }

    public dispose() {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this));
        window.removeEventListener("gamepadconnected", this.handleGamepadConnected.bind(this));
        window.removeEventListener("gamepaddisconnected", this.handleGamepadDisconnected.bind(this));
    }
}
