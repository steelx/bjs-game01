// src/gameObjects/Block.ts
import Game from "../Game"
import GameObject from "../GameObject"
import { CreateBoxVertexData, Mesh, PhysicsImpostor, Vector3 } from "@babylonjs/core"

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

        const vertexData = CreateBoxVertexData({ size: 1, sideOrientation: Mesh.FRONTSIDE })
        vertexData.applyToMesh(this)

        this.material = game.scene.getMaterialByName("groundMaterial")
        this.scaling = new Vector3(1, 1, 1)
        this.physicsImpostor = new PhysicsImpostor(this, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5, friction: 0.8 }, this.getScene())

        this.position = Vector3.Zero()
        this.position.x = x
        this.position.z = -z
    }

    dispose(): void { }

    /**
    * @description Returns true if the given position is within the boundaries of this block.
    * @example block.contains(new Vector3(0, 0, 0)) // true
    */
    public contains(position: Vector3): boolean {
        const halfSize = this.scaling.scale(0.5)
        const minX = this.position.x - halfSize.x
        const maxX = this.position.x + halfSize.x
        const minY = this.position.y - halfSize.y
        const maxY = this.position.y + halfSize.y
        const minZ = this.position.z - halfSize.z
        const maxZ = this.position.z + halfSize.z
        return position.x >= minX && position.x <= maxX &&
            position.y >= minY && position.y <= maxY &&
            position.z >= minZ && position.z <= maxZ
    }
}