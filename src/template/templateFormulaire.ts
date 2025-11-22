import { CreateFormDto } from '@/dtos/forms.dto';

export const htmlFormulaire = (controleur: string, form: CreateFormDto): string => {
  return `
   <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 30px; }
          h2 { margin-top: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          p, td { font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          td, th { border: 1px solid #ccc; padding: 8px; }
          .label { font-weight: bold; width: 40%; background: #f9f9f9; }
          .signatures-container { display: flex; justify-content: space-around; gap: 20px; margin-top: 360px; }
          .signature { flex: 1; text-align: center; }
          .signature img { border: 1px solid #ccc; width: 200px; height: 100px; object-fit: contain; background: #fff; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Formulaire de Contrôle</h1>

        <h2>Environnement de contrôle</h2>
        <table>
          <tr><td class="label">Date</td><td>${form.date ? new Date(form.date).toLocaleDateString('fr-FR') : '-'}</td></tr>
          <tr><td class="label">Heure prévue</td><td>${form.heurePrevue || '-'}</td></tr>
          <tr><td class="label">Heure réelle</td><td>${form.heureReelle || '-'}</td></tr>
          <tr><td class="label">Lieu de contrôle</td><td>${form.lieuControle || '-'}</td></tr>
          <tr><td class="label">Météo</td><td>${form.meteo === 'beau' ? 'Beau temps' : form.meteo === 'pluvieux' ? 'Pluvieux' : '-'}</td></tr>
        </table>

        
        <h2>Information du Chauffeur</h2>
        <table>
          <tr><td class="label">Nom</td><td>${form.nom || '-'}</td></tr>
        </table>


        <h2>Équipement arrêt</h2>
        <table>
          <tr><td class="label">Fiche horaire à l'arrêt</td><td>${form.ficheHoraire || '-'}</td></tr>
          <tr><td class="label">Cadre d'affichage</td><td>${form.cadreAffichage || '-'}</td></tr>
          <tr><td class="label">État général</td><td>${form.etatGeneral || '-'}</td></tr>
          <tr><td class="label">Type arrêt</td><td>${form.typeArret || '-'}</td></tr>
          <tr><td class="label">Zébra</td><td>${form.zebra || '-'}</td></tr>
          <tr><td class="label">Observation arrêt</td><td>${form.observationArret || '-'}</td></tr>
        </table>

        <h2>Ligne de bus</h2>
        <table>
          <tr><td class="label">Client</td><td>${form.client || '-'}</td></tr>
          ${form.client === 'casas' && form.ligneCasas ? `<tr><td class="label">Ligne Casas</td><td>${form.ligneCasas}</td></tr>` : ''}
          ${form.client === 'casas' && form.ligneCasas === 'transavold' && form.numLigneTransavold ? `<tr><td class="label">N° Ligne Transavold</td><td>${form.numLigneTransavold}</td></tr>` : ''}
          ${form.client === 'casas' && form.ligneCasas === 'transchool' && form.numLigneTranschool ? `<tr><td class="label">N° Ligne Transchool</td><td>${form.numLigneTranschool}</td></tr>` : ''}
          
          ${form.client === 'rgeFluo57' && form.ligneRge ? `<tr><td class="label">Ligne RGE</td><td>${form.ligneRge}</td></tr>` : ''}
          ${form.client === 'rgeFluo57' && form.ligneRge === 'Lr' && form.numLigneRgeLr ? `<tr><td class="label">N° Ligne RGE LR</td><td>${form.numLigneRgeLr}</td></tr>` : ''}
          ${form.client === 'rgeFluo57' && form.ligneRge === 'Sa' && form.numLigneRgeSa ? `<tr><td class="label">N° Ligne RGE SA</td><td>${form.numLigneRgeSa}</td></tr>` : ''}
          ${form.client === 'rgeFluo57' && form.ligneRge === 'Sc' && form.numLigneRgeSc ? `<tr><td class="label">N° Ligne RGE SC</td><td>${form.numLigneRgeSc}</td></tr>` : ''}
          
          ${form.client === 'casc' && form.ligneCasc ? `<tr><td class="label">Ligne CASC</td><td>${form.ligneCasc}</td></tr>` : ''}
          ${form.client === 'casc' && form.ligneCasc === 'Lr' && form.numLigneCascLr ? `<tr><td class="label">N° Ligne CASC LR</td><td>${form.numLigneCascLr}</td></tr>` : ''}
          ${form.client === 'casc' && form.ligneCasc === 'Sa' && form.numLigneCascSA ? `<tr><td class="label">N° Ligne CASC SA</td><td>${form.numLigneCascSA}</td></tr>` : ''}
          ${form.client === 'casc' && form.ligneCasc === 'Sc' && form.numLigneCascSc ? `<tr><td class="label">N° Ligne CASC SC</td><td>${form.numLigneCascSc}</td></tr>` : ''}
        </table>

        <h2>Véhicule</h2>
        <table>
          <tr><td class="label">N° Parc</td><td>${form.parc || '-'}</td></tr>
          <tr><td class="label">Affichage destination</td><td>${form.affichageDestination || '-'}</td></tr>
          <tr><td class="label">Affichage N° Ligne</td><td>${form.affichageNumeroLigne || '-'}</td></tr>
          <tr><td class="label">Picto transport enfant</td><td>${form.pictoEnfant || '-'}</td></tr>
        </table>

        <h2>Équipement</h2>
        <table>
          <tr><td class="label">Tarif disponible / affichés</td><td>${form.tarifAffiche || '-'}</td></tr>
          <tr><td class="label">Dépliants horaires disponibles</td><td>${form.depliantHoraire || '-'}</td></tr>
          <tr><td class="label">Règlement</td><td>${form.reglement || '-'}</td></tr>
        </table>

        <h2>Conducteur</h2>
        <table>
          <tr><td class="label">Carrosserie</td><td>${form.carosserie || '-'}</td></tr>
          <tr><td class="label">Observation car</td><td>${form.observationCar || '-'}</td></tr>
        </table>

        <h2>Billetique</h2>
        <table>
          <tr><td class="label">Billetique électronique</td><td>${form.billetiqueElectronique || '-'}</td></tr>
          <tr><td class="label">Billetique manuelle</td><td>${form.billetiqueManuelle || '-'}</td></tr>
          <tr><td class="label">Fond de caisse</td><td>${form.fondDeCaisse || '-'}</td></tr>
        </table>

        <h2>Conditions de transport</h2>
        <table>
          <tr><td class="label">Tableau de bord</td><td>${form.tableauBord || '-'}</td></tr>
          <tr><td class="label">Sol</td><td>${form.sol || '-'}</td></tr>
          <tr><td class="label">Vitres</td><td>${form.vitres || '-'}</td></tr>
          <tr><td class="label">Sièges</td><td>${form.sieges || '-'}</td></tr>
          <tr><td class="label">Observations conditions véhicule</td><td>${form.observationConditionsVehicule || '-'}</td></tr>
        </table>

        <h2>Voyageurs</h2>
        <table>
          <tr><td class="label">Nombre de Voyageurs</td><td>${form.nbreVoyageur || '-'}</td></tr>
          <tr><td class="label">Nombre de Voyageurs irréguliers</td><td>${form.nbreVoyageurIrregulier || '-'}</td></tr>
        </table>

        <h2>Contrôleur</h2>
        <p>${controleur}</p>

        <h2>Signatures</h2>
        <div class="signatures-container">
          <div class="signature">
            <p><strong>Signature Chauffeur :</strong></p>
            <img src="${form.chauffeurSignature}" alt="Signature Chauffeur"/>
          </div>

          <div class="signature">
            <p><strong>Signature Contrôleur :</strong></p>
            <img src="${form.controllerSignature}" alt="Signature Contrôleur"/>
          </div>
        </div>
      </body>
    </html>`;
};
