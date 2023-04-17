// src/gameObjects/Player.ts
import Game from "./Game";
import GameObject from "./GameObject";
import { CreateSphereVertexData, Nullable, PhysicsImpostor, Quaternion, Vector3 } from "@babylonjs/core";

export default class Player extends GameObject {
    body: Nullable<PhysicsImpostor> = null//Rigidbody
    directions: [number, number]// two directions forwards and backwards
    rotations: [number, number]// two directions left and right
    static START_HEIGHT: number = 1

    constructor(game: Game) {
        super("player", game)

        // player can move in two directions
        this.directions = [0, 0]
        // and can rotate in two directions
        this.rotations = [0, 0]

        const size = 0.75
        const vertexData = CreateSphereVertexData({ diameter: size, segments: 16, sideOrientation: 2 })
        vertexData.applyToMesh(this)
        this.scaling = new Vector3(size, size, size)

        // physics body
        this.body = new PhysicsImpostor(this, PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, game.scene);
        this.physicsImpostor = this.body

        this.addKeydownListener()
        this.addKeyupListener()

        this.position.y = Player.START_HEIGHT
        this.material = game.scene.getMaterialByName("playerMaterial")

        this.getScene().registerBeforeRender(() => {
            // Move the player if player is moving
            this.move()

            if (this.position.y < - 10) {
                this.game.reset()
            }
        })
    }

    dispose(): void {
        window.removeEventListener("keydown", this.handleKeydown)
        window.removeEventListener("keyup", this.handleKeyup)
    }

    move(): void {
        if (this.directions[0] !== 0) {
            this.moveTo(-1)
        }
        if (this.directions[1] !== 0) {
            this.moveTo(1)
        }
        if (this.rotations[0] !== 0) {
            this.rotateTo(-0.9)
        }
        if (this.rotations[1] !== 0) {
            this.rotateTo(0.9)
        }
    }

    private moveTo(s: number): void {
        const force = new Vector3(0, 0, s * 10);

        // get the world matrix of the player
        const m = this.getWorldMatrix();

        // transform the vector force by the world matrix m
        const transformedForce = Vector3.TransformNormal(force, m);

        // Apply force to the physics body
        if (this.body) {
            this.body.applyForce(transformedForce, this.position);
        }
    }

    private rotateTo(s: number): void {
        const rotationAxis = new Vector3(0, 1, 0);
        const rotationAmount = s * 0.01;

        // Create a quaternion for the rotation
        const rotationQuaternion = Quaternion.RotationAxis(rotationAxis, rotationAmount);

        // Multiply the player's existing rotation quaternion by the new rotation
        if (this.rotationQuaternion) {
            this.rotationQuaternion.multiplyInPlace(rotationQuaternion);
        }
    }

    private addKeydownListener(): void {
        window.addEventListener("keydown", this.handleKeydown)
    }

    private addKeyupListener(): void {
        window.addEventListener("keyup", this.handleKeyup)
    }

    private handleKeydown = (e: KeyboardEvent): void => {
        switch (e.key) {
            case "w": //top
                this.directions[0] = 1;
                break;
            case "s": //bottom
                this.directions[1] = 1;
                break;
            case "a": //left
                this.rotations[0] = 1;
                break;
            case "d": //right
                this.rotations[1] = 1;
                break;
        }
    };

    private handleKeyup = (e: KeyboardEvent): void => {
        switch (e.key) {
            case "w": //top
            case "s": //bottom
                this.directions = [0, 0];
                break;
            case "a": //left
            case "d": //right
                this.rotations = [0, 0];
                break;
        }
    };
}