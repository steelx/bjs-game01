// src/gameObjects/Spike.ts
import Game from "../Game";
import GameObject from "../GameObject";
import { Color3, CreateBoxVertexData, CreateCylinderVertexData, FloatArray, IndicesArray, Material, Mesh, MeshBuilder, Nullable, StandardMaterial, VertexData } from "@babylonjs/core";

export default class Spike extends GameObject {
    public number: number;
    sharpPart: Mesh

    constructor(game: Game, number: number) {
        super("key", game)
        this.number = number
        this.sharpPart = new Mesh("spike", this.getScene());
        const vertexData = createSpikesWithBoxVertexData({ spikeCount: 6, boxSize: 0.95, spikeHeight: 0.5, spikeRadius: 0.1 });
        vertexData.applyToMesh(this.sharpPart);
        this.sharpPart.parent = this//else position is not workinga

        const mat = new StandardMaterial("spikeMat", this.getScene())
        Color3.HSVtoRGBToRef(0.1, 0.5, 0.3, mat.emissiveColor)
        mat.specularColor = Color3.Red()
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

interface SpikeOptions {
    spikeCount?: number
    boxSize?: number
    baseRadius?: number
    spikeHeight?: number
    spikeRadius?: number
}

function createSpikesWithBoxVertexData(options: SpikeOptions): VertexData {
    const { spikeCount = 6, boxSize = 1, spikeHeight = 1, spikeRadius = 0.1 } = options;

    const positions: FloatArray = [];
    const indices: IndicesArray = [];
    const normals: FloatArray = [];
    const uvs: FloatArray = [];

    // Generate base box
    const baseVertexData = CreateBoxVertexData({ size: boxSize });
    positions.push(...baseVertexData.positions);
    indices.push(...baseVertexData.indices);
    normals.push(...baseVertexData.normals);
    uvs.push(...baseVertexData.uvs);

    if (!positions || !indices || !normals || !uvs) {
        throw new Error("Failed to generate base box vertex data");
    }

    const baseVerticesCount = positions.length / 3;

    // Generate spikes using Fermat spiral
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const halfSize = boxSize / 2;
    const offset = halfSize * 0.9;
    for (let j = 0; j < spikeCount; j++) {
        const angle = goldenAngle * j;
        const radius = Math.sqrt(j / spikeCount) * offset;
        const baseX = radius * Math.cos(angle);
        const baseZ = radius * Math.sin(angle);

        const spikePositions: FloatArray = [];
        const spikeIndices: IndicesArray = [];
        const spikeNormals: FloatArray = [];
        const spikeUVs: FloatArray = [];

        // Center bottom vertex
        spikePositions.push(baseX, halfSize, baseZ);
        spikeUVs.push(0.5, 0);

        // Generate spike vertices
        for (let i = 0; i < 4; i++) {
            const spikeAngle = (2 * Math.PI * i) / 4;
            const x = spikeRadius * Math.cos(spikeAngle) + baseX;
            const z = spikeRadius * Math.sin(spikeAngle) + baseZ;

            spikePositions.push(x, halfSize, z); // bottom vertices
            spikeUVs.push(i / 3, 1);
        }

        // Center top vertex (tip of the spike)
        spikePositions.push(baseX, halfSize + spikeHeight, baseZ);
        spikeUVs.push(0.5, 1);

        // Generate spike indices
        for (let i = 0; i < 4; i++) {
            // bottom triangle
            spikeIndices.push(0, i + 1, (i + 1) % 4 + 1);
            // side triangle
            spikeIndices.push(i + 1, 5, (i + 1) % 4 + 1);
        }

        // Generate normals
        VertexData.ComputeNormals(spikePositions, spikeIndices, spikeNormals);

        // Offset spike indices
        const _offset = baseVerticesCount + j * (spikePositions.length / 3);
        spikeIndices.forEach((index, i) => {
            spikeIndices[i] = index + _offset;
        });

        // Combine base and spike vertex data
        positions.push(...spikePositions);
        indices.push(...spikeIndices);
        normals.push(...spikeNormals);
        uvs.push(...spikeUVs);
    }

    // Create and return vertex data
    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    return vertexData;
}


function createSpikeWithCylinderVertexData(options: SpikeOptions): VertexData {
    const { spikeCount = 6, baseRadius = 0.5, spikeHeight = 1, spikeRadius = 0.1 } = options;

    const positions: Nullable<FloatArray> = [];
    const indices: IndicesArray = [];
    const normals: Nullable<FloatArray> = [];
    const uvs: Nullable<FloatArray> = [];

    // Generate base cylinder
    const baseVertexData = CreateCylinderVertexData({ height: 0.1, diameter: baseRadius * 2, tessellation: 12 });
    positions.push(...baseVertexData.positions);
    indices.push(...baseVertexData.indices);
    normals.push(...baseVertexData.normals);
    uvs.push(...baseVertexData.uvs);

    const baseVerticesCount = positions.length / 3;

    // Generate spikes
    for (let j = 0; j < spikeCount; j++) {
        const angle = (2 * Math.PI * j) / spikeCount;
        const baseX = baseRadius * Math.cos(angle);
        const baseZ = baseRadius * Math.sin(angle);

        const spikePositions = [];
        const spikeIndices: IndicesArray = [];
        const spikeNormals: Nullable<FloatArray> = [];
        const spikeUVs: Nullable<FloatArray> = [];

        // Center bottom vertex
        spikePositions.push(baseX, 0.1, baseZ);
        spikeUVs.push(0.5, 0);

        // Generate spike vertices
        for (let i = 0; i < 4; i++) {
            const spikeAngle = (2 * Math.PI * i) / 4;
            const x = spikeRadius * Math.cos(spikeAngle) + baseX;
            const z = spikeRadius * Math.sin(spikeAngle) + baseZ;

            spikePositions.push(x, 0.1, z); // bottom vertices
            spikeUVs.push(i / 3, 1);
        }

        // Center top vertex (tip of the spike)
        spikePositions.push(baseX, 0.1 + spikeHeight, baseZ);
        spikeUVs.push(0.5, 1);

        // Generate spike indices
        for (let i = 0; i < 4; i++) {
            // bottom triangle
            spikeIndices.push(0, i + 1, (i + 1) % 4 + 1);
            // side triangle
            spikeIndices.push(i + 1, 5, (i + 1) % 4 + 1);
        }

        // Generate normals
        VertexData.ComputeNormals(spikePositions, spikeIndices, spikeNormals);

        // Offset spike indices
        const offset = baseVerticesCount + j * (spikePositions.length / 3);
        spikeIndices.forEach((index, i) => {
            spikeIndices[i] = index + offset;
        });

        // Combine base and spike vertex data
        positions.push(...spikePositions);
        indices.push(...spikeIndices);
        normals.push(...spikeNormals);
        uvs.push(...spikeUVs);
    }

    // Create and return vertex data
    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    return vertexData;
}

