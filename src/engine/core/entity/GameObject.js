
export class GameObject {
   constructor() {
      this.components = [];

      this.activeSelf = true; 
   }

   /**
    * @abstract
    */
   init() {}
   
   addComponent(component) {
      this.components.push(component);
      component.attach(this);
   }

   getComponent(component) {
      return this.components.find(c => c.constructor === component);
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


