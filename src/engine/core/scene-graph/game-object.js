import { Component } from "../component/base/component";


export class GameObject {
   /**
    * 
    * @param {import("../world").World} world 
    * @param {{layer: number, tag: string}} options 
    */
   constructor(world, options = {tag: ""}) {
      this.components = [];

      this.world = world;
      this.activeSelf = true;
      this.tag = options.tag || "";

      /**
       * @type {import("../component/transform").Transform}
       */
      this.transform;

      /**
       * @type {import("../component/render-order").RenderOrder}
       */
      this.renderOrder;

   }

   /**
    * @abstract
    */
   init() { }

   /**
    * @template {Component} T
    * @param {T} component
    * @returns {T}
    */
   addComponent(component) {
      this.components.push(component);
      component.attach(this);

      if(this.world) {
         this.world.onComponentAdded(component);
      }
      else {
         console.warn("GameObject is not attached to a world");
      }

      return component;
   }

   /**
    * @template {Component} T
    * @param {new (...args: any[]) => T} component
    * @returns {T | undefined}
    */
   getComponent(component) {
      return this.components.find(c => c instanceof component);
   }

   /**
    * 
    * @param {boolean} isActive 
    */
   setActive(isActive) {
      if (this.activeSelf === isActive) return;
      this.activeSelf = isActive;

      for (const component of this.components) {
         component.enabled = isActive;
      }
   }

}


