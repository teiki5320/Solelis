// SCRIPT OBSOLÈTE — NE PAS RELANCER EN L'ÉTAT.
// Les données URSSAF / CGSS de data/organismes.json ont été vérifiées à la main
// (annuaire service-public, sites des organismes) en octobre 2026. Les valeurs
// ci-dessous datent de mai 2026 : relancer ce script réintroduirait d'anciennes
// adresses, d'anciens noms et d'anciens numéros. Mettre à jour le script avant
// toute nouvelle utilisation.
console.error(
  "Script obsolète : les données URSSAF / CGSS de data/organismes.json ont été vérifiées à la main en octobre 2026. " +
    'Ne relancez pas ce script sans l’avoir mis à jour (il réintroduirait d’anciennes données).',
);
process.exit(1);

// Mise à jour des URSSAF départementales (sites) par département.
// Données collectées via urssaf.fr + annuaire-administration.com (28/05/2026).
// Téléphone : 3957 partout (numéro national), sauf CGSS DOM.
// Lancement : node scripts/update-urssaf.js

const fs = require('fs');
const path = require('path');

const URSSAF = {
  "01": { nom: "URSSAF Rhône-Alpes - site de l'Ain", adresse: "4 rue Paul Pieyre, 01000 Bourg-en-Bresse", telephone: "3957" },
  "02": { nom: "URSSAF Picardie - site de l'Aisne", adresse: "8 rue Suzanne Lacore, 02100 Saint-Quentin", telephone: "3957" },
  "03": { nom: "URSSAF Auvergne - site de l'Allier", adresse: "13 rue Maurice Coulaudon, 03000 Moulins", telephone: "3957" },
  "04": { nom: "URSSAF PACA - site des Alpes-de-Hte-Provence", adresse: "Avenue Demontzey, 04000 Digne-les-Bains", telephone: "3957" },
  "05": { nom: "URSSAF PACA - site des Hautes-Alpes", adresse: "24 avenue du Commandant Dumont, 05000 Gap", telephone: "3957" },
  "06": { nom: "URSSAF PACA - site des Alpes-Maritimes", adresse: "Le Capitole, 25 boulevard Paul Montel, 06200 Nice", telephone: "3957" },
  "07": { nom: "URSSAF Rhône-Alpes - site de l'Ardèche", adresse: "11 rue Auguste Majoral, 07000 Privas", telephone: "3957" },
  "08": { nom: "URSSAF Champagne-Ardenne - site des Ardennes", adresse: "18 avenue Georges Corneau, 08000 Charleville-Mézières", telephone: "3957" },
  "09": { nom: "URSSAF Midi-Pyrénées - site de l'Ariège", adresse: "9 rue du Lieutenant Paul Delpech, 09000 Foix", telephone: "3957" },
  "10": { nom: "URSSAF Champagne-Ardenne - site de l'Aube", adresse: "2 rue Dominique Larrey, 10000 Troyes", telephone: "3957" },
  "11": { nom: "URSSAF Languedoc-Roussillon - site de l'Aude", adresse: "26 boulevard Jean Jaurès, 11000 Carcassonne", telephone: "3957" },
  "12": { nom: "URSSAF Midi-Pyrénées - site de l'Aveyron", adresse: "10 rue de Bruxelles, 12000 Rodez", telephone: "3957" },
  "13": { nom: "URSSAF PACA - site des Bouches-du-Rhône", adresse: "Le Marseillais, 10 place de la Joliette, 13002 Marseille", telephone: "3957" },
  "14": { nom: "URSSAF Basse-Normandie - site du Calvados", adresse: "1 place Saint-Clair, 14911 Caen Cedex 9", telephone: "3957" },
  "15": { nom: "URSSAF Auvergne - site du Cantal", adresse: "5 avenue Anatole France, 15000 Aurillac", telephone: "3957" },
  "16": { nom: "URSSAF Poitou-Charentes - site de la Charente", adresse: "60 rue du Général Leclerc, 16000 Angoulême", telephone: "3957" },
  "17": { nom: "URSSAF Poitou-Charentes - site de la Charente-Mar.", adresse: "23 avenue Albert Einstein, 17000 La Rochelle", telephone: "3957" },
  "18": { nom: "URSSAF Centre - site du Cher", adresse: "Cité Administrative Condé, route de Guerry, 18000 Bourges", telephone: "3957" },
  "19": { nom: "URSSAF Limousin - site de la Corrèze", adresse: "5 rue Souham, 19000 Tulle", telephone: "3957" },
  "21": { nom: "URSSAF Bourgogne - site de la Côte-d'Or", adresse: "8 boulevard Clemenceau, 21000 Dijon", telephone: "3957" },
  "22": { nom: "URSSAF Bretagne - site des Côtes-d'Armor", adresse: "9 rue de Robien, 22000 Saint-Brieuc", telephone: "3957" },
  "23": { nom: "URSSAF Limousin - site de la Creuse", adresse: "12 rue Alexandre Guillon, 23000 Guéret", telephone: "3957" },
  "24": { nom: "URSSAF Aquitaine - site de la Dordogne", adresse: "50 rue Claude Bernard, 24000 Périgueux", telephone: "3957" },
  "25": { nom: "URSSAF Franche-Comté - site du Doubs", adresse: "5 rue Sophie Germain, 25000 Besançon", telephone: "3957" },
  "26": { nom: "URSSAF Rhône-Alpes - site de la Drôme", adresse: "47 avenue Maurice Faure, 26000 Valence", telephone: "3957" },
  "27": { nom: "URSSAF Haute-Normandie - site de l'Eure", adresse: "8 rue de la Petite Cité, 27000 Évreux", telephone: "3957" },
  "28": { nom: "URSSAF Centre - site d'Eure-et-Loir", adresse: "5 rue Charles Coulomb, 28000 Chartres", telephone: "3957" },
  "29": { nom: "URSSAF Bretagne - site du Finistère", adresse: "7 rue Turgot, 29200 Brest", telephone: "3957" },
  "2A": { nom: "URSSAF Corse - site de Corse-du-Sud", adresse: "Imm. Castellani, avenue du Mont Thabor, 20000 Ajaccio", telephone: "3957" },
  "2B": { nom: "URSSAF Corse - site de Haute-Corse", adresse: "Rés. Le Mantinum, avenue Jean Zuccarelli, 20200 Bastia", telephone: "3957" },
  "30": { nom: "URSSAF Languedoc-Roussillon - site du Gard", adresse: "495 rue Jean-François Champollion, 30900 Nîmes", telephone: "3957" },
  "31": { nom: "URSSAF Midi-Pyrénées - site de la Haute-Garonne", adresse: "78 allée Jean Jaurès, 31000 Toulouse", telephone: "3957" },
  "32": { nom: "URSSAF Midi-Pyrénées - site du Gers", adresse: "3 place de l'Ancien Foirail, 32000 Auch", telephone: "3957" },
  "33": { nom: "URSSAF Aquitaine - site de la Gironde", adresse: "3 rue Théodore Blanc, 33049 Bordeaux Cedex", telephone: "3957" },
  "34": { nom: "URSSAF Languedoc-Roussillon - site de l'Hérault", adresse: "29 cours Gambetta, 34000 Montpellier", telephone: "3957" },
  "35": { nom: "URSSAF Bretagne - site d'Ille-et-Vilaine", adresse: "Cité de l'Agriculture, rue Maurice Le Lannou, 35000 Rennes", telephone: "3957" },
  "36": { nom: "URSSAF Centre - site de l'Indre", adresse: "26 avenue Pierre de Coubertin, 36000 Châteauroux", telephone: "3957" },
  "37": { nom: "URSSAF Centre - site d'Indre-et-Loire", adresse: "8 rue Pierre Boille, 37000 Tours", telephone: "3957" },
  "38": { nom: "URSSAF Rhône-Alpes - site de l'Isère", adresse: "7 place Firmin Gautier, 38000 Grenoble", telephone: "3957" },
  "39": { nom: "URSSAF Franche-Comté - site du Jura", adresse: "Cité administrative, 8 rue de la Préfecture, 39000 Lons-le-Saunier", telephone: "3957" },
  "40": { nom: "URSSAF Aquitaine - site des Landes", adresse: "350 avenue du Maréchal Foch, 40000 Mont-de-Marsan", telephone: "3957" },
  "41": { nom: "URSSAF Centre - site du Loir-et-Cher", adresse: "9 rue Louis Armand, 41000 Blois", telephone: "3957" },
  "42": { nom: "URSSAF Rhône-Alpes - site de la Loire", adresse: "6 rue Robert Schuman, 42000 Saint-Étienne", telephone: "3957" },
  "43": { nom: "URSSAF Auvergne - site de la Haute-Loire", adresse: "8 rue Étienne Delcambre, 43000 Le Puy-en-Velay", telephone: "3957" },
  "44": { nom: "URSSAF Pays de la Loire - site de la Loire-Atlantique", adresse: "7 rue du Président Édouard Herriot, 44000 Nantes", telephone: "3957" },
  "45": { nom: "URSSAF Centre - site du Loiret", adresse: "4 rue Robert Schuman, 45000 Orléans", telephone: "3957" },
  "46": { nom: "URSSAF Midi-Pyrénées - site du Lot", adresse: "304 rue Victor Hugo, 46000 Cahors", telephone: "3957" },
  "47": { nom: "URSSAF Aquitaine - site de Lot-et-Garonne", adresse: "1 rue Sylvain Dumon, 47000 Agen", telephone: "3957" },
  "48": { nom: "URSSAF Languedoc-Roussillon - site de la Lozère", adresse: "1 rue de la Rovère, 48000 Mende", telephone: "3957" },
  "49": { nom: "URSSAF Pays de la Loire - site de Maine-et-Loire", adresse: "2 rue Eugène Brémond, 49000 Angers", telephone: "3957" },
  "50": { nom: "URSSAF Basse-Normandie - site de la Manche", adresse: "453 rue de l'Exode, 50000 Saint-Lô", telephone: "3957" },
  "51": { nom: "URSSAF Champagne-Ardenne - site de la Marne", adresse: "202 rue des Capucins, 51100 Reims", telephone: "3957" },
  "52": { nom: "URSSAF Champagne-Ardenne - site de la Haute-Marne", adresse: "16 rue Decrès, 52000 Chaumont", telephone: "3957" },
  "53": { nom: "URSSAF Pays de la Loire - site de la Mayenne", adresse: "60 rue Mac Donald, 53000 Laval", telephone: "3957" },
  "54": { nom: "URSSAF Lorraine - site de Meurthe-et-Moselle", adresse: "9 boulevard Joffre, 54000 Nancy", telephone: "3957" },
  "55": { nom: "URSSAF Lorraine - site de la Meuse", adresse: "11 rue Antoine Durenne, 55000 Bar-le-Duc", telephone: "3957" },
  "56": { nom: "URSSAF Bretagne - site du Morbihan", adresse: "32 boulevard de la Résistance, 56000 Vannes", telephone: "3957" },
  "57": { nom: "URSSAF Lorraine - site de la Moselle", adresse: "30 rue du Doyen Parisot, 57000 Metz", telephone: "3957" },
  "58": { nom: "URSSAF Bourgogne - site de la Nièvre", adresse: "29 rue Émile Combes, 58000 Nevers", telephone: "3957" },
  "59": { nom: "URSSAF Nord-Pas-de-Calais - site du Nord", adresse: "293 avenue du Président Hoover, 59032 Lille Cedex", telephone: "3957" },
  "60": { nom: "URSSAF Picardie - site de l'Oise", adresse: "12 rue de l'Étoile, 60000 Beauvais", telephone: "3957" },
  "61": { nom: "URSSAF Basse-Normandie - site de l'Orne", adresse: "12 rue Cazault, 61000 Alençon", telephone: "3957" },
  "62": { nom: "URSSAF Nord-Pas-de-Calais - site du Pas-de-Calais", adresse: "Centre administratif, rue de Jérusalem, 62000 Arras", telephone: "3957" },
  "63": { nom: "URSSAF Auvergne - site du Puy-de-Dôme", adresse: "8 rue Hippolyte Renoux, 63000 Clermont-Ferrand", telephone: "3957" },
  "64": { nom: "URSSAF Aquitaine - site des Pyrénées-Atl.", adresse: "29 cours Léon Bérard, 64000 Pau", telephone: "3957" },
  "65": { nom: "URSSAF Midi-Pyrénées - site des Hautes-Pyrénées", adresse: "Place Ferré, 65000 Tarbes", telephone: "3957" },
  "66": { nom: "URSSAF Languedoc-Roussillon - site des Pyr.-Or.", adresse: "1 rue Joseph Sauvy, 66000 Perpignan", telephone: "3957" },
  "67": { nom: "URSSAF Alsace - site du Bas-Rhin", adresse: "16 rue Contades, 67300 Schiltigheim", telephone: "3957" },
  "68": { nom: "URSSAF Alsace - site du Haut-Rhin", adresse: "26 avenue Robert Schuman, 68100 Mulhouse", telephone: "3957" },
  "69": { nom: "URSSAF Rhône-Alpes - site du Rhône", adresse: "Le Var, 6 rue du 19 mars 1962, 69691 Vénissieux Cedex", telephone: "3957" },
  "70": { nom: "URSSAF Franche-Comté - site de la Haute-Saône", adresse: "5 rue Paul Morel, 70000 Vesoul", telephone: "3957" },
  "71": { nom: "URSSAF Bourgogne - site de Saône-et-Loire", adresse: "57 rue de la Coupée, 71850 Charnay-lès-Mâcon", telephone: "3957" },
  "72": { nom: "URSSAF Pays de la Loire - site de la Sarthe", adresse: "177 avenue Bollée, 72000 Le Mans", telephone: "3957" },
  "73": { nom: "URSSAF Rhône-Alpes - site de la Savoie", adresse: "20 avenue Jean Jaurès, 73000 Chambéry", telephone: "3957" },
  "74": { nom: "URSSAF Rhône-Alpes - site de la Haute-Savoie", adresse: "2 avenue de la Plaine, 74000 Annecy", telephone: "3957" },
  "75": { nom: "URSSAF Île-de-France - site de Paris", adresse: "22 rue de Lagny, 93108 Montreuil Cedex", telephone: "3957" },
  "76": { nom: "URSSAF Haute-Normandie - site de la Seine-Maritime", adresse: "70 rue Stanislas Girardin, 76000 Rouen", telephone: "3957" },
  "77": { nom: "URSSAF Île-de-France - site de Seine-et-Marne", adresse: "1 rue de la Croix Saint-Marc, 77000 Melun", telephone: "3957" },
  "78": { nom: "URSSAF Île-de-France - site des Yvelines", adresse: "16 avenue de Saint-Cloud, 78000 Versailles", telephone: "3957" },
  "79": { nom: "URSSAF Poitou-Charentes - site des Deux-Sèvres", adresse: "30 rue de l'Hôtel de Ville, 79000 Niort", telephone: "3957" },
  "80": { nom: "URSSAF Picardie - site de la Somme", adresse: "8 rue de l'Île de France, 80000 Amiens", telephone: "3957" },
  "81": { nom: "URSSAF Midi-Pyrénées - site du Tarn", adresse: "11 rue Justin Alibert, 81000 Albi", telephone: "3957" },
  "82": { nom: "URSSAF Midi-Pyrénées - site de Tarn-et-Garonne", adresse: "120 avenue Marceau Hamecher, 82000 Montauban", telephone: "3957" },
  "83": { nom: "URSSAF PACA - site du Var", adresse: "Le Grand Var, 309 avenue des Caroubiers, 83160 La Valette-du-Var", telephone: "3957" },
  "84": { nom: "URSSAF PACA - site de Vaucluse", adresse: "5 rue François 1er, 84000 Avignon", telephone: "3957" },
  "85": { nom: "URSSAF Pays de la Loire - site de la Vendée", adresse: "37 rue du Maréchal Joffre, 85000 La Roche-sur-Yon", telephone: "3957" },
  "86": { nom: "URSSAF Poitou-Charentes - site de la Vienne", adresse: "75 rue de la Cathédrale, 86000 Poitiers", telephone: "3957" },
  "87": { nom: "URSSAF Limousin - site de la Haute-Vienne", adresse: "31 rue Cruveilhier, 87000 Limoges", telephone: "3957" },
  "88": { nom: "URSSAF Lorraine - site des Vosges", adresse: "2 rue Grennevo, 88000 Épinal", telephone: "3957" },
  "89": { nom: "URSSAF Bourgogne - site de l'Yonne", adresse: "6 rue Monge, 89000 Auxerre", telephone: "3957" },
  "90": { nom: "URSSAF Franche-Comté - site du Territoire-de-Belfort", adresse: "12 rue de Madrid, 90000 Belfort", telephone: "3957" },
  "91": { nom: "URSSAF Île-de-France - site de l'Essonne", adresse: "Boulevard de France, 91000 Évry-Courcouronnes", telephone: "3957" },
  "92": { nom: "URSSAF Île-de-France - site des Hauts-de-Seine", adresse: "147 avenue Pierre Brossolette, 92240 Malakoff", telephone: "3957" },
  "93": { nom: "URSSAF Île-de-France - site de Seine-Saint-Denis", adresse: "22 rue de Lagny, 93108 Montreuil Cedex", telephone: "3957" },
  "94": { nom: "URSSAF Île-de-France - site du Val-de-Marne", adresse: "12 rue Georges Enesco, 94025 Créteil Cedex", telephone: "3957" },
  "95": { nom: "URSSAF Île-de-France - site du Val-d'Oise", adresse: "Immeuble Le Président, 2 avenue des Arpents, 95520 Osny", telephone: "3957" },
  "971": { nom: "CGSS Guadeloupe", adresse: "Quartier de l'Hôtel de Ville, 97110 Pointe-à-Pitre", telephone: "0 820 100 971" },
  "972": { nom: "CGSS Martinique", adresse: "Place d'Armes, 97232 Le Lamentin", telephone: "0 820 100 972" },
  "973": { nom: "CGSS Guyane", adresse: "Espace Turenne Radamonthe, route de Raban, 97300 Cayenne", telephone: "0 820 100 973" },
  "974": { nom: "CGSS Réunion", adresse: "4 boulevard Doret, 97704 Saint-Denis Cedex 9", telephone: "0 820 100 974" },
  "976": { nom: "CSSM Mayotte", adresse: "Route Nationale 1, Kawéni, 97600 Mamoudzou", telephone: "02 69 61 91 91" },
};

const inputPath = path.join(__dirname, '..', 'data', 'organismes.json');
const raw = fs.readFileSync(inputPath, 'utf-8');
const data = JSON.parse(raw);

let updated = 0;
for (const [code, u] of Object.entries(URSSAF)) {
  if (!data[code]) continue;
  data[code].urssaf = {
    nom: u.nom,
    type: data[code].urssaf?.type || "URSSAF",
    adresse: u.adresse,
    telephone: u.telephone,
    site: "https://www.urssaf.fr",
  };
  updated++;
}

fs.writeFileSync(inputPath, JSON.stringify(data, null, 2) + '\n');
console.log(`URSSAF mises à jour : ${updated} départements / ${Object.keys(URSSAF).length} attendus`);
