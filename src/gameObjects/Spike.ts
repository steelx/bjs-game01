import Game from "../Game";
import GameObject from "../GameObject";
import { Color3, FloatArray, IndicesArray, Material, Mesh, MeshBuilder, Nullable, StandardMaterial, VertexData } from "@babylonjs/core";

export default class Spike extends GameObject {
    public number: number;
    sharpPart: Mesh

    constructor(game: Game, number: number) {
        super("key", game)
        this.number = number
        this.sharpPart = new Mesh("spike", this.getScene());
        const vertexData = createSpikeVertexData();
        vertexData.applyToMesh(this.sharpPart);
        this.sharpPart.parent = this//else position is not workinga

        const mat = new StandardMaterial("spikeMat", this.getScene())
        mat.emissiveColor = Color3.Red()
        mat.specularColor = Color3.Black()
        this.sharpPart.material = mat

    }

    /// updateMaterial: update the material when key is used
    updateMaterial(mat: Material): void {
        this.sharpPart.material = mat
    }

    dispose(): void {
        this.dispose()
    }
}

function createSpikeVertexData(): VertexData {
    const positions = [];
    const indices: IndicesArray = [];
    const normals: Nullable<FloatArray> = [];
    const uvs: Nullable<FloatArray> = [];

    const numSides = 6;
    const height = 1;
    const radius = 0.5;

    // Center bottom vertex
    positions.push(0, 0, 0);
    uvs.push(0.5, 0);

    // Generate spike vertices
    for (let i = 0; i < numSides; i++) {
        const angle = (2 * Math.PI * i) / numSides;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        positions.push(x, 0, z); // bottom vertices
        uvs.push(i / (numSides - 1), 1);
    }

    // Center top vertex (tip of the spike)
    positions.push(0, height, 0);
    uvs.push(0.5, 1);

    // Generate spike indices
    for (let i = 0; i < numSides; i++) {
        // bottom triangle
        indices.push(0, i + 1, (i + 1) % numSides + 1);
        // side triangle
        indices.push(i + 1, numSides + 1, (i + 1) % numSides + 1);
    }

    // Generate normals
    VertexData.ComputeNormals(positions, indices, normals);

    // Create and return vertex data
    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    return vertexData;
}

