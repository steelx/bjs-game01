import Game from "../Game"
import GameObject from "../GameObject"
import dirtRooted from "../assets/textures/dirt-rooted.jpg"
import { Color3, CreateBoxVertexData, Mesh, StandardMaterial, Texture, Vector3 } from "@babylonjs/core"


export enum BlockType {
    NOTHING = '-',
    EMPTY = '.',
    START = 'S',
    FINISH = 'F',
}

/**
 * Block - data structure for a level
 * @description
 * level is a collection of game objects that make up a level.
 * S = start position
 * F = finish position
 * _ = empty block
 * - = no block at all
 * any other number = a spike
 * any other same negative number = a key for that spike
 *
 * @example
 * [
 *  ['S', 0,0,0,-1,0,0,0,0,1,'F'],
 * ]
 */
export default class Block extends GameObject {
    public static TYPES = BlockType

    constructor(x: number, z: number, game: Game) {
        super("Block", game)

        this.material = game.scene.getMaterialByName("groundMaterial")

        const vertexData = CreateBoxVertexData({size: 1, sideOrientation: Mesh.FRONTSIDE})
        vertexData.applyToMesh(this)

        this.position = Vector3.Zero()
        this.position.x = x
        this.position.z = -z
    }

    dispose(): void {}
}