import Game from "./Game"
import { Mesh, Scene } from "@babylonjs/core"

export default class GameObject extends Mesh {
  game: Game
  scene: Scene

  constructor(name: string, game: Game) {
    super(name, game.scene)
    this.game = game
    this.scene = game.scene
  }
}
