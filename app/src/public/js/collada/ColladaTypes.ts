export interface DaeFull {
    scene: DaeScene;
    visualScenes: DaeVisualScene[];
    cameras: DaeCamera[];
    lights: DaeLight[];
    effects: DaeEffect[];
    materials: DaeMaterial[];
    geometries: DaeGeometry[];
}

export interface DaeScene {
    visual?: string;
}

export interface DaeVisualScene {
    id: string;
    nodes: {
        id: string;
        matrix?: number[][];
        instances: {
            type: "camera" | "light" | "geometry";
            url: string;
            materials?: {
                symbol: string;
                target: string;
            }[];
        }[];
    }[];
}

export interface DaeGeometry {
    id: string;
    triangles: {
        material?: string;
        count: number;
        inputs: {
            semantic: string;
            offset: number;
            source: string;
        }[];
        indices: number[];
    }[];
    sources: {
        id: string;
        data: number[][];
    }[];
}

export interface DaeLight {
    id: string;
    type: "point";
    color: DaeColor;
}

export interface DaeCamera {
    id: string;
    type: "perspective";
    optics: {
        xfov: number;
        aspectRatio: number;
        znear: number;
        zfar: number;
    }
}

export interface DaeMaterial {
    id: string;
    effect: string;
}

export interface DaeEffect {
    id: string;
    type: "lambert";
    properties: {
        diffuse?: DaeColor;
    };
}

export interface DaeColor {
    r: number;
    g: number;
    b: number;
    a?: number;
}