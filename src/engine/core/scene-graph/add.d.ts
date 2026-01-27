// add/index.d.ts
export interface IAddFacade {
    mesh(asset: any, options: any): void;
    text3D(font: any, texture: any, options: any): void;
    animator(asset: any, options: any): void;
    behaviour(behaviour: any): void;

    child(child: any): void;
}
