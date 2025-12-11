export const revisionExercises = [
  {
    id: 'exo-1',
    title: "Analyse d'un texte argumentatif",
    shortDescription: 'Structure un plan solide et identifie les arguments clés.',
    description:
      'Analyse complète d’un texte argumentatif : thèse, arguments, procédés de persuasion et construction du plan. Exercices guidés et corrigés.',
    price: 'Gratuit',
    isFree: true,
    certified: true,
    thumbnail:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'qcu',
        question: 'Quel élément exprime la position de l’auteur dans un texte argumentatif ?',
        options: [
          { id: 'a', text: 'Les exemples' },
          { id: 'b', text: 'La thèse' },
          { id: 'c', text: 'Les connecteurs logiques' },
          { id: 'd', text: 'Les figures de style' },
        ],
        correct: ['b'],
      },
      {
        id: 'q2',
        type: 'qcm',
        question: 'Quels procédés renforcent la dimension argumentative ?',
        options: [
          { id: 'a', text: 'Les citations de sources' },
          { id: 'b', text: 'Les exemples précis' },
          { id: 'c', text: 'La mise en page' },
          { id: 'd', text: 'Les connecteurs logiques' },
        ],
        correct: ['a', 'b', 'd'],
      },
      {
        id: 'q3',
        type: 'qcu',
        question: 'Quel plan est souvent privilégié pour un devoir argumentatif ?',
        options: [
          { id: 'a', text: 'Chronologique' },
          { id: 'b', text: 'Dialectique (thèse/antithèse/synthèse)' },
          { id: 'c', text: 'Descriptif' },
          { id: 'd', text: 'Narratif' },
        ],
        correct: ['b'],
      },
    ],
    teacher: {
      name: 'Pr. Nadia Traoré',
      certified: true,
    },
  },
  {
    id: 'exo-2',
    title: 'Probabilités – Variables aléatoires',
    shortDescription: 'Exercices corrigés sur les lois usuelles et l’espérance.',
    description:
      'Travaux dirigés sur les lois binomiale et normale, calculs d’espérance et de variance, avec une vidéo explicative pas-à-pas.',
    price: '2 000 FCFA',
    isFree: false,
    certified: false,
    thumbnail:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'qcu',
        question: "L'espérance d'une loi binomiale B(n,p) est :",
        options: [
          { id: 'a', text: 'n / p' },
          { id: 'b', text: 'p / n' },
          { id: 'c', text: 'n × p' },
          { id: 'd', text: 'n × (1 - p)' },
        ],
        correct: ['c'],
      },
      {
        id: 'q2',
        type: 'qcm',
        question: 'Parmi les affirmations suivantes sur la loi normale centrée réduite N(0,1), lesquelles sont vraies ?',
        options: [
          { id: 'a', text: 'La densité est symétrique par rapport à 0' },
          { id: 'b', text: 'La probabilité que X soit exactement 0 est 0' },
          { id: 'c', text: 'Son espérance vaut 1' },
          { id: 'd', text: 'Sa variance vaut 1' },
        ],
        correct: ['a', 'b', 'd'],
      },
      {
        id: 'q3',
        type: 'qcu',
        question: "Pour une variable aléatoire X, l'espérance E(X) représente :",
        options: [
          { id: 'a', text: 'La valeur maximale' },
          { id: 'b', text: 'La valeur moyenne théorique' },
          { id: 'c', text: 'La médiane' },
          { id: 'd', text: 'La variance' },
        ],
        correct: ['b'],
      },
    ],
    teacher: {
      name: 'M. Roland Kouadio',
      certified: false,
    },
  },
  {
    id: 'exo-3',
    title: 'Culture générale – Dissertation',
    shortDescription: 'Sujet type concours avec un plan proposé.',
    description:
      'Sujet complet de dissertation (culture générale) avec pistes de réflexion, exemples et un corrigé détaillé au format texte.',
    price: '1 200 FCFA',
    isFree: false,
    certified: true,
    thumbnail:
      'https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'qcu',
        question: 'Quelle partie de la dissertation formule la problématique ?',
        options: [
          { id: 'a', text: "L'accroche" },
          { id: 'b', text: 'La conclusion' },
          { id: 'c', text: "L'introduction" },
          { id: 'd', text: 'Le développement' },
        ],
        correct: ['c'],
      },
      {
        id: 'q2',
        type: 'qcm',
        question: 'Un plan dialectique comprend généralement :',
        options: [
          { id: 'a', text: 'Une thèse' },
          { id: 'b', text: 'Une antithèse' },
          { id: 'c', text: 'Une synthèse' },
          { id: 'd', text: 'Un récit' },
        ],
        correct: ['a', 'b', 'c'],
      },
      {
        id: 'q3',
        type: 'qcu',
        question: 'Dans la conclusion, on attend :',
        options: [
          { id: 'a', text: 'Une ouverture' },
          { id: 'b', text: 'Une nouvelle thèse' },
          { id: 'c', text: 'Un nouveau plan' },
          { id: 'd', text: 'Un résumé du sujet' },
        ],
        correct: ['a'],
      },
    ],
    teacher: {
      name: 'Dr. Awa Diarra',
      certified: true,
    },
  },
  {
    id: 'exo-4',
    title: 'Chimie – Diagramme de phases',
    shortDescription: 'Lecture et interprétation d’un diagramme binaire.',
    description:
      'Étude complète d’un diagramme binaire liquide-solide avec questions guidées. L’énoncé est fourni en image haute résolution.',
    price: '1 800 FCFA',
    isFree: false,
    certified: false,
    thumbnail:
      'https://img.freepik.com/photos-premium/representation-abstraite-chimie-experiences-laboratoire_1228868-21674.jpg?semt=ais_se_enriched&w=740&q=80',
    contentUrl:
      'https://img.freepik.com/photos-premium/representation-abstraite-chimie-experiences-laboratoire_1228868-21674.jpg?semt=ais_se_enriched&w=740&q=80',
    questions: [
      {
        id: 'q1',
        type: 'qcm',
        question: 'Un diagramme de phases permet de connaître :',
        options: [
          { id: 'a', text: "Les domaines d'existence des phases" },
          { id: 'b', text: 'Les températures de changement de phase' },
          { id: 'c', text: 'La composition chimique exacte de chaque atome' },
          { id: 'd', text: 'Les proportions des phases en équilibre' },
        ],
        correct: ['a', 'b', 'd'],
      },
      {
        id: 'q2',
        type: 'qcu',
        question: 'Sur un binaire liquide-solide, la courbe liquidus représente :',
        options: [
          { id: 'a', text: 'La limite entre liquide et solide' },
          { id: 'b', text: 'La limite entre liquide et liquide' },
          { id: 'c', text: 'La limite entre solide et solide' },
          { id: 'd', text: 'Un axe de pression' },
        ],
        correct: ['a'],
      },
      {
        id: 'q3',
        type: 'qcu',
        question: 'La règle du levier sert à :',
        options: [
          { id: 'a', text: "Calculer la proportion des phases en équilibre" },
          { id: 'b', text: 'Déterminer la pression' },
          { id: 'c', text: 'Mesurer la masse volumique' },
          { id: 'd', text: 'Trouver la température de fusion' },
        ],
        correct: ['a'],
      },
    ],
    teacher: {
      name: 'Pr. Mamadou Sow',
      certified: false,
    },
  },
  {
    id: 'exo-5',
    title: 'Algèbre – Résolution d’équations',
    shortDescription: 'Trouve la valeur inconnue dans des équations simples.',
    description:
      'Inspiré des exercices guidés de Khan Academy : résous pas-à-pas des équations linéaires et vérifie ton résultat.',
    price: '1 000 FCFA',
    isFree: false,
    certified: true,
    thumbnail:
      'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'input',
        question: 'Résous 3x + 5 = 14. Donne la valeur de x.',
        correct: ['3'],
        placeholder: 'Entre une valeur numérique',
      },
      {
        id: 'q2',
        type: 'input',
        question: 'Résous 2y - 7 = 9. Donne la valeur de y.',
        correct: ['8'],
        placeholder: 'Entre une valeur numérique',
      },
      {
        id: 'q3',
        type: 'qcu',
        question: 'Pour vérifier une solution, on doit :',
        options: [
          { id: 'a', text: 'La remplacer dans l’équation initiale' },
          { id: 'b', text: 'Essayer une autre équation' },
          { id: 'c', text: 'Changer les coefficients' },
          { id: 'd', text: 'Prendre la moyenne des deux membres' },
        ],
        correct: ['a'],
      },
    ],
    teacher: {
      name: 'Mme. Clarisse N’Guessan',
      certified: true,
    },
  },
  {
    id: 'exo-6',
    title: 'Géométrie – Aire et périmètre',
    shortDescription: 'Calcule l’aire ou le périmètre à partir de mesures données.',
    description:
      'Exercices pratiques type Khan Academy : applique les formules d’aire et de périmètre sur des figures simples.',
    price: '1 300 FCFA',
    isFree: false,
    certified: false,
    thumbnail:
      'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'input',
        question: 'Un rectangle mesure 8 cm sur 5 cm. Quel est son périmètre (en cm) ?',
        correct: ['26'],
        placeholder: 'Entre la valeur en cm',
      },
      {
        id: 'q2',
        type: 'input',
        question: 'Un carré a un côté de 9 cm. Quelle est son aire (en cm²) ?',
        correct: ['81'],
        placeholder: 'Entre la valeur en cm²',
      },
      {
        id: 'q3',
        type: 'qcm',
        question: 'Quelles grandeurs augmentent si on multiplie chaque côté d’un rectangle par 2 ?',
        options: [
          { id: 'a', text: 'Le périmètre' },
          { id: 'b', text: 'L’aire' },
          { id: 'c', text: 'La longueur seulement' },
          { id: 'd', text: 'La largeur seulement' },
        ],
        correct: ['a', 'b'],
      },
    ],
    teacher: {
      name: 'M. Jules Koffi',
      certified: false,
    },
  },
  {
    id: 'exo-7',
    title: 'Physique – Mouvement et vitesse',
    shortDescription: 'Calcule la vitesse moyenne et analyse des mouvements.',
    description:
      'Exercices pratiques sur le mouvement rectiligne uniforme, calcul de vitesse moyenne et interprétation de graphiques.',
    price: '1 500 FCFA',
    isFree: false,
    certified: true,
    thumbnail:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'input',
        question: 'Un véhicule parcourt 120 km en 2 heures. Quelle est sa vitesse moyenne en km/h ?',
        correct: ['60'],
        placeholder: 'Entre la vitesse en km/h',
      },
      {
        id: 'q2',
        type: 'qcu',
        question: 'La vitesse moyenne se calcule par :',
        options: [
          { id: 'a', text: 'Distance × Temps' },
          { id: 'b', text: 'Distance / Temps' },
          { id: 'c', text: 'Temps / Distance' },
          { id: 'd', text: 'Distance + Temps' },
        ],
        correct: ['b'],
      },
      {
        id: 'q3',
        type: 'qcm',
        question: 'Dans un mouvement rectiligne uniforme :',
        options: [
          { id: 'a', text: 'La vitesse est constante' },
          { id: 'b', text: 'L\'accélération est nulle' },
          { id: 'c', text: 'La trajectoire est une droite' },
          { id: 'd', text: 'La vitesse augmente constamment' },
        ],
        correct: ['a', 'b', 'c'],
      },
    ],
    teacher: {
      name: 'Dr. Koffi Amadou',
      certified: true,
    },
  },
  {
    id: 'exo-8',
    title: 'Français – Conjugaison et grammaire',
    shortDescription: 'Maîtrise les temps de conjugaison et les accords.',
    description:
      'Exercices de conjugaison aux différents temps, accords du participe passé et règles grammaticales essentielles.',
    price: '1 000 FCFA',
    isFree: false,
    certified: true,
    thumbnail:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'input',
        question: 'Conjugue le verbe "aller" à la 3e personne du pluriel au présent de l\'indicatif.',
        correct: ['vont'],
        placeholder: 'Entre la forme conjuguée',
      },
      {
        id: 'q2',
        type: 'qcm',
        question: 'Quels sont les temps du passé ?',
        options: [
          { id: 'a', text: 'Passé composé' },
          { id: 'b', text: 'Imparfait' },
          { id: 'c', text: 'Plus-que-parfait' },
          { id: 'd', text: 'Présent' },
        ],
        correct: ['a', 'b', 'c'],
      },
      {
        id: 'q3',
        type: 'qcu',
        question: 'Dans "Les fleurs que j\'ai cueillies", l\'accord est correct car :',
        options: [
          { id: 'a', text: 'Le COD est placé avant le verbe' },
          { id: 'b', text: 'Le COD est placé après le verbe' },
          { id: 'c', text: 'Le sujet est au pluriel' },
          { id: 'd', text: 'Le verbe est à l\'infinitif' },
        ],
        correct: ['a'],
      },
    ],
    teacher: {
      name: 'Mme. Fatou Diallo',
      certified: true,
    },
  },
  {
    id: 'exo-9',
    title: 'Biologie – Cellule et ADN',
    shortDescription: 'Comprends la structure cellulaire et la génétique.',
    description:
      'Exercices sur la structure de la cellule, l\'ADN, les chromosomes et les bases de la génétique.',
    price: '1 800 FCFA',
    isFree: false,
    certified: false,
    thumbnail:
      'https://images.unsplash.com/photo-1532619675605-1ede6c9ed2d7?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'qcu',
        question: 'L\'organite responsable de la production d\'énergie dans la cellule est :',
        options: [
          { id: 'a', text: 'Le noyau' },
          { id: 'b', text: 'La mitochondrie' },
          { id: 'c', text: 'Le réticulum endoplasmique' },
          { id: 'd', text: 'L\'appareil de Golgi' },
        ],
        correct: ['b'],
      },
      {
        id: 'q2',
        type: 'qcm',
        question: 'L\'ADN contient :',
        options: [
          { id: 'a', text: 'Des bases azotées (A, T, G, C)' },
          { id: 'b', text: 'Des sucres (désoxyribose)' },
          { id: 'c', text: 'Des protéines' },
          { id: 'd', text: 'Des phosphates' },
        ],
        correct: ['a', 'b', 'd'],
      },
      {
        id: 'q3',
        type: 'input',
        question: 'Combien de chromosomes possède une cellule humaine normale ? (répondre en nombre)',
        correct: ['46'],
        placeholder: 'Entre le nombre de chromosomes',
      },
    ],
    teacher: {
      name: 'Pr. Aissatou Bamba',
      certified: false,
    },
  },
  {
    id: 'exo-10',
    title: 'Histoire – L\'Afrique précoloniale',
    shortDescription: 'Découvre les grands empires africains.',
    description:
      'Exercices sur les empires du Ghana, du Mali, du Songhaï et l\'organisation politique et économique de l\'Afrique précoloniale.',
    price: '1 200 FCFA',
    isFree: false,
    certified: true,
    thumbnail:
      'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'qcu',
        question: 'Quel empire était réputé pour son commerce de l\'or ?',
        options: [
          { id: 'a', text: 'L\'empire du Ghana' },
          { id: 'b', text: 'L\'empire romain' },
          { id: 'c', text: 'L\'empire ottoman' },
          { id: 'd', text: 'L\'empire byzantin' },
        ],
        correct: ['a'],
      },
      {
        id: 'q2',
        type: 'qcm',
        question: 'Les grands empires de l\'Afrique de l\'Ouest étaient :',
        options: [
          { id: 'a', text: 'L\'empire du Ghana' },
          { id: 'b', text: 'L\'empire du Mali' },
          { id: 'c', text: 'L\'empire du Songhaï' },
          { id: 'd', text: 'L\'empire égyptien' },
        ],
        correct: ['a', 'b', 'c'],
      },
      {
        id: 'q3',
        type: 'input',
        question: 'Quel était le souverain le plus célèbre de l\'empire du Mali ? (un seul mot)',
        correct: ['soundiata', 'sundiata', 'soundjata'],
        placeholder: 'Entre le nom du souverain',
      },
    ],
    teacher: {
      name: 'Dr. Mamadou Koné',
      certified: true,
    },
  },
  {
    id: 'exo-11',
    title: 'Anglais – Vocabulaire et grammaire',
    shortDescription: 'Améliore ton vocabulaire et ta grammaire anglaise.',
    description:
      'Exercices de vocabulaire, conjugaison des verbes irréguliers, prépositions et structures grammaticales courantes.',
    price: '1 400 FCFA',
    isFree: false,
    certified: false,
    thumbnail:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'input',
        question: 'Traduis "Bonjour" en anglais.',
        correct: ['hello', 'hi', 'good morning', 'good afternoon'],
        placeholder: 'Entre la traduction',
      },
      {
        id: 'q2',
        type: 'qcu',
        question: 'Quelle est la forme passée du verbe "go" ?',
        options: [
          { id: 'a', text: 'goed' },
          { id: 'b', text: 'went' },
          { id: 'c', text: 'gone' },
          { id: 'd', text: 'going' },
        ],
        correct: ['b'],
      },
      {
        id: 'q3',
        type: 'qcm',
        question: 'Les prépositions de temps en anglais incluent :',
        options: [
          { id: 'a', text: 'in' },
          { id: 'b', text: 'on' },
          { id: 'c', text: 'at' },
          { id: 'd', text: 'for' },
        ],
        correct: ['a', 'b', 'c'],
      },
    ],
    teacher: {
      name: 'M. John Kouassi',
      certified: false,
    },
  },
  {
    id: 'exo-12',
    title: 'Mathématiques – Fractions et pourcentages',
    shortDescription: 'Maîtrise les calculs avec fractions et pourcentages.',
    description:
      'Exercices guidés sur l\'addition, soustraction, multiplication de fractions et calculs de pourcentages.',
    price: '1 100 FCFA',
    isFree: false,
    certified: true,
    thumbnail:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'input',
        question: 'Calcule 1/2 + 1/4. Donne le résultat sous forme de fraction (ex: 3/4).',
        correct: ['3/4'],
        placeholder: 'Entre la fraction',
      },
      {
        id: 'q2',
        type: 'input',
        question: 'Quel est 25% de 200 ?',
        correct: ['50'],
        placeholder: 'Entre le résultat',
      },
      {
        id: 'q3',
        type: 'qcu',
        question: 'Pour additionner deux fractions, il faut :',
        options: [
          { id: 'a', text: 'Les mettre au même dénominateur' },
          { id: 'b', text: 'Additionner numérateurs et dénominateurs' },
          { id: 'c', text: 'Multiplier les dénominateurs' },
          { id: 'd', text: 'Soustraire les numérateurs' },
        ],
        correct: ['a'],
      },
    ],
    teacher: {
      name: 'Mme. Marie Kouamé',
      certified: true,
    },
  },
  {
    id: 'exo-13',
    title: 'SVT – Écosystèmes et chaînes alimentaires',
    shortDescription: 'Comprends les interactions dans les écosystèmes.',
    description:
      'Exercices sur les chaînes alimentaires, les réseaux trophiques, les relations entre espèces et l\'équilibre des écosystèmes.',
    price: '1 600 FCFA',
    isFree: false,
    certified: false,
    thumbnail:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'qcu',
        question: 'Dans une chaîne alimentaire, les producteurs primaires sont :',
        options: [
          { id: 'a', text: 'Les végétaux' },
          { id: 'b', text: 'Les herbivores' },
          { id: 'c', text: 'Les carnivores' },
          { id: 'd', text: 'Les décomposeurs' },
        ],
        correct: ['a'],
      },
      {
        id: 'q2',
        type: 'qcm',
        question: 'Les niveaux trophiques comprennent :',
        options: [
          { id: 'a', text: 'Producteurs' },
          { id: 'b', text: 'Consommateurs primaires' },
          { id: 'c', text: 'Consommateurs secondaires' },
          { id: 'd', text: 'Décomposeurs' },
        ],
        correct: ['a', 'b', 'c', 'd'],
      },
      {
        id: 'q3',
        type: 'input',
        question: 'Quel terme désigne un animal qui se nourrit uniquement de végétaux ? (un seul mot)',
        correct: ['herbivore'],
        placeholder: 'Entre le terme',
      },
    ],
    teacher: {
      name: 'Pr. Salimata Traoré',
      certified: false,
    },
  },
  {
    id: 'exo-14',
    title: 'Philosophie – Logique et raisonnement',
    shortDescription: 'Développe tes compétences en logique et argumentation.',
    description:
      'Exercices sur les syllogismes, les sophismes, la distinction entre déduction et induction, et les principes de la logique formelle.',
    price: '1 700 FCFA',
    isFree: false,
    certified: true,
    thumbnail:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'q1',
        type: 'qcu',
        question: 'Un syllogisme est composé de :',
        options: [
          { id: 'a', text: 'Deux prémisses et une conclusion' },
          { id: 'b', text: 'Une seule prémisse' },
          { id: 'c', text: 'Trois conclusions' },
          { id: 'd', text: 'Un seul argument' },
        ],
        correct: ['a'],
      },
      {
        id: 'q2',
        type: 'qcm',
        question: 'Les types de raisonnement incluent :',
        options: [
          { id: 'a', text: 'La déduction' },
          { id: 'b', text: 'L\'induction' },
          { id: 'c', text: 'L\'analogie' },
          { id: 'd', text: 'L\'intuition' },
        ],
        correct: ['a', 'b', 'c'],
      },
      {
        id: 'q3',
        type: 'input',
        question: 'Quel terme désigne un raisonnement fallacieux destiné à tromper ? (un seul mot)',
        correct: ['sophisme'],
        placeholder: 'Entre le terme',
      },
    ],
    teacher: {
      name: 'Dr. Amadou Diallo',
      certified: true,
    },
  },
];

export const getRevisionExerciseById = (id) =>
  revisionExercises.find((item) => item.id === id);

