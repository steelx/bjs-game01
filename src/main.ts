import Game from "./Game"
import "./style.css"
import * as CANNON from "cannon"

window.CANNON = CANNON

window.addEventListener("DOMContentLoaded", () => {
  // rome-ignore lint/style/noNonNullAssertion: <explanation>
  new Game(document.querySelector<HTMLCanvasElement>("#renderCanvas")!)
})
