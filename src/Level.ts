// src/Level.ts
import Game from "./Game";
import Apple from "./gameObjects/Apple";
import Block from "./gameObjects/Block";
import Key from "./gameObjects/Key";
import Spike from "./gameObjects/Spike";
import { Scene } from '@babylonjs/core';

export class Level {
    game: Game;
    scene: Scene;
    start: Block | null;
    finish: Block | null;
    keys: Key[];
    spikes: Spike[];
    blocks: Block[];

    constructor(game: Game) {
        this.game = game;
        this.scene = game.scene;

        // starting position of this level
        this.start = null
        this.finish = null
        this.keys = []
        this.spikes = []
        this.blocks = []// Level blocks
    }

    dispose(): void {
        this.keys.forEach(k => k.dispose())
        this.spikes.forEach(s => s.dispose())
        this.blocks.forEach(b => b.dispose())
    }

    /**
     * @param matrix - a matrix of ints representing the level
    */
    public static FromInts(matrix: string[][], game: Game): Level {
        const level = new Level(game)
        for (let z = 0; z < matrix.length; z++) {
            for (let x = 0; x < matrix[z].length; x++) {
                const type = matrix[z][x]
                let block = null
                if (type === Block.TYPES.NOTHING) {
                    continue;// do nothing
                } else {
                    // create a block
                    block = new Block(x, z, game)
                    level.blocks.push(block)
                    const isNaN = Number.isNaN(Number(type))
                    if (isNaN) {
                        if (type === Block.TYPES.EMPTY) {
                            continue;// do nothing
                        } else if (type === Block.TYPES.START) {
                            level.start = block
                        } else if (type === Block.TYPES.FINISH) {
                            const a = new Apple(game)
                            a.position = block.position.clone()
                            a.position.y = 1
                            level.finish = block
                        }
                    } else {
                        // this block is a spike or key
                        const num = Math.abs(Number(type))
                        if (Number(type) > 0) {
                            // it is a spike
                            const s = new Spike(game, num)
                            s.position.set(x, 0.1, -z)
                            level.spikes.push(s)
                        } else {
                            // it is a key
                            const k = new Key(game, num)
                            k.position.set(x, 0.75, -z)
                            level.keys.push(k)
                        }
                    }
                }
            }
        }

        // For all keys, link to its corresponding spike
        for (let k = 0; k < level.keys.length; k++) {
            const key = level.keys[k]
            for (let s = 0; s < level.spikes.length; s++) {
                const spike = level.spikes[s]
                if (key.number === spike.number) {
                    key.link(spike)
                }
            }
        }

        return level
    }
}