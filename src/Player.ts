import Game from "./Game";
import GameObject from "./GameObject";
import { CreateSphereVertexData } from "@babylonjs/core";

export default class Player extends GameObject {
    body: null;//Rigidbody
    directions: number[];
    rotations: number[];
    static START_HEIGHT: number = 2;

    constructor(game: Game) {
        super("player", game);

        // TODO: physics body
        this.body = null
        // player can move in two directions
        this.directions = [0,0]
        // and can rotate in two directions
        this.rotations = [0,0]

        const vertexData = CreateSphereVertexData({diameter: 0.75, segments: 16, sideOrientation: 2})
        vertexData.applyToMesh(this)

        this.position.y = Player.START_HEIGHT
        this.material = game.scene.getMaterialByName("playerMaterial")

        this.getScene().registerBeforeRender(() => {
            if (this.position.y < - 10) {
                this.game.reset()
            }
        })
    }
}