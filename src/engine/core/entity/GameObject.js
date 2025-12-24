
export class GameObject {
   constructor(world) {
      this.components = [];

      this.world = world;
      this.activeSelf = true;
   }

   /**
    * @abstract
    */
   init() { }

   /**
    * @template T
    * @param {T} component
    * @returns {T}
    */
   addComponent(component) {
      this.components.push(component);
      component.attach(this);

      this.world?.onComponentAdded(component);

      return component;
   }

   /**
    * @template T
    * @param {new (...args: any[]) => T} component
    * @returns {T | undefined}
    */
   getComponent(component) {
      return this.components.find(c => c instanceof component);
   }

   setActive(isActive) {
      if (this.activeSelf === isActive) return;
      this.activeSelf = isActive;
      this.node.visible = isActive;

      for (const component of this.components) {
         component.enabled = isActive;
      }

      for (const child of this.children) {
         child.setActive(isActive);
      }
   }
}


