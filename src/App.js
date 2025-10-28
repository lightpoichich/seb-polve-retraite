import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, TrendingUp, Heart, AlertTriangle, Trophy, Settings, Play } from 'lucide-react';

export default function SimulateurRetraiteAvance() {
  const [etape, setEtape] = useState('config'); // 'config' ou 'simulation'
  const [parametres, setParametres] = useState({
    ageRetraite: 62,
    taxeZucman: 50, // Taxation des ultra-riches (0-100%)
    cotisationsSociales: 50, // Taux de cotisations (20-80%)
    retraiteMinimum: 50, // Niveau de retraite minimum (0-100%)
    investissementPublic: 50 // Investissement dans services publics (0-100%)
  });
  
  const [annee, setAnnee] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({
    budget: 100,
    bonheur: 75,
    inegalites: 30,
    croissance: 2.5,
    score: 0
  });
  const [historique, setHistorique] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [personnages, setPersonnages] = useState([]);

  // Initialiser les personnages
  useEffect(() => {
    if (etape === 'simulation' && personnages.length === 0) {
      const nouveauxPersonnages = [
        // Seb - travailleur manuel
        { id: 1, nom: 'Seb', type: 'ouvrier', x: 15, y: 50, humeur: '😊', phrase: 'Je bosse dur !', age: 45 },
        { id: 2, nom: 'Seb', type: 'ouvrier', x: 25, y: 70, humeur: '😊', phrase: 'Vivement la retraite', age: 58 },
        { id: 3, nom: 'Seb', type: 'ouvrier', x: 35, y: 40, humeur: '😊', phrase: 'Mon dos...', age: 52 },
        
        // Polvé - cadres/riches
        { id: 4, nom: 'Polvé', type: 'cadre', x: 65, y: 30, humeur: '😎', phrase: 'Business is good', age: 42 },
        { id: 5, nom: 'Polvé', type: 'cadre', x: 75, y: 60, humeur: '😎', phrase: 'Mes actions ++', age: 55 },
        { id: 6, nom: 'Polvé', type: 'riche', x: 85, y: 45, humeur: '💰', phrase: 'Je optimise mes impôts', age: 48 },
        
        // Autres
        { id: 7, nom: 'Marie', type: 'fonctionnaire', x: 45, y: 55, humeur: '😌', phrase: 'Service public !', age: 50 },
        { id: 8, nom: 'Ahmed', type: 'jeune', x: 20, y: 80, humeur: '💪', phrase: 'Premier job !', age: 25 },
        { id: 9, nom: 'Lucie', type: 'retraite', x: 55, y: 25, humeur: '🌴', phrase: 'Enfin libre !', age: 65 },
      ];
      setPersonnages(nouveauxPersonnages);
    }
  }, [etape]);

  // Calculer les données du spider graph
  const getSpiderData = () => {
    return [
      { parametre: 'Âge retraite', valeur: ((parametres.ageRetraite - 55) / 15) * 100, max: 100 },
      { parametre: 'Taxe Zucman', valeur: parametres.taxeZucman, max: 100 },
      { parametre: 'Cotisations', valeur: ((parametres.cotisationsSociales - 20) / 60) * 100, max: 100 },
      { parametre: 'Retraite min', valeur: parametres.retraiteMinimum, max: 100 },
      { parametre: 'Invest. public', valeur: parametres.investissementPublic, max: 100 }
    ];
  };

  // Calcul des impacts basés sur tous les paramètres
  const calculerImpacts = (params, statsActuelles) => {
    const diffAge = params.ageRetraite - 62;
    
    // Impact budget : complexe avec tous les paramètres
    const impactBudgetAge = diffAge * 3;
    const impactBudgetTaxe = (params.taxeZucman - 50) * 0.4;
    const impactBudgetCotis = (params.cotisationsSociales - 50) * 0.3;
    const coutRetraiteMin = (params.retraiteMinimum - 50) * -0.3;
    const coutInvest = (params.investissementPublic - 50) * -0.2;
    const impactBudget = impactBudgetAge + impactBudgetTaxe + impactBudgetCotis + coutRetraiteMin + coutInvest + (Math.random() * 2 - 1);
    
    // Impact bonheur : multifactoriel
    const impactBonheurAge = -diffAge * 2.5;
    const impactBonheurRetraiteMin = (params.retraiteMinimum - 50) * 0.3;
    const impactBonheurInvest = (params.investissementPublic - 50) * 0.25;
    const impactBonheurCotis = -(params.cotisationsSociales - 50) * 0.15;
    const impactBonheur = impactBonheurAge + impactBonheurRetraiteMin + impactBonheurInvest + impactBonheurCotis + (Math.random() * 3 - 1.5);
    
    // Impact inégalités
    const impactInegalitesAge = diffAge * 1.8;
    const impactInegalitesTaxe = -(params.taxeZucman - 50) * 0.5; // Taxe réduit inégalités
    const impactInegalitesRetraiteMin = -(params.retraiteMinimum - 50) * 0.4;
    const impactInegalites = impactInegalitesAge + impactInegalitesTaxe + impactInegalitesRetraiteMin + (Math.random() * 2 - 1);
    
    // Impact croissance
    const impactCroissanceBudget = statsActuelles.budget > 80 ? 0.3 : -0.2;
    const impactCroissanceInvest = (params.investissementPublic - 50) * 0.015;
    const impactCroissanceTaxe = -(params.taxeZucman - 50) * 0.01; // Taxe forte peut freiner croissance
    const impactCroissance = impactCroissanceBudget + impactCroissanceInvest + impactCroissanceTaxe + (Math.random() * 0.4 - 0.2);
    
    const nouveauStats = {
      budget: Math.max(0, Math.min(200, statsActuelles.budget + impactBudget)),
      bonheur: Math.max(0, Math.min(100, statsActuelles.bonheur + impactBonheur)),
      inegalites: Math.max(0, Math.min(100, statsActuelles.inegalites + impactInegalites)),
      croissance: Math.max(-2, Math.min(5, statsActuelles.croissance + impactCroissance)),
      score: statsActuelles.score + Math.round(statsActuelles.bonheur * 0.4 + (100 - statsActuelles.inegalites) * 0.3 + statsActuelles.budget * 0.3)
    };

    return nouveauStats;
  };

  // Mettre à jour les personnages selon les stats
  const mettreAJourPersonnages = (stats, params) => {
    setPersonnages(prev => prev.map(perso => {
      let nouvelleHumeur = perso.humeur;
      let nouvellePhrase = perso.phrase;
      
      // Seb (ouvriers) réagissent à l'âge de retraite et aux inégalités
      if (perso.nom === 'Seb') {
        if (params.ageRetraite > 64 && perso.age > 55) {
          nouvelleHumeur = '😡';
          nouvellePhrase = 'Trop tard pour partir !';
        } else if (stats.inegalites > 60) {
          nouvelleHumeur = '😤';
          nouvellePhrase = 'C\'est injuste !';
        } else if (params.retraiteMinimum > 60) {
          nouvelleHumeur = '😊';
          nouvellePhrase = 'Bonne retraite en vue !';
        } else if (stats.bonheur < 40) {
          nouvelleHumeur = '😢';
          nouvellePhrase = 'Dur dur...';
        }
      }
      
      // Polvé (riches/cadres) réagissent aux taxes
      if (perso.nom === 'Polvé') {
        if (params.taxeZucman > 70) {
          nouvelleHumeur = '😠';
          nouvellePhrase = 'Trop de taxes !';
        } else if (params.taxeZucman < 30) {
          nouvelleHumeur = '🤑';
          nouvellePhrase = 'Jackpot fiscal !';
        } else if (stats.croissance > 3) {
          nouvelleHumeur = '😎';
          nouvellePhrase = 'Business is booming !';
        } else if (stats.budget < 50) {
          nouvelleHumeur = '😰';
          nouvellePhrase = 'Crise en vue...';
        }
      }
      
      return {
        ...perso,
        humeur: nouvelleHumeur,
        phrase: nouvellePhrase,
        // Petit mouvement aléatoire
        x: Math.max(10, Math.min(90, perso.x + (Math.random() * 4 - 2))),
        y: Math.max(20, Math.min(85, perso.y + (Math.random() * 4 - 2)))
      };
    }));
  };

  // Générer des événements
  const genererEvenement = (stats, params) => {
    const rand = Math.random();
    const events = [];
    
    if (rand < 0.12 && stats.bonheur < 50) {
      events.push({ type: 'warning', text: '🪧 Seb et ses copains manifestent ! Le bonheur est trop bas !' });
    } else if (rand < 0.12 && params.taxeZucman > 75) {
      events.push({ type: 'warning', text: '💼 Polvé menace de partir en Suisse ! Taxe trop élevée !' });
    } else if (rand < 0.12 && stats.inegalites > 70) {
      events.push({ type: 'danger', text: '⚖️ Les Seb crient à l\'injustice face aux Polvé !' });
    } else if (rand < 0.15 && params.retraiteMinimum > 70 && params.taxeZucman > 60) {
      events.push({ type: 'success', text: '🎉 Les Seb sont ravis ! Bonne retraite garantie !' });
    } else if (rand < 0.12 && stats.budget < 50) {
      events.push({ type: 'danger', text: '💸 Crise budgétaire ! Coupes dans les services publics !' });
    }
    
    return events;
  };

  // Simulation automatique
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setAnnee(prev => {
          if (prev >= 30) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
        
        setStats(prevStats => {
          const nouveauStats = calculerImpacts(parametres, prevStats);
          
          setHistorique(prev => [...prev, {
            annee: annee,
            budget: Math.round(nouveauStats.budget),
            bonheur: Math.round(nouveauStats.bonheur),
            inegalites: Math.round(nouveauStats.inegalites),
            croissance: nouveauStats.croissance.toFixed(1)
          }].slice(-30));
          
          const nouveauxEvents = genererEvenement(nouveauStats, parametres);
          if (nouveauxEvents.length > 0) {
            setEvenements(prev => [...nouveauxEvents, ...prev].slice(0, 5));
          }
          
          mettreAJourPersonnages(nouveauStats, parametres);
          
          return nouveauStats;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isPlaying, parametres, annee]);

  const commencerSimulation = () => {
    setEtape('simulation');
    setStats({
      budget: 100,
      bonheur: 75,
      inegalites: 30,
      croissance: 2.5,
      score: 0
    });
  };

  const reinitialiser = () => {
    setEtape('config');
    setAnnee(1);
    setIsPlaying(false);
    setHistorique([]);
    setEvenements([]);
    setPersonnages([]);
  };

  const getColorClass = (value, inverse = false) => {
    if (inverse) {
      if (value < 30) return 'text-green-600';
      if (value < 60) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (value < 30) return 'text-red-600';
    if (value < 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBudgetColor = (value) => {
    if (value < 50) return 'text-red-600';
    if (value < 80) return 'text-yellow-600';
    if (value < 120) return 'text-green-600';
    return 'text-blue-600';
  };

  // ÉCRAN DE CONFIGURATION
  if (etape === 'config') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-3">
              🏛️ Simulateur de Politique des Retraites
            </h1>
            <p className="text-xl text-gray-600">
              Configurez votre politique et observez Seb et Polvé réagir !
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Paramètres */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2">
                <Settings size={28} />
                Configurez votre politique
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-2 text-gray-700">
                    🕐 Âge de départ à la retraite : {parametres.ageRetraite} ans
                  </label>
                  <input
                    type="range"
                    min="55"
                    max="70"
                    value={parametres.ageRetraite}
                    onChange={(e) => setParametres({...parametres, ageRetraite: parseInt(e.target.value)})}
                    className="w-full h-3 bg-gradient-to-r from-green-300 to-red-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>55 ans (Seb content)</span>
                    <span>70 ans (Seb furieux)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2 text-gray-700">
                    💎 Taxe Zucman (ultra-riches) : {parametres.taxeZucman}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parametres.taxeZucman}
                    onChange={(e) => setParametres({...parametres, taxeZucman: parseInt(e.target.value)})}
                    className="w-full h-3 bg-gradient-to-r from-red-300 to-green-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0% (Polvé ravi)</span>
                    <span>100% (Polvé fuit)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2 text-gray-700">
                    💰 Cotisations sociales : {parametres.cotisationsSociales}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={parametres.cotisationsSociales}
                    onChange={(e) => setParametres({...parametres, cotisationsSociales: parseInt(e.target.value)})}
                    className="w-full h-3 bg-gradient-to-r from-orange-300 to-blue-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>20% (Budget fragile)</span>
                    <span>80% (Salaires réduits)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2 text-gray-700">
                    🏠 Retraite minimum : {parametres.retraiteMinimum}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parametres.retraiteMinimum}
                    onChange={(e) => setParametres({...parametres, retraiteMinimum: parseInt(e.target.value)})}
                    className="w-full h-3 bg-gradient-to-r from-red-300 to-green-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0% (Seb inquiet)</span>
                    <span>100% (Seb protégé)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2 text-gray-700">
                    🏥 Investissement public : {parametres.investissementPublic}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parametres.investissementPublic}
                    onChange={(e) => setParametres({...parametres, investissementPublic: parseInt(e.target.value)})}
                    className="w-full h-3 bg-gradient-to-r from-gray-300 to-blue-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0% (Services dégradés)</span>
                    <span>100% (Services top)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={commencerSimulation}
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Play size={24} />
                Lancer la simulation !
              </button>
            </div>

            {/* Spider Graph */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">
                📊 Aperçu de votre politique
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={getSpiderData()}>
                  <PolarGrid stroke="#9333ea" />
                  <PolarAngleAxis dataKey="parametre" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <Radar name="Votre politique" dataKey="valeur" stroke="#8b5cf6" fill="#a855f7" fillOpacity={0.6} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-3 bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg text-purple-700">💡 Prédictions :</h3>
                <p className="text-sm">
                  {parametres.ageRetraite > 64 ? '😡 Les Seb vont manifester !' : '😊 Les Seb sont OK avec l\'âge'}
                </p>
                <p className="text-sm">
                  {parametres.taxeZucman > 70 ? '🛫 Les Polvé menacent de partir !' : parametres.taxeZucman < 30 ? '🤑 Les Polvé jubilent !' : '😎 Les Polvé acceptent'}
                </p>
                <p className="text-sm">
                  {parametres.retraiteMinimum > 60 ? '🏠 Bonne protection sociale' : '⚠️ Retraites précaires'}
                </p>
                <p className="text-sm">
                  {parametres.investissementPublic > 60 ? '🏥 Services publics de qualité' : '📉 Services publics dégradés'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN DE SIMULATION
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎭 Simulation en cours : Seb vs Polvé
          </h1>
          <p className="text-gray-600">
            Observez comment votre politique affecte la société !
          </p>
        </div>

        {/* Contrôles */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-purple-600">
                Année {annee} / 30
              </span>
              <span className="ml-6 text-xl text-gray-600">
                <Trophy className="inline mr-2" size={20} />
                Score : {Math.round(stats.score).toLocaleString()}
              </span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={annee >= 30}
                className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
                  isPlaying 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                } disabled:bg-gray-400`}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              <button
                onClick={reinitialiser}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-all"
              >
                🔄 Nouvelle config
              </button>
            </div>
          </div>
        </div>

        {/* Zone d'animation des personnages */}
        <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-xl shadow-lg p-4 mb-6 relative" style={{ height: '400px' }}>
          <div className="absolute top-4 left-4 bg-white bg-opacity-80 rounded-lg p-3 backdrop-blur">
            <p className="text-sm font-bold text-gray-700">👷 Seb = Travailleurs</p>
            <p className="text-sm font-bold text-gray-700">💼 Polvé = Cadres/Riches</p>
          </div>
          
          {personnages.map(perso => (
            <div
              key={perso.id}
              className="absolute transition-all duration-700 ease-in-out"
              style={{
                left: `${perso.x}%`,
                top: `${perso.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-1 animate-bounce" style={{ animationDuration: '2s' }}>
                  {perso.humeur}
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg px-2 py-1 text-xs font-bold shadow-md whitespace-nowrap">
                  <div className="text-purple-700">{perso.nom}</div>
                  <div className="text-gray-600 text-xs italic">{perso.phrase}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Légende du sol */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 text-sm font-semibold">
            🏭 Société française 🏭
          </div>
        </div>

        {/* Indicateurs principaux */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-blue-500" size={28} />
              <span className={`text-2xl font-bold ${getBudgetColor(stats.budget)}`}>
                {Math.round(stats.budget)}
              </span>
            </div>
            <p className="text-gray-600 font-medium text-sm">Budget Public</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{width: `${Math.min(100, stats.budget / 2)}%`}}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-pink-500">
            <div className="flex items-center justify-between mb-2">
              <Heart className="text-pink-500" size={28} />
              <span className={`text-2xl font-bold ${getColorClass(stats.bonheur)}`}>
                {Math.round(stats.bonheur)}%
              </span>
            </div>
            <p className="text-gray-600 font-medium text-sm">Bonheur</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                style={{width: `${stats.bonheur}%`}}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="text-red-500" size={28} />
              <span className={`text-2xl font-bold ${getColorClass(stats.inegalites, true)}`}>
                {Math.round(stats.inegalites)}%
              </span>
            </div>
            <p className="text-gray-600 font-medium text-sm">Inégalités</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{width: `${stats.inegalites}%`}}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-green-500" size={28} />
              <span className={`text-2xl font-bold ${getColorClass(stats.croissance > 0 ? 70 : 30)}`}>
                {stats.croissance.toFixed(1)}%
              </span>
            </div>
            <p className="text-gray-600 font-medium text-sm">Croissance</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{width: `${Math.max(0, (stats.croissance + 2) * 14)}%`}}
              />
            </div>
          </div>
        </div>

        {/* Événements */}
        {evenements.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-bold text-lg mb-3 text-gray-700">📰 Flash Info</h3>
            <div className="space-y-2">
              {evenements.map((event, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg border-l-4 ${
                    event.type === 'danger' ? 'bg-red-50 border-red-500' :
                    event.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-green-50 border-green-500'
                  }`}
                >
                  {event.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graphiques */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-700">Évolution des indicateurs</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historique}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bonheur" stroke="#ec4899" strokeWidth={2} name="Bonheur" />
                <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} name="Budget" />
                <Line type="monotone" dataKey="inegalites" stroke="#ef4444" strokeWidth={2} name="Inégalités" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-700">État actuel</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { nom: 'Budget', valeur: Math.round(stats.budget) },
                { nom: 'Bonheur', valeur: Math.round(stats.bonheur) },
                { nom: 'Égalité', valeur: Math.round(100 - stats.inegalites) },
                { nom: 'Croissance', valeur: Math.round((stats.croissance + 2) * 10) }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valeur" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Message de fin */}
        {annee >= 30 && (
          <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">🎯 Simulation terminée !</h2>
            <p className="text-xl mb-2">Score final : {Math.round(stats.score).toLocaleString()} points</p>
            <p className="text-lg opacity-90 mb-4">
              {stats.score > 80000 ? '🏆 Magistral ! Seb ET Polvé sont satisfaits !' :
               stats.score > 60000 ? '👍 Bien joué ! Quelques compromis intelligents.' :
               stats.score > 40000 ? '😅 Pas mal, mais difficile de contenter tout le monde...' :
               '🤔 Les Seb ET les Polvé sont mécontents... Dure la politique !'}
            </p>
            <div className="flex gap-4 justify-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm">😊 Bonheur Seb: {stats.bonheur < 50 ? 'Mécontent' : 'Content'}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm">💼 Humeur Polvé: {parametres.taxeZucman > 70 ? 'Furieux' : 'Acceptable'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}