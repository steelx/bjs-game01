import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core"
import { AdvancedDynamicTexture, Rectangle } from "@babylonjs/gui"
import Game from "../Game"

export async function start(this: Game) {
  const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI, Math.PI, 1, Vector3.Zero(), this.scene)
  camera.attachControl(this.canvas, true)

  this.scene.detachControl()
  this.engine.displayLoadingUI()

  const sceneToLoad = new Scene(this.engine)
  const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene)
  const backgroundRect = new Rectangle("backgroundRect")
  backgroundRect.color = "#9dc9b5"
  guiMenu.addControl(backgroundRect)

  await this.scene.whenReadyAsync()
  sceneToLoad.attachControl()
  this.engine.hideLoadingUI()
}
