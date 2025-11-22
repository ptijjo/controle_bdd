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
          .signatures-container { display: flex; justify-content: space-around; gap: 20px; margin-top: 20px; }
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
          <tr><td class="label">Prénom</td><td>${form.prenom || '-'}</td></tr>
          <tr><td class="label">Email</td><td>${form.email || '-'}</td></tr>
        </table>


        <h2>Équipement arrêt</h2>
        <table>
          <tr><td class="label">Fiche horaire à l'arrêt</td><td>${form.ficheHoraire ? '✓ Oui' : '✗ Non'}</td></tr>
          <tr><td class="label">Panneau arrêt</td><td>${form.panneauArret ? '✓ Oui' : '✗ Non'}</td></tr>
          <tr><td class="label">Nom de l'arrêt</td><td>${form.nomArret || '-'}</td></tr>
        </table>

        <h2>Ligne de bus</h2>
        <table>
          <tr><td class="label">N° de Ligne</td><td>${form.numeroLigne || '-'}</td></tr>
          <tr><td class="label">Client</td><td>${form.client || '-'}</td></tr>
          ${form.ligneCasas ? `<tr><td class="label">Ligne Casas</td><td>${form.ligneCasas}</td></tr>` : ''}
          ${form.ligneRge ? `<tr><td class="label">Ligne RGE</td><td>${form.ligneRge}</td></tr>` : ''}
          ${form.ligneCasc ? `<tr><td class="label">Ligne CASC</td><td>${form.ligneCasc}</td></tr>` : ''}
          ${form.numLigneCascLr ? `<tr><td class="label">N° Ligne CASC LR</td><td>${form.numLigneCascLr}</td></tr>` : ''}
          ${form.numLigneCascSA ? `<tr><td class="label">N° Ligne CASC SA</td><td>${form.numLigneCascSA}</td></tr>` : ''}
          ${form.numLigneCascSc ? `<tr><td class="label">N° Ligne CASC SC</td><td>${form.numLigneCascSc}</td></tr>` : ''}
          ${form.numLigneRgeLr ? `<tr><td class="label">N° Ligne RGE LR</td><td>${form.numLigneRgeLr}</td></tr>` : ''}
          ${form.numLigneRgeSa ? `<tr><td class="label">N° Ligne RGE SA</td><td>${form.numLigneRgeSa}</td></tr>` : ''}
          ${form.numLigneRgeSc ? `<tr><td class="label">N° Ligne RGE SC</td><td>${form.numLigneRgeSc}</td></tr>` : ''}
          ${form.numLigneTransavold ? `<tr><td class="label">N° Ligne Transavold</td><td>${form.numLigneTransavold}</td></tr>` : ''}
          ${form.numLigneTranschool ? `<tr><td class="label">N° Ligne Transchool</td><td>${form.numLigneTranschool}</td></tr>` : ''}
        </table>

        <h2>Véhicule</h2>
        <table>
          <tr><td class="label">N° Parc</td><td>${form.parc || '-'}</td></tr>
          <tr><td class="label">Respect arrêt itinéraire</td><td>${form.respectItineraire ? '✓ Oui' : '✗ Non'}</td></tr>
          <tr><td class="label">Affichage destination</td><td>${form.affichageDestination ? '✓ Oui' : '✗ Non'}</td></tr>
          <tr><td class="label">Affichage N° Ligne</td><td>${form.affichageNumeroLigne ? '✓ Oui' : '✗ Non'}</td></tr>
          <tr><td class="label">Picto transport enfant</td><td>${form.pictoEnfant ? '✓ Oui' : '✗ Non'}</td></tr>
        </table>

        <h2>Équipement</h2>
        <table>
          <tr><td class="label">Tarif disponible / affichés</td><td>${form.tarifAffiche ? '✓ Oui' : '✗ Non'}</td></tr>
          <tr><td class="label">Dépliants horaires disponibles</td><td>${form.depliantHoraire ? '✓ Oui' : '✗ Non'}</td></tr>
          <tr><td class="label">Règlement</td><td>${form.reglement ? '✓ Oui' : '✗ Non'}</td></tr>
        </table>

        <h2>Conducteur</h2>
        <table>
          <tr><td class="label">Tenue</td><td>${form.tenue ? '✓ Conforme' : '✗ Non conforme'}</td></tr>
          <tr><td class="label">Carrosserie</td><td>${form.carosserie ? '✓ Propre' : '✗ Sale'}</td></tr>
          <tr><td class="label">Tableau de bord</td><td>${form.tableauBord ? '✓ Propre' : '✗ Sale'}</td></tr>
          <tr><td class="label">Sol</td><td>${form.sol ? '✓ Propre' : '✗ Sale'}</td></tr>
        </table>

        <h2>Confort</h2>
        <table>
          <tr><td class="label">Température</td><td>${form.temperature ? '✓ Correcte' : '✗ Non correcte'}</td></tr>
          <tr><td class="label">Luminosité</td><td>${form.luminosite ? '✓ Correcte' : '✗ Non correcte'}</td></tr>
          <tr><td class="label">Observations conditions</td><td>${form.observationConditions || '-'}</td></tr>
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
