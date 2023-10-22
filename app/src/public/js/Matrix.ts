import Vector3 from "./Vector3.js";

export default class Matrix {
    private readonly m: number;
    private readonly n: number;

    private readonly matrix: number[][];

    constructor(raw: number[][]) {
        this.n = raw.length;
        this.m = raw[0].length;
        for (const row of raw) {
            if (row.length != this.m) {
                throw new Error("Bad matrix structure");
            }
        }
        this.matrix = raw;
    }

    static from1D(raw: number[], m: number, n: number) {
        if (raw.length != m * n) {
            throw new Error("Array not correct length for matrix of requested size");
        }
        let matrix: number[][] = [];
        for (let i = 0; i < m; i++) {
            matrix[i] = [];
            for (let j = 0; j < n; j++) {
                matrix[i][j] = raw[i * n + j];
            }
        }
        return new Matrix(matrix);
    }

    static identity(n: number) {
        let outRaw: number[][] = [];
        for (let i = 0; i < n; i++) {
            outRaw[i] = [];
            for (let j = 0; j < n; j++) {
                outRaw[i][j] = i === j ? 1 : 0;
            }
        }
        return new Matrix(outRaw);
    }

    get asArray(): number[][] {
        return this.matrix;
    }

    mult(other: Matrix) {
        if (this.n != other.m) {
            throw new Error("Incompatible matrices for multiplication");
        }
        let outRaw: number[][] = [];
        for (let i = 0; i < this.m; i++) {
            outRaw[i] = [];
            for (let j = 0; j < other.n; j++) {
                let sum = 0;
                for (let k = 0; k < this.n; k++) {
                    sum += this.matrix[i][k] * other.matrix[k][j];
                }
                outRaw[i][j] = sum;
            }
        }
        return new Matrix(outRaw);
    }

    invert() {
        if (this.m != this.n) {
            throw new Error("Can't invert non-square matrix");
        }
        let rawOut = Matrix.identity(this.m).asArray;
        let matrix = structuredClone(this.matrix);

        for (let from = 0; from < this.m - 1; from++) {
            for (let to = from + 1; to < this.m; to++) {
                const factor = matrix[to][from] / matrix[from][from];
                for (let i = 0; i < this.n; i++) {
                    matrix[to][i] -= matrix[from][i] * factor;
                    rawOut[to][i] -= rawOut[from][i] * factor;
                }
            }
        }
        for (let from = this.m - 1; from > 0; from--) {
            for (let to = from - 1; to >= 0; to--) {
                const factor = matrix[to][from] / matrix[from][from];
                for (let i = 0; i < this.n; i++) {
                    matrix[to][i] -= matrix[from][i] * factor;
                    rawOut[to][i] -= rawOut[from][i] * factor;
                }
            }
        }

        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                rawOut[i][j] /= matrix[i][i];
            }
        }

        return new Matrix(rawOut);
    }

    transform(v: Vector3) {
        if (this.m != 4 || this.n != 4) {
            throw new Error("Can't use this matrix to transform Vector3");
        }
        const m = this.matrix;
        const divisor = m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3];
        return new Vector3(
            (m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3]) / divisor,
            (m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3]) / divisor,
            (m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3]) / divisor,
        );
    }
}