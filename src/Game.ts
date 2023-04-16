import { Level } from "./Level"
import Player from "./Player"
import { AbstractMesh, AssetsManager, Color3, CubeTexture, Engine, FollowCamera, FresnelParameters, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core"
import randomColor from "randomcolor"

import dirtRooted from "./assets/textures/dirt-rooted.jpg"

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

export type Assets = Record<string, { meshes: AbstractMesh[], anims?: Record<string, any> }>

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

const toLoad = [
  { name: "key", folder: "_assets/key/", filename: "key.babylon" },
]

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
  assets: Assets = {}
  currentLevel: number = 0
  player: Player | null = null
  level: Level | null = null

  constructor(protected canvas: HTMLCanvasElement) {
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.engine = new Engine(this.canvas, true)
    this.scene = Game.createScene(this.engine)

    const loader = new AssetsManager(this.scene)

    const _this = this
    toLoad.forEach((asset) => {
      const task = loader.addMeshTask(asset.name, "", asset.folder, asset.filename)
      task.onSuccess = (t) => {
        t.loadedMeshes.forEach((mesh) => { mesh.isVisible = false })
        // save in assets array
        console.log("loading meshes ", t.name);
        _this.assets[t.name] = { meshes: t.loadedMeshes }
      }
      task.onError = (_task, message, exception) => {
        console.log(message, exception);
      };
    })

    loader.onFinish = (_tasks) => {
      this.initGame()
      console.log("Running game-loop...")
      _this.engine.runRenderLoop(() => {
        _this.scene.render();
      })
    }

    loader.load();
  }

  /**
   * Initialize the game: everything that will change during the game
   * (e.g. the player, the level, the enemies, etc.)
   */
  private initGame(): void {
    this.player = new Player(this)
    this.level = Level.FromInts(levels[this.currentLevel], this)
    this.scene.beginAnimation(this, 0, 100, true, 1.0)

    // Set the camera target to the player instance
    const camera = this.scene.getCameraByName("FollowCam") as FollowCamera;
    if (camera && this.player) {
      camera.lockedTarget = this.player;
    }

    console.log("Level initialized!")

    // TODO: fix debug layer
    this.scene.debugLayer.show()
  }

  /**
   * Initialize the scene: everything that will not change during the game
   */
  private static createScene(engine: Engine): Scene {
    const scene = new Scene(engine)

    const camera = new FollowCamera("FollowCam", new Vector3(0, 10, -10), scene);

    // The goal distance of camera from target
    camera.radius = 5
    // The goal height of camera above local origin (centre) of target
    camera.heightOffset = 4
    // The goal rotation of camera around local origin (centre) of target in x y plane
    camera.rotationOffset = 0
    // Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.5
    // The speed at which acceleration is halted
    camera.maxCameraSpeed = 5
    // This attaches the camera to the canvas
    // camera.attachControl()

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

    scene.ambientColor = new Color3(1, 1, 1)
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
  const [r, g, b] = randomColor({ luminosity: 'light', hue: 'red', format: 'rgbArray' }) as unknown as number[]
  const color = Color3.FromInts(r, g, b)
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
