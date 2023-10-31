import Vector3 from "./Vector3.js";

export default class Matrix {
    private readonly m: number;
    private readonly n: number;

    private readonly matrix: number[][];

    constructor(raw: number[][]) {
        this.m = raw.length;
        this.n = raw[0].length;
        for (const row of raw) {
            if (row.length != this.n) {
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

    static fromVector(vector: Vector3) {
        return Matrix.from1D(vector.asArray(), 3, 1);
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

    partial(m: number, n: number) {
        if (m > this.m || n > this.n) {
            throw new Error("Can't get partial matrix larger than original");
        }
        if (m < 1 || n < 1) {
            throw new Error("Matrix must be at least size 1 in either dimension");
        }
        let partial: number[][] = [];
        for (let i = 0; i < m; i++) {
            partial[i] = this.matrix[i].slice(0, n);
        }
        return new Matrix(partial);
    }

    get asArray(): number[][] {
        return this.matrix;
    }

    asVector(): Vector3 {
        if (this.m != 3 || this.n != 1) {
            throw new Error("Can't get Vector3 from this Matrix");
        }
        return new Vector3(this.matrix[0][0], this.matrix[1][0], this.matrix[2][0]);
    }

    add(other: Matrix) {
        if (this.m != other.m || this.n != other.n) {
            throw new Error("Incompatible matrices for addition");
        }
        let matrix = [];
        for (let i = 0; i < this.m; i++) {
            matrix[i] = [];
            for (let j = 0; j < this.n; j++) {
                matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
            }
        }
        return new Matrix(matrix);
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

    scalarMult(scalar: number) {
        let matrix = this.matrix.map(row => row.map(cell => cell * scalar));
        return new Matrix(matrix);
    }

    inverse() {
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

    transpose() {
        const transposedMatrix = [];
        for (let j = 0; j < this.n; j++) {
            transposedMatrix[j] = [];
            for (let i = 0; i < this.m; i++) {
                transposedMatrix[j][i] = this.matrix[i][j];
            }
        }
        return new Matrix(transposedMatrix);
    }

    transform(v: Vector3) {
        if (this.m != 4 || this.n != 4) {
            throw new Error(`Can't use this matrix to transform Vector3 (${this.m}x${this.n})`);
        }
        const m = this.matrix;
        const w = m[3][0] * v.x + m[3][1] * v.y + m[3][2] * v.z + m[3][3];
        return new Vector3(
            (m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z + m[0][3]) / w,
            (m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z + m[1][3]) / w,
            (m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z + m[2][3]) / w,
        );
    }

    transformNormal(v: Vector3) {
        if (this.m != 3 || this.n != 3) {
            throw new Error(`Can't use this matrix to transform (normal)F Vector3 (${this.m}x${this.n})`);
        }
        const m = this.matrix;
        return Vector3.asNormal(
            m[0][0] * v.x + m[0][1] * v.y + m[0][2] * v.z,
            m[1][0] * v.x + m[1][1] * v.y + m[1][2] * v.z,
            m[2][0] * v.x + m[2][1] * v.y + m[2][2] * v.z,
        );
    }
}