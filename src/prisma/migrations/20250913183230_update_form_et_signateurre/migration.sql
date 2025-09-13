/*
  Warnings:

  - You are about to drop the `Form` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[formId,type]` on the table `Signature` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Form" DROP CONSTRAINT "Form_controleurId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Signature" DROP CONSTRAINT "Signature_formId_fkey";

-- DropTable
DROP TABLE "public"."Form";

-- CreateTable
CREATE TABLE "public"."forms" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forms_email_key" ON "public"."forms"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Signature_formId_type_key" ON "public"."Signature"("formId", "type");

-- AddForeignKey
ALTER TABLE "public"."forms" ADD CONSTRAINT "forms_controleurId_fkey" FOREIGN KEY ("controleurId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Signature" ADD CONSTRAINT "Signature_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
