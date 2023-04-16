import { Animation, Quaternion, Vector3 } from "@babylonjs/core";
import Game from "../Game";
import GameObject from "../GameObject";
import Spike from "./Spike";

const startQuaternion = Quaternion.RotationYawPitchRoll(0, 0, 0)
const endQuaternion = Quaternion.RotationYawPitchRoll(0, 0, Math.PI)
const finalQuaternion = Quaternion.RotationYawPitchRoll(0, 0, Math.PI * 2)
const animation = new Animation("keyAnim", "rotationQuaternion", 30, Animation.ANIMATIONTYPE_QUATERNION, Animation.ANIMATIONLOOPMODE_CYCLE)
animation.setKeys([
    { frame: 0, value: startQuaternion },
    { frame: 30, value: endQuaternion },
    { frame: 60, value: finalQuaternion },
])

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

        this.getScene().beginDirectAnimation(_key, [animation], 0, 60, true, 1.0)
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