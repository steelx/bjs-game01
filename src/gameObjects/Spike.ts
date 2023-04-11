import Game from "../Game";
import GameObject from "../GameObject";
import { Color3, Material, Mesh, MeshBuilder, StandardMaterial } from "@babylonjs/core";

export default class Spike extends GameObject {
    public number: number;
    sharpPart: Mesh

    constructor(game: Game, number: number) {
        super("key", game)
        this.number = number
        this.sharpPart = MeshBuilder.CreateCylinder("spike", {diameter: 0.5, height: 2, tessellation: 10 }, this.getScene())
        const mat = new StandardMaterial("spikeMat", this.getScene())
        mat.emissiveColor = Color3.Red()
        mat.specularColor = Color3.Black()
        this.sharpPart.material = mat
        this.sharpPart.parent = this//else position is not working
    }

    /// updateMaterial: update the material when key is used
    updateMaterial(mat: Material): void {
        this.sharpPart.material = mat
    }

    dispose(): void {
        this.dispose()
    }
}