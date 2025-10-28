# 🏛️ Simulateur de Réforme des Retraites - Seb vs Polvé

## 🚀 Comment utiliser sur CodeSandbox

### Méthode 1 : Import automatique (LE PLUS SIMPLE)
1. Allez sur **https://codesandbox.io/s**
2. Cliquez sur "File" → "Import from GitHub" OU "Import Project"
3. Uploadez tous les fichiers de ce dossier

### Méthode 2 : Manuelle
1. Créez un nouveau sandbox React sur https://codesandbox.io
2. Remplacez les fichiers suivants :
   - `package.json` - Ajoute les dépendances (recharts, lucide-react)
   - `public/index.html` - Ajoute Tailwind CSS via CDN
   - `src/index.js` - Point d'entrée de l'app
   - `src/App.js` - Le simulateur principal
   - `src/styles.css` - Les styles avec Tailwind

### Méthode 3 : Via URL directe
Utilisez ce template pré-configuré :
https://codesandbox.io/s/github/... (à configurer)

## 📦 Dépendances requises
- react: ^18.2.0
- react-dom: ^18.2.0
- recharts: ^2.5.0 (pour les graphiques)
- lucide-react: ^0.263.1 (pour les icônes)
- tailwindcss: via CDN

## 🎮 Fonctionnalités
- Spider graph de configuration des politiques
- Taxe Zucman (taxation des ultra-riches)
- Animation des personnages Seb (ouvriers) et Polvé (riches)
- Simulation sur 30 ans avec événements dynamiques
- 5 paramètres ajustables

## 🐛 Troubleshooting
Si la mise en page ne s'affiche pas :
1. Vérifiez que Tailwind CSS est chargé (voir console)
2. Attendez que toutes les dépendances soient installées
3. Rafraîchissez la preview

Si les graphiques ne s'affichent pas :
- Vérifiez que recharts est installé dans les dependencies

---
Créé avec ❤️ pour comprendre les enjeux des réformes des retraites
