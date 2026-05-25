const fs = require('fs');
const path = require('path');

function inspectGLTF(filePath) {
  console.log(`\n=== Inspecting: ${filePath} ===`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.nodes) {
    console.log(`Total Nodes: ${data.nodes.length}`);
    // Print first 5 nodes
    data.nodes.slice(0, 8).forEach((node, idx) => {
      console.log(`Node ${idx}: name="${node.name || ''}" translation=${JSON.stringify(node.translation)} rotation=${JSON.stringify(node.rotation)} scale=${JSON.stringify(node.scale)} children=${JSON.stringify(node.children)}`);
    });
  }
  
  if (data.scenes) {
    console.log(`Scenes: ${JSON.stringify(data.scenes)}`);
  }
}

inspectGLTF(path.join(__dirname, '..', 'public', 'models', 'isometric_room_school', 'scene.gltf'));
inspectGLTF(path.join(__dirname, '..', 'public', 'models', 'vintage_living_room', 'scene.gltf'));
