/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `nom` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('controleur', 'chef_service', 'controle');

-- CreateEnum
CREATE TYPE "public"."TypeLigne" AS ENUM ('LR', 'SC', 'SA');

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'controle',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "public"."Form" (
    "id" TEXT NOT NULL,
    "dateControle" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "controleurId" TEXT NOT NULL,
    "numeroLigne" TEXT NOT NULL,
    "typeLigne" "public"."TypeLigne" NOT NULL,
    "lieuControle" TEXT NOT NULL,
    "heurePrevue" TIMESTAMP(3) NOT NULL,
    "heureReelle" TIMESTAMP(3) NOT NULL,
    "secteur" TEXT NOT NULL,
    "parc" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ficheHoraire" BOOLEAN,
    "respectItineraire" BOOLEAN,
    "affichageDestination" BOOLEAN,
    "affichageNumeroLigne" BOOLEAN,
    "pictoEnfant" BOOLEAN,
    "tarifAffiche" BOOLEAN,
    "depliantHoraire" BOOLEAN,
    "reglement" BOOLEAN,
    "tenue" BOOLEAN,
    "carosserie" BOOLEAN,
    "tableauBord" BOOLEAN,
    "sol" BOOLEAN,
    "temperature" BOOLEAN,
    "luminosite" BOOLEAN,
    "nbreVoyageur" INTEGER NOT NULL,
    "nbreVoyageurIrregulier" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Signature" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "controleurId" TEXT,
    "signataireNom" TEXT,
    "base64" TEXT NOT NULL,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_email_key" ON "public"."Form"("email");

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_controleurId_fkey" FOREIGN KEY ("controleurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Signature" ADD CONSTRAINT "Signature_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Signature" ADD CONSTRAINT "Signature_controleurId_fkey" FOREIGN KEY ("controleurId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
