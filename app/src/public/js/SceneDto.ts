export interface SceneDto {
    camera: CameraDto | null;
    materials: MaterialDto[];
    meshes: TriangleDto[][];
    lights: LightDto[];
}

export interface CameraDto {
    origin: Vector3Dto;
    direction: Vector3Dto;
}

export interface MaterialDto {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface LightDto {
    position: Vector3Dto
}

export interface TriangleDto {
    vertices: [Vector3Dto, Vector3Dto, Vector3Dto];
    material: number;
}

export interface Vector3Dto {
    x: number;
    y: number;
    z: number;
}