import { CreateFormDto } from '@/dtos/forms.dto';
import { escapeHtml } from '@/utils/htmlEscape';

function cell(v: string | number | undefined | null): string {
  if (v === undefined || v === null || v === '') return '-';
  return escapeHtml(v);
}

export const htmlFormulaire = (controleur: string, form: CreateFormDto): string => {
  const ctrl = escapeHtml(controleur);
  return `
   <!DOCTYPE html>
      <html>
      <head></head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 10mm; }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11px;
            padding: 5px;
            margin: 0;
          }
          h1 { 
            text-align: center; 
            margin: 5px 0 10px 0;
            font-size: 18px;
          }
          h2 { 
            margin-top: 8px;
            margin-bottom: 4px;
            color: #333; 
            border-bottom: 1px solid #ddd; 
            padding-bottom: 2px;
            font-size: 12px;
            page-break-inside: avoid;
          }
          p, td { font-size: 10px; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 3px;
            margin-bottom: 5px;
            page-break-inside: avoid;
          }
          td, th { 
            border: 1px solid #ccc; 
            padding: 4px 6px;
            font-size: 10px;
          }
          .label { 
            font-weight: bold; 
            width: 35%; 
            background: #f9f9f9; 
          }
          .two-columns {
            display: flex;
            gap: 10px;
            margin-top: 5px;
            margin-bottom: 5px;
          }
          .column {
            flex: 1;
          }
          .signatures-container { 
            display: flex; 
            justify-content: space-around; 
            gap: 20px; 
            margin-top: 15px;
            page-break-inside: avoid;
          }
          .signature { 
            flex: 1; 
            text-align: center;
          }
          .signature p {
            margin: 5px 0;
            font-size: 10px;
          }
          .signature img { 
            border: 1px solid #ccc; 
            width: 150px; 
            height: 60px; 
            object-fit: contain; 
            background: #fff; 
            margin-top: 5px;
          }
          .compact-table {
            margin-top: 2px;
            margin-bottom: 3px;
          }
          .compact-table td {
            padding: 3px 5px;
          }
        </style>
      </head>
      <body>
        <h1>Formulaire de Contrôle</h1>

        <div class="two-columns">
          <div class="column">
            <h2>Environnement de contrôle</h2>
            <table class="compact-table">
              <tr><td class="label">Date</td><td>${form.date ? new Date(form.date).toLocaleDateString('fr-FR') : '-'}</td></tr>
              <tr><td class="label">Heure prévue</td><td>${cell(form.heurePrevue)}</td></tr>
              <tr><td class="label">Heure réelle</td><td>${cell(form.heureReelle)}</td></tr>
              <tr><td class="label">Lieu</td><td>${cell(form.lieuControle)}</td></tr>
              <tr><td class="label">Météo</td><td>${form.meteo === 'beau' ? 'Beau' : form.meteo === 'pluvieux' ? 'Pluvieux' : '-'}</td></tr>
              <tr><td class="label">Car non passé</td><td>${form.carNonPasse ? 'Oui' : 'Non'}</td></tr>
            </table>
          </div>
          <div class="column">
            <h2>Chauffeur</h2>
            <table class="compact-table">
              ${
                form.carNonPasse
                  ? `<tr><td colspan="2" style="font-style: italic; color: #555; background: #fafafa;">Non applicable — car non passé au point de contrôle (aucun conducteur identifié).</td></tr>`
                  : `<tr><td class="label">Nom</td><td>${cell(form.nom)}</td></tr>
              <tr><td class="label">Prénom</td><td>${cell(form.prenom)}</td></tr>
              ${form.email ? `<tr><td class="label">Email</td><td>${escapeHtml(form.email)}</td></tr>` : ''}`
              }
            </table>
          </div>
        </div>

        <h2>Équipement arrêt</h2>
        <table class="compact-table">
          <tr><td class="label">Fiche horaire</td><td>${cell(form.ficheHoraire)}</td></tr>
          <tr><td class="label">Cadre affichage</td><td>${cell(form.cadreAffichage)}</td></tr>
          <tr><td class="label">État général</td><td>${cell(form.etatGeneral)}</td></tr>
          <tr><td class="label">Type arrêt</td><td>${cell(form.typeArret)}</td></tr>
          <tr><td class="label">Zébra</td><td>${cell(form.zebra)}</td></tr>
          ${form.observationArret ? `<tr><td class="label">Observation arrêt</td><td>${escapeHtml(form.observationArret)}</td></tr>` : ''}
        </table>

        <h2>Ligne de bus</h2>
        <table class="compact-table">
          <tr><td class="label">Client</td><td>${cell(form.client)}</td></tr>
          ${form.client === 'casas' && form.ligneCasas ? `<tr><td class="label">Ligne Casas</td><td>${escapeHtml(form.ligneCasas)}</td></tr>` : ''}
          ${form.client === 'casas' && form.ligneCasas === 'transavold' && form.numLigneTransavold ? `<tr><td class="label">N° Ligne Transavold</td><td>${escapeHtml(form.numLigneTransavold)}</td></tr>` : ''}
          ${form.client === 'casas' && form.ligneCasas === 'transchool' && form.numLigneTranschool ? `<tr><td class="label">N° Ligne Transchool</td><td>${escapeHtml(form.numLigneTranschool)}</td></tr>` : ''}
          
          ${form.client === 'rgeFluo57' && form.ligneRge ? `<tr><td class="label">Ligne RGE</td><td>${escapeHtml(form.ligneRge)}</td></tr>` : ''}
          ${form.client === 'rgeFluo57' && form.ligneRge === 'Lr' && form.numLigneRgeLr ? `<tr><td class="label">N° Ligne RGE LR</td><td>${escapeHtml(form.numLigneRgeLr)}</td></tr>` : ''}
          ${form.client === 'rgeFluo57' && form.ligneRge === 'Sa' && form.numLigneRgeSa ? `<tr><td class="label">N° Ligne RGE SA</td><td>${escapeHtml(form.numLigneRgeSa)}</td></tr>` : ''}
          ${form.client === 'rgeFluo57' && form.ligneRge === 'Sc' && form.numLigneRgeSc ? `<tr><td class="label">N° Ligne RGE SC</td><td>${escapeHtml(form.numLigneRgeSc)}</td></tr>` : ''}
          
          ${form.client === 'casc' && form.ligneCasc ? `<tr><td class="label">Ligne CASC</td><td>${escapeHtml(form.ligneCasc)}</td></tr>` : ''}
          ${form.client === 'casc' && form.ligneCasc === 'Lr' && form.numLigneCascLr ? `<tr><td class="label">N° Ligne CASC LR</td><td>${escapeHtml(form.numLigneCascLr)}</td></tr>` : ''}
          ${form.client === 'casc' && form.ligneCasc === 'Sa' && form.numLigneCascSA ? `<tr><td class="label">N° Ligne CASC SA</td><td>${escapeHtml(form.numLigneCascSA)}</td></tr>` : ''}
          ${form.client === 'casc' && form.ligneCasc === 'Sc' && form.numLigneCascSc ? `<tr><td class="label">N° Ligne CASC SC</td><td>${escapeHtml(form.numLigneCascSc)}</td></tr>` : ''}
        </table>

        <div class="two-columns">
          <div class="column">
            <h2>Véhicule</h2>
            <table class="compact-table">
              <tr><td class="label">N° Parc</td><td>${cell(form.parc)}</td></tr>
              <tr><td class="label">Affichage destination</td><td>${cell(form.affichageDestination)}</td></tr>
              <tr><td class="label">Affichage N° Ligne</td><td>${cell(form.affichageNumeroLigne)}</td></tr>
              <tr><td class="label">Picto enfant</td><td>${cell(form.pictoEnfant)}</td></tr>
            </table>
          </div>
          <div class="column">
            <h2>Équipement</h2>
            <table class="compact-table">
              <tr><td class="label">Tarif affiché</td><td>${cell(form.tarifAffiche)}</td></tr>
              <tr><td class="label">Dépliants horaires</td><td>${cell(form.depliantHoraire)}</td></tr>
              <tr><td class="label">Règlement</td><td>${cell(form.reglement)}</td></tr>
            </table>
          </div>
        </div>

        <div class="two-columns">
          <div class="column">
            <h2>Carosserie</h2>
            <table class="compact-table">
              <tr><td class="label">Carrosserie</td><td>${cell(form.carosserie)}</td></tr>
              ${form.observationCar ? `<tr><td class="label">Observation car</td><td>${escapeHtml(form.observationCar)}</td></tr>` : ''}
            </table>
          </div>
          <div class="column">
            <h2>Voyageurs</h2>
            <table class="compact-table">
              <tr><td class="label">Nb Voyageurs</td><td>${cell(form.nbreVoyageur)}</td></tr>
              <tr><td class="label">Nb Irréguliers</td><td>${cell(form.nbreVoyageurIrregulier)}</td></tr>
            </table>
          </div>
        </div>

        <h2>Billetique</h2>
        <table class="compact-table">
          <tr><td class="label">Billetique électronique</td><td>${form.billetiqueElectronique || '-'}</td></tr>
          <tr><td class="label">Billetique manuelle</td><td>${form.billetiqueManuelle || '-'}</td></tr>
          <tr><td class="label">Fond de caisse</td><td>${form.fondDeCaisse || '-'}</td></tr>
          ${form.observationBilletique ? `<tr><td class="label">Observation billetique</td><td>${form.observationBilletique}</td></tr>` : ''}
        </table>

        <h2>Conditions de transport</h2>
        <table class="compact-table">
          <tr><td class="label">Tableau de bord</td><td>${cell(form.tableauBord)}</td></tr>
          <tr><td class="label">Sol</td><td>${cell(form.sol)}</td></tr>
          <tr><td class="label">Vitres</td><td>${cell(form.vitres)}</td></tr>
          <tr><td class="label">Sièges</td><td>${cell(form.sieges)}</td></tr>
          ${form.observationConditionsVehicule ? `<tr><td class="label">Observations véhicule</td><td>${escapeHtml(form.observationConditionsVehicule)}</td></tr>` : ''}
        </table>

        <div class="two-columns" style="margin-top: 10px;">
          <div class="column">
            <p><strong>Contrôleur :</strong> ${ctrl}</p>
          </div>
        </div>

        ${
          form.carNonPasse
            ? `<div style="margin-top: 16px; padding: 10px; border: 1px solid #c00; background: #fff5f5;">
            <p style="margin: 0; font-weight: bold; color: #a00;">Car non passé au point de contrôle</p>
            <p style="margin: 6px 0 0 0;">Aucune signature chauffeur ni contrôleur n'a été recueillie (véhicule absent).</p>
          </div>`
            : `<h2>Signatures</h2>
        <div class="signatures-container">
          <div class="signature">
            <p><strong>Signature Chauffeur</strong></p>
            <img src="${form.chauffeurSignature}" alt="Signature Chauffeur"/>
          </div>
          <div class="signature">
            <p><strong>Signature Contrôleur</strong></p>
            <img src="${form.controllerSignature}" alt="Signature Contrôleur"/>
          </div>
        </div>`
        }
      </body>
    </html>`;
};
