import Game from "./Game";
import GameObject from "./GameObject";
import { CreateSphereVertexData, Vector3 } from "@babylonjs/core";

export default class Player extends GameObject {
    body: null;//Rigidbody
    directions: [number, number];// two directions forwards and backwards
    rotations: [number, number];// two directions left and right
    static START_HEIGHT: number = 1;

    constructor(game: Game) {
        super("player", game);

        // TODO: physics body
        this.body = null
        // player can move in two directions
        this.directions = [0, 0]
        // and can rotate in two directions
        this.rotations = [0, 0]

        const vertexData = CreateSphereVertexData({ diameter: 0.75, segments: 16, sideOrientation: 2 })
        vertexData.applyToMesh(this)

        this.addKeydownListener()
        this.addKeyupListener()

        this.position.y = Player.START_HEIGHT
        this.material = game.scene.getMaterialByName("playerMaterial")

        this.getScene().registerBeforeRender(() => {
            // Move the player if player is moving
            this.move()

            if (this.position.y < - 10) {
                this.game.reset()
            }
        })
    }

    dispose(): void {
        window.removeEventListener("keydown", this.handleKeydown)
        window.removeEventListener("keyup", this.handleKeyup)
    }

    move(): void {
        if (this.directions[0] !== 0) {
            this.moveTo(-1)
        }
        if (this.directions[1] !== 0) {
            this.moveTo(1)
        }
        if (this.rotations[0] !== 0) {
            this.rotateTo(-0.9)
        }
        if (this.rotations[1] !== 0) {
            this.rotateTo(0.9)
        }
    }

    private moveTo(s: number): void {
        // compute the world matrix of the player
        this.computeWorldMatrix()

        // move forward along the global z-axis
        const v = new Vector3(0, 0, s)
        // get the world matrix of the player
        const m = this.getWorldMatrix()
        // transform the vector v by the world matrix m
        const v2 = Vector3.TransformCoordinates(v, m)
        v2.subtractInPlace(this.position)
        v2.normalize().scaleInPlace(0.05)
        // add to player position
        this.position.addInPlace(v2)
    }

    private rotateTo(s: number): void {
        // rotate the player
        this.rotation.y += s * 0.05
    }

    private addKeydownListener(): void {
        window.addEventListener("keydown", this.handleKeydown)
    }

    private addKeyupListener(): void {
        window.addEventListener("keyup", this.handleKeyup)
    }

    private handleKeydown = (e: KeyboardEvent): void => {
        switch (e.key) {
            case "w": //top
                this.directions[0] = 1;
                break;
            case "s": //bottom
                this.directions[1] = 1;
                break;
            case "a": //left
                this.rotations[0] = 1;
                break;
            case "d": //right
                this.rotations[1] = 1;
                break;
        }
    };

    private handleKeyup = (e: KeyboardEvent): void => {
        switch (e.key) {
            case "w": //top
            case "s": //bottom
                this.directions = [0, 0];
                break;
            case "a": //left
            case "d": //right
                this.rotations = [0, 0];
                break;
        }
    };
}