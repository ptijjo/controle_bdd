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
      const filePath = path.join(__dirname, '..', '..', 'controle', filename);
      
      console.log(filePath)

          try {
      await fs.access(filePath);
    } catch (error) {
      throw new HttpException(409, 'Fichier introuvable');
    }
        return filePath
    }
}