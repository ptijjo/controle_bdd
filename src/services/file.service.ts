import { Service } from "typedi";
import fs from 'fs/promises';
import path from 'path';
import { HttpException } from '@/exceptions/httpException';

@Service()
export class DownloadFile { 

    public async downloadFile(): Promise<string > {
         //On récupère le nom du livre
        const filename = 'controle.xlsx';
        
         //Vérification du fichier sur le serveur
      // Utiliser process.cwd() pour être cohérent avec saveToExcel
      const filePath = path.join(process.cwd(), 'controle', filename);
      
      console.log('📥 Chemin du fichier à télécharger:', filePath);

          try {
      await fs.access(filePath);
      console.log('✅ Fichier trouvé');
    } catch (error) {
      console.error('❌ Fichier introuvable:', filePath);
      throw new HttpException(409, 'Fichier introuvable');
    }
        return filePath
    }
}