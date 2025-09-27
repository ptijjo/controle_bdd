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
          .signature img { border: 1px solid #ccc; width: 200px; height: 100px; object-fit: contain; background: #fff; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Formulaire de Contrôle</h1>

        <h2>Environnement de contrôle</h2>
        <table>
          <tr><td class="label">Date</td><td>${form.date || '-'}</td></tr>
          <tr><td class="label">N° de Ligne</td><td>${form.numeroLigne || '-'}</td></tr>
          <tr><td class="label">Type de Ligne</td><td>${form.typeLigne || '-'}</td></tr>
          <tr><td class="label">Heure prévue</td><td>${form.heurePrevue || '-'}</td></tr>
          <tr><td class="label">Heure réelle</td><td>${form.heureReelle || '-'}</td></tr>
        </table>

        <h2>Information du Chauffeur</h2>
        <table>
          <tr><td class="label">Nom</td><td>nom</td></tr>
          <tr><td class="label">Prénom</td><td>prenom}</td></tr>
          <tr><td class="label">Email</td><td>${form.email || '-'}</td></tr>
        </table>

        <h2>Équipement arrêt</h2>
        <table>
          <tr><td class="label">Fiche horaire à l'arrêt</td><td>ficheHoraire</td></tr>
        </table>

        <h2>Véhicule</h2>
        <table>
          <tr><td class="label">Respect arrêt itinéraire</td><td>respectItineraire}</td></tr>
          <tr><td class="label">Affichage destination</td><td>affichageDestination</td></tr>
          <tr><td class="label">Affichage N° Ligne</td><td>affichageNumeroLigne</td></tr>
          <tr><td class="label">Picto transport enfant</td><td>pictoEnfant</td></tr>
        </table>

        <h2>Équipement</h2>
        <table>
          <tr><td class="label">Tarif disponible / affichés</td><td>tarifAffiche</td></tr>
          <tr><td class="label">Dépliants horaires disponibles</td><td>depliantHoraire</td></tr>
          <tr><td class="label">Règlement</td><td>reglement</td></tr>
        </table>

        <h2>Conducteur</h2>
        <table>
          <tr><td class="label">Tenue</td><td>tenue</td></tr>
          <tr><td class="label">Carrosserie</td><td>carosserie</td></tr>
          <tr><td class="label">Tableau de bord</td><td>tableauBord</td></tr>
          <tr><td class="label">Sol</td><td>sol</td></tr>
        </table>

        <h2>Confort</h2>
        <table>
          <tr><td class="label">Température</td><td>temperature</td></tr>
          <tr><td class="label">Luminosité</td><td>luminosite</td></tr>
        </table>

        <h2>Voyageurs</h2>
        <table>
          <tr><td class="label">Nombre de Voyageurs</td><td>nbreVoyageur</td></tr>
          <tr><td class="label">Nombre de Voyageurs irréguliers</td><td>nbreVoyageurIrregulier</td></tr>
        </table>

        <h2>Observation</h2>
        <p>'Aucune observation'</p>

        <h2>Contrôleur</h2>
        <p>${controleur}</p>

        <h2>Signatures</h2>
        <div class="signature">
          <p><strong>Signature Chauffeur :</strong></p>
          <img src="${form.chauffeurSignature}" alt="Signature Chauffeur"/>
        </div>

        <div class="signature">
          <p><strong>Signature Contrôleur :</strong></p>
          <img src="${form.controllerSignature}" alt="Signature Contrôleur"/>
        </div>
      </body>
    </html>`;
};
