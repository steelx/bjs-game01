import Game from "../Game";
import GameObject from "../GameObject";
import { MeshBuilder } from "@babylonjs/core";

export default class Apple extends GameObject {
    constructor(game: Game) {
        super("Apple", game)
        const _apple = MeshBuilder.CreateTorusKnot("apple", {radius: 0.25, tube: 0.05, radialSegments: 64, tubularSegments: 64}, this.getScene())
        _apple.parent = this
    }
}