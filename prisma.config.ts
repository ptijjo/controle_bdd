import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import * as path from 'path';


// Charge le .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  

});