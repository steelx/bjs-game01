import GameObject from "./GameObject"
import { Level } from "./Level"
import Player from "./Player"
import { Engine, FreeCamera, HemisphericLight, Scene, Vector3 } from "@babylonjs/core"
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

enum GameState {
  START = 0,
  MAIN_MENU,
  SOLO_MENU,
  MULTI_MENU,
  OPTIONS_MENU,
  GAME_SOLO,
  GAME_MULTI,
  LOSE,
  WIN,
}

const levels = [
  [
    `S . . . -1 -`.split(' '),
    `1 - - - - -`.split(' '),
    `. - . . -2 -`.split(' '),
    `. . . - - -`.split(' '),
    `- - 2 . . F`.split(' '),
  ]
]

export default class Game {
  protected engine: Engine
  public scene: Scene
  private state: GameState = GameState.START
  assets: GameObject[]
  currentLevel: number
  player: Player | null
  level: Level | null

  constructor(protected canvas: HTMLCanvasElement) {
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.engine = new Engine(this.canvas, true)
    this.scene = Game.initScene(this.engine)
    this.assets = []
    this.currentLevel = 0
    this.player = null
    this.level = null

    this.initGame()

    console.log("Running game-loop...")
    this.engine.runRenderLoop(() => {
      switch (this.state) {
        case GameState.START:
          this.scene.render()
          break
        default:
          this.scene.render()
          break
      }
    })
  }

  /**
   * Initialize the game: everything that will change during the game
   * (e.g. the player, the level, the enemies, etc.)
   */
  private initGame(): void {
    this.player = new Player(this)
    this.level = Level.FromInts(levels[this.currentLevel], this)

    console.log("Level initialized!")

    // TODO: fix debug layer
    this.scene.debugLayer.show()
  }

  /**
   * Initialize the scene: everything that will not change during the game
   */
  private static initScene(engine: Engine): Scene {
    const scene = new Scene(engine)
    const camera = new FreeCamera("camera", new Vector3(2.5, 6, -6.5), scene)
    camera.rotation = new Vector3(Math.PI / 3.5, 0, 0)
    camera.attachControl(engine.getRenderingCanvas())

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene)
    light.intensity = 0.7
    console.log("Scene initialized!")
    return scene
  }

  reset() {
    throw new Error("Method not implemented.")
  }
}
