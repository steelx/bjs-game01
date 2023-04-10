import Game from "./Game"
import "./style.css"

window.addEventListener("DOMContentLoaded", () => {
  // rome-ignore lint/style/noNonNullAssertion: <explanation>
  new Game(document.querySelector<HTMLCanvasElement>("#renderCanvas")!)
})
