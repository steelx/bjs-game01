import GameObject from "./GameObject"
import { Level } from "./Level"
import Player from "./Player"
import { Color3, CubeTexture, Engine, FreeCamera, FresnelParameters, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core"
import randomColor from "randomcolor"

import dirtRooted from "./assets/textures/dirt-rooted.jpg"

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { SkyMaterial } from "@babylonjs/materials"

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
    scene.ambientColor = new Color3(1,1,1)

    const camera = new FreeCamera("camera", new Vector3(2.5, 6, -6.5), scene)
    camera.rotation = new Vector3(Math.PI / 3.5, 0, 0)
    camera.attachControl(engine.getRenderingCanvas())

    // Materials
    // TODO: find a correct way to load materials
    const groundMaterial = new StandardMaterial("groundMaterial", scene)
    groundMaterial.diffuseTexture = new Texture(dirtRooted, scene)
    groundMaterial.emissiveColor = Color3.Blue()

    const playerMaterial = new StandardMaterial("playerMaterial", scene)
    playerMaterial.diffuseColor = Color3.White()
    playerMaterial.emissiveColor = Color3.White()
    playerMaterial.emissiveFresnelParameters = getEmmisiveFresnel()
    playerMaterial.opacityFresnelParameters = getOpacityFresnel()
    playerMaterial.alpha = 0.2

    const skyboxMaterial = new StandardMaterial("skyBox", scene)
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.reflectionTexture = new CubeTexture(
      "./images/sky/sky_",
      scene,
      ["px.bmp", "py.bmp", "pz.bmp", "nx.bmp", "ny.bmp", "nz.bmp"]
    )
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
    skyboxMaterial.specularColor = new Color3(0, 0, 0)

    const skybox = MeshBuilder.CreateBox("skyBox", { size: 100 }, scene)
    skybox.material = skyboxMaterial

    const light = new HemisphericLight("light", new Vector3(0.5, 1, 0), scene)
    light.intensity = 0.7
    console.log("Scene initialized!")
    return scene
  }

  reset() {
    throw new Error("Method not implemented.")
  }
}


function getEmmisiveFresnel(): FresnelParameters {
  const [r,g,b] = randomColor({luminosity: 'light', hue: 'red', format: 'rgbArray'}) as unknown as number[]
  const color = Color3.FromInts(r,g,b)
  const fresnel = new FresnelParameters()
  fresnel.isEnabled = true
  fresnel.bias = 0.6
  fresnel.power = 2
  fresnel.leftColor = Color3.Black()
  fresnel.rightColor = color
  return fresnel
}

function getOpacityFresnel(): FresnelParameters {
  const fresnel = new FresnelParameters()
  fresnel.isEnabled = true
  fresnel.leftColor = Color3.White()
  fresnel.rightColor = Color3.Black()
  return fresnel
}
