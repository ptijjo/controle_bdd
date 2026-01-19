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
      const filePath = path.join(process.cwd(), 'controle', filename);

          try {
      await fs.access(filePath);
    } catch (error) {
      logger.error('Fichier introuvable pour téléchargement:', filePath);
      throw new HttpException(409, 'Fichier introuvable');
    }
        return filePath
    }
}