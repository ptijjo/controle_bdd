const fs = require('fs');
const path = require('path');

const generatedDir = path.join(__dirname, '..', 'src', 'generated');

function removeSourceMapReferences(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      removeSourceMapReferences(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      // Supprimer les références aux source maps
      content = content.replace(/\/\/# sourceMappingURL=.*\.map\s*$/gm, '');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Source map reference removed from: ${fullPath}`);
      }
    }
  }
}

console.log('Suppression des références aux source maps dans les fichiers générés...');
removeSourceMapReferences(generatedDir);
console.log('Terminé!');
