import Game from "../Game";
import GameObject from "../GameObject";
import Spike from "./Spike";
import { MeshBuilder } from "@babylonjs/core";

export default class Key extends GameObject {
    public number: number;
    private spike: Spike | null;
    // particles: ParticleSystem

    constructor(game: Game, number: number) {
        super("key", game)
        this.number = number
        this.spike = null
        const _key = MeshBuilder.CreateTorus("key", {diameter: 0.75, thickness: 0.25, tessellation: 10}, this.getScene())
        _key.parent = this
    }

    /**
     * @description link to the spike which can be unlocked by this key
    */
    public link(spike: Spike): void {
        this.spike = spike
    }

    private initParticles(): void {}

    dispose(): void {
        this.spike?.dispose()
        this.dispose()
    }
}