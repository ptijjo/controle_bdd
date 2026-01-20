const fs = require('fs');
const path = require('path');

/**
 * Supprime tous les fichiers source map (.map) dans le dossier dist
 */
function removeSourceMaps(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      removeSourceMaps(filePath);
    } else if (file.endsWith('.map')) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Supprimé: ${filePath}`);
      } catch (err) {
        console.error(`Erreur lors de la suppression de ${filePath}:`, err);
      }
    }
  });
}

// Supprimer les source maps dans dist
const distDir = path.join(__dirname, '..', 'dist');
removeSourceMaps(distDir);

// Supprimer aussi dans src/generated/prisma si nécessaire
const prismaGeneratedDir = path.join(__dirname, '..', 'src', 'generated', 'prisma');
if (fs.existsSync(prismaGeneratedDir)) {
  removeSourceMaps(prismaGeneratedDir);
}

console.log('Nettoyage des source maps terminé.');
