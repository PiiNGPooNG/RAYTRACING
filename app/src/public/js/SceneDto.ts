export interface SceneDto {
    camera: CameraDto | null,
    materials: MaterialDto[]
    meshes: TriangleDto[][]
}

export interface CameraDto {
    origin: Vector3Dto,
    direction: Vector3Dto
}

export interface MaterialDto {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface TriangleDto {
    vertices: [Vector3Dto, Vector3Dto, Vector3Dto],
    material: number;
}

export interface Vector3Dto {
    x: number,
    y: number;
    z: number;
}