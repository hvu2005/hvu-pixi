# HVU Engine

A game engine supporting both 2D (PixiJS) and 3D (Three.js) rendering.

## Installation

```bash
npm install hvu-engine
```

## Usage

### TypeScript

```typescript
import { World, GameObject3D, RenderPipeline } from 'hvu-engine';

const world = new World();
await world.init({
  pixi: new PixiRenderer(),
  three: new ThreeRenderer()
});
```

### JavaScript

```javascript
import { World, GameObject3D } from 'hvu-engine';

const world = new World();
await world.init({
  pixi: new PixiRenderer(),
  three: new ThreeRenderer()
});
```

## Development

### Build

```bash
npm run build
```

This will compile TypeScript and JavaScript files to the `dist` directory.

### Watch Mode

```bash
npm run watch
```

### Publish to npm

```bash
npm publish
```

The `prepublishOnly` script will automatically build the package before publishing.

## Exports

The package exports the following modules:

- `World` - Main engine world instance
- `GameObject` - Base game object class
- `GameObject3D` - 3D game object class
- `EventEmitter` - Event system
- `RenderPipeline` - Rendering pipeline
- `PixiRenderer` - PixiJS renderer
- `ThreeRenderer` - Three.js renderer
- `BehaviourSystem` - Behavior system
- `Physic3DSystem` - 3D physics system
- `Text3D` - 3D text extension


