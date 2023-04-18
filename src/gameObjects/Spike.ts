// src/gameObjects/Spike.ts
import { Color3, CreateBoxVertexData, Material, Mesh, PhysicsImpostor, StandardMaterial } from "@babylonjs/core"
import Game from "../Game"
import GameObject from "../GameObject"
import Player from "../Player"
import { createSpikesVertexData } from "../createMesh/createSpikeMesh"

export default class Spike extends GameObject {
    public number: number
    sharpPart: Mesh

    constructor(game: Game, number: number) {
        super("key", game)
        this.number = number

        const boxSize = 0.95
        const vertexData = CreateBoxVertexData({ size: boxSize, sideOrientation: Mesh.FRONTSIDE })
        vertexData.applyToMesh(this)
        this.physicsImpostor = new PhysicsImpostor(this, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.getScene())

        const invisibleMaterial = new StandardMaterial("invisibleMaterial", this.getScene());
        invisibleMaterial.alpha = 0;
        this.material = invisibleMaterial;


        this.sharpPart = new Mesh("sharpPart", this.getScene())
        const spikesVertexData = createSpikesVertexData({ spikeCount: 6, boxSize, spikeHeight: 0.5, spikeRadius: 0.1 })
        spikesVertexData.applyToMesh(this.sharpPart)
        this.sharpPart.parent = this
        this.sharpPart.position.y -= boxSize


        const mat = new StandardMaterial("spikeMat", this.getScene())
        Color3.HSVtoRGBToRef(1, 0.5, 0.3, mat.emissiveColor)
        mat.specularColor = Color3.Red()
        this.sharpPart.material = mat
    }

    /// updateMaterial: update the material when key is used
    updateMaterial(mat: Material): void {
        this.material = mat
    }

    dispose(): void {
        this.dispose()
    }

    registerCollision(player: Player): void {
        this.physicsImpostor?.registerOnPhysicsCollide(player.body!, (_, collided) => {
            console.log('Player collided with spike', { collided })
        })
    }
}
