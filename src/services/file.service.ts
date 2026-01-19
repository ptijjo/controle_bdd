import { Service } from "typedi";
import fs from 'fs/promises';
import path from 'path';
import { HttpException } from '@/exceptions/httpException';
import { logger } from '@/utils/logger';

@Service()
export class DownloadFile { 

    public async downloadFile(): Promise<string > {
         //On récupère le nom du livre
        const filename = 'controle.xlsx';
        
         //Vérification du fichier sur le serveur
      // Utiliser process.cwd() pour être cohérent avec saveToExcel
      const controleDir = path.resolve(process.cwd(), 'controle');
      const filePath = path.join(controleDir, filename);

      // Protection contre path traversal : vérifier que le chemin résolu est bien dans le répertoire autorisé
      const resolvedPath = path.resolve(filePath);
      if (!resolvedPath.startsWith(controleDir)) {
        logger.error('Tentative d\'accès non autorisé au fichier:', resolvedPath);
        throw new HttpException(403, 'Accès non autorisé');
      }

          try {
      await fs.access(filePath);
    } catch (error) {
      logger.error('Fichier introuvable pour téléchargement:', filePath);
      throw new HttpException(409, 'Fichier introuvable');
    }
        return filePath
    }
}