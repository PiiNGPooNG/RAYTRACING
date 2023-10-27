import Matrix from "./Matrix.js";

export default class ModelViewMatrix {
    readonly model: Matrix;
    readonly view: Matrix;
    readonly modelView: Matrix;
    readonly normalModelView: Matrix;

    constructor(model: Matrix, view: Matrix) {
        this.model = model;
        this.view = view;
        this.modelView = view.mult(model);
        this.normalModelView = this.modelView.partial(3, 3).inverse().transpose();
    }
}