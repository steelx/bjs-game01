import Game from "../Game";
import GameObject from "../GameObject";
import { Material, Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";

export default class Spike extends GameObject {
    public number: number;
    sharpPart: Mesh

    constructor(game: Game, number: number) {
        super("key", game)
        this.position = Vector3.Zero()
        this.number = number
        this.sharpPart = MeshBuilder.CreateCylinder("spike", {diameter: 0.5, height: 3, tessellation: 10 }, this.getScene())
    }

    /// updateMaterial: update the material when key is used
    updateMaterial(mat: Material): void {
        this.sharpPart.material = mat
    }

    dispose(): void {
        this.dispose()
    }
}