import { Component } from "../component/base/component";
import { RenderOrder } from "../component/render-order";
import { Transform } from "../component/transform";


export class GameObject {
   /**
    * 
    * @param {import("../world").World} world 
    * @param {{layer: number, tag: string}} options 
    */
   constructor(world, options = { tag: "", components: [] }) {
      /**
       * @type {Component}
       */
      this.components = options.components || [];
      this.world = world;
      this.activeSelf = true;
      this.tag = options.tag || "";

      /**
      * @template {Transform} T
      * @type {T}
      */
      this.transform = this.getComponent(Transform);
      if (!this.transform) {
         throw new Error("Transform component is required");
      }

      /**
       * @type {RenderOrder}
       */
      this.renderOrder = this.getComponent(RenderOrder);
      if (!this.renderOrder) {
         throw new Error("RenderOrder component is required");
      }

      for (const component of this.components) {
         this._addComponent(component);
      }

      /**
       * @type {import("./add").IAddFacade}
       */
      this.add = {};
   }

   /**
    * @template {Component} T
    * @param {T} component
    * @returns {T}
    */
   addComponent(component) {
      component.attach(this);

      if (this.world) {
         this.world.onComponentAdded(component);
      }
      else {
         console.warn("GameObject is not attached to a world");
      }

      return component;
   }


   /**
    * @private
    * @template {Component} T
    * @param {T} component
    * @returns {T}
    */
   _addComponent(component) {
      component.attach(this);

      if (this.world) {
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


