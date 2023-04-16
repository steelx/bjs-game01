import Game from "../Game";
import GameObject from "../GameObject";
import { Animation, MeshBuilder } from "@babylonjs/core";

const animation = new Animation("appleAnim", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
animation.setKeys([
    { frame: 0, value: 0 },
    { frame: 30, value: 1 },
    { frame: 60, value: 0 },
])
export default class Apple extends GameObject {
    constructor(game: Game) {
        super("Apple", game)
        const _apple = MeshBuilder.CreateTorusKnot("apple", { radius: 0.25, tube: 0.05, radialSegments: 64, tubularSegments: 64 }, this.getScene())
        _apple.parent = this

        // const anims = game.assets['key'].anims['idle']
        _apple.animations.push(animation)
        this.getScene().beginAnimation(_apple, 0, 100, true, 1)
    }
}