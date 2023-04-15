import { Vector3 } from "@babylonjs/core";
import Game from "../Game";
import GameObject from "../GameObject";
import Spike from "./Spike";

export default class Key extends GameObject {
    public number: number;
    private spike: Spike | null;
    // particles: ParticleSystem

    constructor(game: Game, number: number) {
        super("key", game)
        this.number = number
        this.spike = null
        const _key = game.assets['key'].meshes[0].clone('key3D', this)
        if (_key === null) {
            throw new Error("Could not find 'Key' mesh")
        }
        _key.isVisible = true
        _key.scaling = new Vector3(0.01, 0.01, 0.01)
        _key.position = new Vector3(0, 0, 0)
        _key.parent = this
    }

    /**
     * @description link to the spike which can be unlocked by this key
    */
    public link(spike: Spike): void {
        this.spike = spike
    }

    private initParticles(): void { }

    dispose(): void {
        this.spike?.dispose()
        this.dispose()
    }
}