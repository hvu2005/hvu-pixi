

export class GameObject {
   /**
    * 
    * @param {import("../World").World} world 
    */
   constructor(world) {
      this.components = [];

      this.world = world;
      this.activeSelf = true;

      /**
       * @type {import("../component/Transform").Transform}
       */
      this.transform;

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

      if(this.world) {
         this.world.onComponentAdded(component);
      }
      else {
         console.warn("GameObject is not attached to a world");
      }

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


