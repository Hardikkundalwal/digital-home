const fs = require('fs');
const path = require('path');

function findTransforms(filePath) {
  console.log(`\n=== Transforms in: ${filePath} ===`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.nodes.forEach((node, idx) => {
    if (node.rotation || node.scale || node.translation) {
      console.log(`Node ${idx} ("${node.name || ''}"):`);
      if (node.translation) console.log(`  translation: ${JSON.stringify(node.translation)}`);
      if (node.rotation) console.log(`  rotation: ${JSON.stringify(node.rotation)}`);
      if (node.scale) console.log(`  scale: ${JSON.stringify(node.scale)}`);
    }
  });
}

findTransforms(path.join(__dirname, '..', 'public', 'models', 'isometric_room_school', 'scene.gltf'));
findTransforms(path.join(__dirname, '..', 'public', 'models', 'vintage_living_room', 'scene.gltf'));
