import {DaeVisualScene} from "./ColladaTypes";

export default class ColladaVisualSceneLibrary {
    visualScenes: DaeVisualScene[];

    constructor(visualScenes: DaeVisualScene[] = []) {
        this.visualScenes = visualScenes ?? [];
    }

    parse(libraryVisualSceneEl: Element) {
        for (const child of libraryVisualSceneEl.children) {
            this.parseVisualScene(child);
        }
    }

    private parseVisualScene(visualSceneEl: Element) {
        const id = visualSceneEl.getAttribute("id");
        const visualScene: DaeVisualScene = {
            id: id,
            nodes: []
        }
        const nodeEls = visualSceneEl.querySelectorAll("node");
        for (const [_, nodeEl] of nodeEls.entries()) {
            visualScene.nodes.push(this.getParsedNode(nodeEl));
        }
        this.visualScenes.push(visualScene);
    }

    private getParsedNode(nodeEl: Element) {
        const id = nodeEl.getAttribute("id");
        const node: DaeVisualScene["nodes"][number] = {
            id: id,
            instances: []
        };
        const matrixEl = nodeEl.querySelector("matrix");
        if (matrixEl) {
            const matrix = [];
            const rawMatrix = matrixEl.textContent.split(" ").map(Number);
            for (let i = 0; i < 4; i++) {
                matrix.push(rawMatrix.splice(0, 4));
            }
            node.matrix = matrix;
        }
        const instanceEls = nodeEl.querySelectorAll("instance_camera, instance_light, instance_geometry");
        for (const [_, instanceEl] of instanceEls.entries()) {
            node.instances.push(this.getParsedNodeInstances(instanceEl));
        }
        return node;
    }

    private getParsedNodeInstances(instanceEl: Element): DaeVisualScene["nodes"][number]["instances"][number] {
        const url = instanceEl.getAttribute("url").substring(1);
        switch (instanceEl.tagName) {
            case "instance_camera":
                return {
                    type: "camera",
                    url: url
                }

            case "instance_light":
                return {
                    type: "light",
                    url: url
                }

            case "instance_geometry":
                const instance: DaeVisualScene["nodes"][number]["instances"][number] = {
                    type: "geometry",
                    url: url
                }
                const bindMaterialEl = instanceEl.querySelector("bind_material");
                if (bindMaterialEl) {
                    instance.materials = [];
                    const techniqueEl = bindMaterialEl.querySelector("technique_common");
                    const instanceMaterialEls = techniqueEl.querySelectorAll("instance_material");
                    for (const [_, instanceMaterialEl] of instanceMaterialEls.entries()) {
                        instance.materials.push({
                            symbol: instanceMaterialEl.getAttribute("symbol"),
                            target: instanceMaterialEl.getAttribute("target").substring(1)
                        })
                    }
                }
                return instance;
        }
    }

    getById(id: string) {
        return this.visualScenes.find(visualScene => visualScene.id === id);
    }
}