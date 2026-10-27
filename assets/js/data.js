/* ============================================================
   CRSL - Cahiers de Recherches en Sciences du Langage
   Journal content. Edit this file to add or update articles.
   Hero/section UI strings live in i18n.js.

   Emails are stored base64 encoded (btoa) so that no plain
   address sits in the page source. The site decodes them only
   after the visitor unlocks the 2 second contact gate.
   Plain addresses still work: app.js accepts both forms.
   ============================================================ */

window.CRSL_DATA = {
  meta: {
    short: "CRSL",
    name: {
      fr: "Cahiers de Recherches en Sciences du Langage",
      en: "Research Papers in Language Sciences",
      ar: "دفاتر أبحاث علوم اللغة"
    },
    issn: "2992-0302",
    eissn: "2992-0647",
    email: "c291bWlhY3JAeWFob28uZnI=",
    asjp: "https://www.asjp.cerist.dz/en/PresentationRevue/921",
    universityUrl: "https://www.univ-mascara.dz",
    /* ------------------------------------------------------------
       OJS (Open Journal Systems) editorial platform.
       The public site keeps this premium front end; OJS handles
       submissions, peer review, the author dashboard and the
       OAI-PMH archive. Fill in `url` (installation root) and
       `journalPath` (the short path under /index.php/), then set
       `enabled: true`. No link is shown while enabled is false.

       Example: https://ojs.example.org/index.php/crsl
       -> url: "https://ojs.example.org", journalPath: "crsl"
       ------------------------------------------------------------ */
    ojs: {
      enabled: false,
      url: "",
      journalPath: "crsl",
      submissions: "about/submissions",
      login: "login",
      dashboard: "submissions",
      archive: "issue/archive",
      oai: "oai"
    },
    founded: 2023,
    acceptance: "97%",
    responseDays: 77,
    publicationDays: 61,
    address: {
      fr: "Faculté des Lettres et Langues, Département de Langue et Littérature Françaises, Université Mustapha Stambouli, Mascara 29000, Algérie",
      en: "Faculty of Arts and Languages, Department of French Language and Literature, Mustapha Stambouli University, Mascara 29000, Algeria",
      ar: "كلية الآداب واللغات، قسم اللغة والأدب الفرنسيين، جامعة مصطفى اسطمبولي، معسكر 29000، الجزائر"
    }
  },

  countries: {
    dz: { fr: "Algérie", en: "Algeria", ar: "الجزائر" },
    tn: { fr: "Tunisie", en: "Tunisia", ar: "تونس" },
    fr: { fr: "France", en: "France", ar: "فرنسا" },
    gr: { fr: "Grèce", en: "Greece", ar: "اليونان" },
    mg: { fr: "Madagascar", en: "Madagascar", ar: "مدغشقر" },
    cd: { fr: "RD Congo", en: "DR Congo", ar: "الكونغو الديمقراطية" },
    gh: { fr: "Ghana", en: "Ghana", ar: "غانا" },
    sn: { fr: "Sénégal", en: "Senegal", ar: "السنغال" },
    ci: { fr: "Côte d’Ivoire", en: "Ivory Coast", ar: "ساحل العاج" }
  },

  volumes: [
    {
      id: "vol-01",
      number: 1,
      issue: 1,
      year: 2023,
      date: { fr: "Mai 2023", en: "May 2023", ar: "مايو 2023" },
      sommaire: "pdf/vol-01/sommaire.pdf",
      articles: [
        {
          id: "v1-abderrahim",
          title: "Le rôle du texte littéraire dans l’amélioration des productions écrites des étudiants en classe de FLE",
          titleEn: "",
          authors: ["Abderrahim Ibtissem"],
          affiliation: "Université Mostefa Ben Boulaid, Batna",
          country: "dz",
          pages: "06–18",
          lang: "fr",
          keywords: ["compétence de l’écrit", "FLE", "pratiques scripturales", "texte littéraire", "vocabulaire"],
          abstract:
            "En se basant sur le texte littéraire comme support didactique, ce travail interroge les pratiques scripturales des étudiants universitaires et montre comment son exploitation peut développer la compétence de l’écrit en classe de FLE.",
          pdf: "pdf/vol-01/abderrahim-texte-litteraire-fle.pdf"
        },
        {
          id: "v1-mahiou",
          title: "Perception et envers de l’eldorado à travers les figures de l’exilé dans Les rochers de Poudre d’or de Nathacha Appanah",
          titleEn: "",
          authors: ["Mahiou Asma"],
          affiliation: "École Normale Supérieure de Bouzaréah (ENSB), Alger",
          country: "dz",
          pages: "18–30",
          lang: "fr",
          keywords: ["Eldorado", "exil", "exploitation", "illusion", "renaissance"],
          abstract:
            "À travers le récit de quatre protagonistes engagés pour travailler sur l’île Maurice, l’article interroge ce qui pousse les exilés vers un eldorado et la renaissance à laquelle cette quête les mène.",
          pdf: "pdf/vol-01/mahiou-eldorado-appanah.pdf"
        },
        {
          id: "v1-ghouaidia",
          title: "Objectivité de la presse tunisienne : stratégies discursives et contraintes contextuelles",
          titleEn: "Objectivity in Tunisian press: discursive strategies and contextual restraints",
          authors: ["Jamil Ghouaidia"],
          affiliation: "Université de Gafsa",
          country: "tn",
          pages: "31–41",
          lang: "fr",
          keywords: ["discours de la presse tunisienne", "objectivité", "stratégies d’objectivation", "normes déontologiques et éthiques"],
          abstract:
            "Dans le cadre de l’analyse du discours, cette contribution examine l’impact de la nouvelle conjoncture tunisienne sur la norme d’objectivité et les outils linguistiques qui produisent un effet d’objectivité dans la presse.",
          pdf: "pdf/vol-01/ghouaidia-objectivite-presse-tunisienne.pdf"
        },
        {
          id: "v1-benchenane",
          title: "Analyser les erreurs de l’apprenant en expression orale : une étude de cas des troisièmes année LMD étudiants d’anglais, Université Mustapha Stambouli, Mascara, Algérie",
          titleEn: "Analysing Learner’s Errors in Oral Expression: A Case-Study of Third Year LMD Students of English, University Mustapha Stambouli, Mascara, Algeria",
          authors: ["Benchenane Djamila"],
          affiliation: "Université Mustapha Stambouli, Mascara",
          country: "dz",
          pages: "48–58",
          lang: "en",
          keywords: ["performance orale", "erreurs", "étudiants de troisième année", "hypothèse d’analyse contrastive", "hypothèse d’analyse d’erreurs"],
          abstract:
            "This study focuses on common errors in the oral performance of Algerian university students, using third-year LMD English students at Mustapha Stambouli University as a case study, and suggests effective oral corrective feedback.",
          pdf: "pdf/vol-01/benchenane-erreurs-expression-orale.pdf"
        },
        {
          id: "v1-gacemi",
          title: "Recours à l’arabe des enseignantes de français dans la communication formelle",
          titleEn: "Use of Arabic by French teachers in formal communication",
          authors: ["Gacemi Mohamed"],
          affiliation: "Université Abdelhamid Ibn Badis, Mostaganem",
          country: "dz",
          pages: "59–72",
          lang: "fr",
          keywords: ["pratique enseignante", "alternance codique", "langue maternelle", "pratique langagière", "variable sexe"],
          abstract:
            "À partir d’une recherche doctorale, l’article étudie le rapport entre le recours à l’arabe et la variable sexe chez les enseignantes de français dans les situations de communication formelle.",
          pdf: "pdf/vol-01/gacemi-arabe-enseignantes-francais.pdf"
        }
      ]
    },

    {
      id: "vol-02",
      number: 2,
      issue: 1,
      year: 2024,
      date: { fr: "Mai 2024", en: "May 2024", ar: "مايو 2024" },
      sommaire: "pdf/vol-02/sommaire.pdf",
      articles: [
        {
          id: "v2-bach",
          title: "Approche pragmatique en première lecture d’un corpus de descriptions commerciales de plantes d’intérieur. Théorie et méthodologie",
          titleEn: "Pragmatic Approach to the First-Reading Corpus-Analysis of Commercial Descriptions of Houseplants. Theory and Methodology",
          authors: ["Bach Matthieu"],
          affiliation: "Université de Bourgogne, Centre TIL (EA 4182)",
          country: "fr",
          pages: "05–17",
          lang: "fr",
          keywords: ["analyse de discours", "pragmatique", "figements", "linguistique de corpus", "plantes d’intérieur"],
          abstract:
            "Cette contribution présente une méthode innovante d’analyse du discours issue du management et de la gestion des données, appliquée à un corpus de descriptions commerciales de plantes d’intérieur.",
          pdf: "pdf/vol-02/bach-approche-pragmatique-plantes.pdf"
        },
        {
          id: "v2-varsamidou",
          title: "Le portfolio de l’enseignant comme technique d’évaluation alternative / Critères et modalités de constitution du portfolio personnel",
          titleEn: "The Teacher Portfolio as an Alternative Assessment Technique / Criteria and Procedures for Compiling a Personal Portfolio",
          authors: ["Varsamidou Athéna"],
          affiliation: "Université Aristote de Thessalonique",
          country: "gr",
          pages: "18–27",
          lang: "fr",
          keywords: ["portfolio", "évaluation authentique", "critères d’évaluation", "recrutement des enseignants"],
          abstract:
            "L’article résume les principaux critères d’évaluation du portfolio enseignant et montre son importance dans l’évaluation des enseignants comme dans le recrutement des futurs enseignants.",
          pdf: "pdf/vol-02/varsamidou-portfolio-enseignant.pdf"
        },
        {
          id: "v2-herimanana",
          title: "Influence de l’expérience de l’enseignant sur le choix de théorie d’apprentissage de la lecture et ses impacts sur l’application auprès des élèves",
          titleEn: "Influence of The Teacher’s Experience On the Choice of Learning Reading Theory and Its Impacts On the Application with Students",
          authors: ["Herimanana Aina Fanantenana Bertholin Gérard Jocelyn"],
          affiliation: "Université d’Antananarivo, École doctorale de Sciences Humaines et Sociales",
          country: "mg",
          pages: "28–36",
          lang: "fr",
          keywords: ["expérience de l’enseignant", "élèves", "lecture", "Moramanga", "théorie d’apprentissage"],
          abstract:
            "L’étude met en lumière l’influence de l’expérience des enseignants malgaches sur le choix de théorie d’apprentissage de la lecture et sur son application auprès des élèves.",
          pdf: "pdf/vol-02/herimanana-experience-lecture.pdf"
        },
        {
          id: "v2-likosi",
          title: "Composantes argumentatives et narratives dans la plaidoirie « le détournement intellectuel, les malentendus théoriques » au « procès 100 jours »",
          titleEn: "Argumentative and Narrative Components in The Pleading ‘Intellectual Diversion, Theoretical Misunderstandings’ in The ‘100 Days Trial’",
          authors: ["Likosi Atambana Jean Claude"],
          affiliation: "Université Catholique du Congo",
          country: "cd",
          pages: "37–54",
          lang: "fr",
          keywords: ["Procès 100 jours", "argumentation", "narration", "plaidoirie", "discours judiciaire"],
          abstract:
            "La plaidoirie est examinée en tant qu’art de l’accusation dont on peut dégager l’articulation : l’article observe les composantes argumentatives et narratives d’une plaidoirie prononcée lors du « procès 100 jours ».",
          pdf: "pdf/vol-02/likosi-plaidoirie-proces-100-jours.pdf"
        },
        {
          id: "v2-antwi",
          title: "De l’action dans Les Conquérants d’André Malraux et Vol de nuit d’Antoine de Saint-Exupéry",
          titleEn: "Action in Les Conquérants by André Malraux and Vol de nuit by Antoine de Saint-Exupéry",
          authors: ["Antwi Kwaku Yaya", "Dovonou F. S. Franck", "Odonkor Asare Felix", "Akatsi Heponou Lebene"],
          affiliation: "University of Education, Winneba",
          country: "gh",
          pages: "55–72",
          lang: "fr",
          keywords: ["action", "moyen", "valeurs héroïques", "révolution", "métier"],
          abstract:
            "S’appuyant sur la théorie existentialiste de Sartre, l’étude compare les fondements de l’action dans deux romans de l’entre-deux-guerres et les valeurs héroïques que les deux auteurs y promeuvent.",
          pdf: "pdf/vol-02/antwi-action-malraux-saint-exupery.pdf"
        },
        {
          id: "v2-ndiaye-rousseau",
          title: "La conception de la mort chez Jean-Jacques Rousseau (Les Confessions, les Dialogues et les Rêveries du promeneur solitaire)",
          titleEn: "",
          authors: ["Ndiaye Abdou"],
          affiliation: "Université Cheikh Anta Diop de Dakar, Lettres Modernes",
          country: "sn",
          pages: "73–87",
          lang: "fr",
          keywords: ["art de mourir", "délivrance", "hantise de la mort", "immortalité", "autobiographie moderne"],
          abstract:
            "Lecture critique des stratégies du discours et de l’argumentation des œuvres autobiographiques de Rousseau, montrant comment l’auteur fait preuve de lucidité devant sa fin et propose un art de bien mourir.",
          pdf: "pdf/vol-02/ndiaye-mort-rousseau.pdf"
        }
      ]
    },

    {
      id: "vol-03",
      number: 3,
      issue: 1,
      year: 2025,
      date: { fr: "Mai 2025", en: "May 2025", ar: "مايو 2025" },
      sommaire: "pdf/vol-03/sommaire.pdf",
      articles: [
        {
          id: "v3-camara-vipieres",
          title: "L’hybridité scripturaire romanesque de soi dans Le Nœud de vipères (1932) de François Mauriac",
          titleEn: "The novelistic scriptural hybridity of the self in François Mauriac’s The Viper’s Knot",
          authors: ["Camara Moussa"],
          affiliation: "Université Cheikh Anta Diop de Dakar",
          country: "sn",
          pages: "04–13",
          lang: "fr",
          keywords: ["autobiographie", "confession", "épistolaire", "hybridité", "journal intime", "romanesque"],
          abstract:
            "Le roman mauriacien apparaît comme une archéologie de genres superposés (roman épistolaire, journal intime, confession), où l’emploi de la première personne entérine l’hypothèse d’un récit tourné vers le dévoilement du vécu de l’auteur.",
          pdf: "pdf/vol-03/camara-hybridite-noeud-vipieres.pdf"
        },
        {
          id: "v3-ndiaye-graffigny",
          title: "La forme épistolaire dans Lettres d’une Péruvienne de Madame de Graffigny : entre réalisme narratif, stratégie rhétorique et critique sociale",
          titleEn: "The Epistolary Form in Lettres d’une Péruvienne by Madame de Graffigny: Between Narrative Realism, Rhetorical Strategy, and Social Critique",
          authors: ["Ndiaye Abdou"],
          affiliation: "Université Cheikh Anta Diop de Dakar, Lettres Modernes",
          country: "sn",
          pages: "14–29",
          lang: "fr",
          keywords: ["épistolaire", "critique sociale", "émancipation féminine", "ironie", "inégalités sociales"],
          abstract:
            "L’article explore la structure épistolaire du roman et son rôle dans la critique sociale et féministe : la correspondance donne une voix à Zilia et sert de moyen de critique implicite des mœurs et des institutions de l’époque.",
          pdf: "pdf/vol-03/ndiaye-forme-epistolaire-graffigny.pdf"
        },
        {
          id: "v3-ghdemsi",
          title: "Musiques des animations télévisuelles tunisiennes. Une inscription générique superflue ou une création spécifique fonctionnelle ?",
          titleEn: "Music in Tunisian Television Animations: Superfluous Generic Labeling or Functional Creative Specificity?",
          authors: ["Ghdemsi Imed"],
          affiliation: "I.S. Musique, Université de Sousse",
          country: "tn",
          pages: "30–39",
          lang: "fr",
          keywords: ["Music", "TV animations", "Animated series credits", "Music function"],
          abstract:
            "À partir d’exemples de la filmographie de l’animation tunisienne, l’étude interroge la place et la fonction de la musique dans le discours des œuvres, en relation avec les fonctions du langage de Jakobson.",
          pdf: "pdf/vol-03/ghdemsi-musiques-animations-tunisiennes.pdf"
        },
        {
          id: "v3-benatta",
          title: "Débat politique télévisé, genre et débat du genre",
          titleEn: "Televised Political Debate, Gender and Gender Debate",
          authors: ["Benatta Fatima Zohra"],
          affiliation: "Université Mustapha Stambouli de Mascara",
          country: "dz",
          pages: "40–46",
          lang: "fr",
          keywords: ["discours", "genre", "débat", "politique", "télévisé", "élection présidentielle"],
          abstract:
            "L’étude se propose de définir le genre du discours du débat politique télévisé tout en explorant sa complexité et les différentes théories qui ont analysé ses spécificités.",
          pdf: "pdf/vol-03/benatta-debat-politique-televise.pdf"
        },
        {
          id: "v3-touhami",
          title: "La conception de la conscience sartrienne dans le récit d’autofiction : étude interprétative de La Nuit de Feu d’Éric-Emmanuel Schmitt",
          titleEn: "The Sartrian Conception of Consciousness in the Autofictional Narrative: An Interpretative Study of La Nuit de Feu by Éric-Emmanuel Schmitt",
          authors: ["Touhami Fatima Zohra"],
          affiliation: "Laboratoire Langue, Imaginaire et Création Littéraire, Université de Tiaret",
          country: "dz",
          pages: "47–58",
          lang: "fr",
          keywords: ["conscience", "être-pour-soi", "autofiction", "Sartre", "La Nuit de feu"],
          abstract:
            "En mobilisant la phénoménologie de Sartre exposée dans L’Être et le Néant, l’étude analyse La Nuit de Feu et montre que le récit met en scène le caractère évolutif de la conscience et une quête de soi entre séparation et rencontre.",
          pdf: "pdf/vol-03/touhami-conscience-sartrienne.pdf"
        }
      ]
    },

    {
      id: "vol-04",
      number: 4,
      issue: 1,
      year: 2026,
      date: { fr: "Mars 2026", en: "March 2026", ar: "مارس 2026" },
      sommaire: "pdf/vol-04/sommaire.pdf",
      articles: [
        {
          id: "v4-sokraf",
          title: "Coenseignement augmenté par l’intelligence artificielle : innovation pédagogique et responsabilité sociale en contexte de formation initiale francophone",
          titleEn: "AI-Augmented Co-Teaching: Pedagogical Innovation and Social Responsibility in Francophone Initial Teacher Education",
          authors: ["Sokraf Sahar"],
          affiliation: "Université de Sousse, Faculté des Lettres et Sciences Humaines",
          country: "tn",
          pages: "02–10",
          lang: "fr",
          keywords: ["intelligence artificielle", "coenseignement", "réflexivité", "inclusion", "transformation pédagogique"],
          abstract:
            "Cette contribution examine l’intégration de l’intelligence artificielle dans les pratiques de coenseignement en stage et son potentiel pour le développement professionnel des futurs enseignants, entre appropriation, tensions et régulations.",
          pdf: "pdf/vol-04/sokraf-coenseignement-ia.pdf"
        },
        {
          id: "v4-lagagnon",
          title: "Des stratégies de légitimation dans le discours du rap ivoirien",
          titleEn: "Legitimating strategies of Ivorian rap",
          authors: ["Lagagnon Severin Djedje"],
          affiliation: "",
          country: "ci",
          pages: "11–31",
          lang: "fr",
          keywords: ["stratégies de légitimation", "discours", "rap ivoirien", "analyse discursive", "énonciation"],
          abstract:
            "Dans le cadre théorique de Patrick Charaudeau, l’article cherche ce qui légitime la prise de parole des artistes rappeurs en contexte ivoirien et met au jour une nécessité de dévoilement identitaire.",
          pdf: "pdf/vol-04/lagagnon-rap-ivoirien.pdf"
        },
        {
          id: "v4-camara-nausee",
          title: "L’écriture phénoménologique dans La Nausée (1938) de Jean-Paul Sartre",
          titleEn: "Phenomenological writing in Jean Paul-Sartre’s Nausea (1938)",
          authors: ["Camara Moussa"],
          affiliation: "Université Cheikh Anta Diop de Dakar",
          country: "sn",
          pages: "23–30",
          lang: "fr",
          keywords: ["engagement", "existence", "essence", "objets", "phénoménologie"],
          abstract:
            "L’écriture phénoménologique de La Nausée repose sur une quadruple approche (phénoménologique, existentialiste, psychanalytique et littéraire), où la nausée exprime le malaise du personnage face à la société et justifie l’engagement de l’écrivain.",
          pdf: "pdf/vol-04/camara-nausee-sartre.pdf"
        },
        {
          id: "v4-ndiaye-diderot",
          title: "Le théâtre de la vertu contrariée : mise en scène de l’aliénation morale et sociale dans Le Fils naturel et Le Père de famille de Denis Diderot",
          titleEn: "",
          authors: ["Ndiaye Abdou"],
          affiliation: "Université Cheikh Anta Diop de Dakar, Lettres Modernes",
          country: "sn",
          pages: "",
          lang: "fr",
          keywords: [],
          abstract: "",
          pdf: null
        },
        {
          id: "v4-molou",
          title: "Étude tonale de quelques modalités verbales en baoulé : les cas de l’accompli et du progressif",
          titleEn: "Tonal study of some verbal modalities in Baule: the cases of the accomplished and the progressive",
          authors: ["Molou Kouassi Ange Aristide", "Brouh Achie Patrice Georgelin"],
          affiliation: "Université Félix Houphouët-Boigny ; Université Virtuelle de Côte d’Ivoire",
          country: "ci",
          pages: "49–59",
          lang: "fr",
          keywords: ["accompli", "marque aspectuelle", "modalité verbale", "progressif", "ton"],
          abstract:
            "Cet article étudie les tons qui affectent les positions vocaliques de deux modalités verbales, l’accompli et le progressif, dans le baoulé, langue kwa parlée en Côte d’Ivoire.",
          pdf: "pdf/vol-04/molou-brou-etude-tonale-baoule.pdf"
        },
        {
          id: "v4-nasraoui",
          title: "La persuasion dans le cinéma tunisien : représentation, genre et pouvoir dans Les Silences du Palais et Fleur d’Alep",
          titleEn: "Persuasion in Tunisian cinema: representation, genre and power in Silences du Palais and Fleur d’Alep",
          authors: ["Nasraoui Taycir"],
          affiliation: "",
          country: "tn",
          pages: "60–80",
          lang: "fr",
          keywords: [],
          abstract:
            "En mobilisant l’ethos, le pathos et le logos de la rhétorique aristotélicienne, l’article analyse deux films tunisiens et montre comment ils interrogent les structures de pouvoir patriarcales, coloniales et idéologiques.",
          pdf: "pdf/vol-04/nasraoui-persuasion-cinema-tunisien.pdf"
        }
      ]
    }
  ],

  committee: [
    {
      name: "Soumia CHENTOUF",
      roles: ["editorInChief", "secretary"],
      affiliation: "Université Mustapha Stambouli de Mascara",
      email: "c291bWlhY3JAeWFob28uZnI="
    },
    {
      name: "Abdelkrim BENSELIM",
      roles: ["associateEditor"],
      affiliation: "Université de Aïn Témouchent",
      email: "YmVuc2xpbTIwMTIuYWJkZWxrcmltQGdtYWlsLmNvbQ=="
    },
    {
      name: "Belkacem BOUMEDINI",
      roles: ["associateEditor"],
      affiliation: "Université de Mascara",
      email: "YmJvdW1lZGluaTcwQHlhaG9vLmZy"
    },
    {
      name: "Souad BAHRI",
      roles: ["associateEditor"],
      affiliation: "Université de Aïn Témouchent",
      email: "c291YWQuYmFocmlAdW5pdi10ZW1vdWNoZW50LmVkdS5keg=="
    },
    {
      name: "Hadjer MERBOUH",
      roles: ["associateEditor"],
      affiliation: "",
      email: "aGFkamVyLm1lcmJvdWhAeWFob28uZnI="
    }
  ],

  domains: [
    { fr: "Sciences sociales", en: "Social sciences", ar: "العلوم الاجتماعية" },
    { fr: "Éducation", en: "Education", ar: "التربية" },
    { fr: "Linguistique et langue", en: "Linguistics and language", ar: "اللسانيات واللغة" },
    { fr: "Anthropologie", en: "Anthropology", ar: "الأنثروبولوجيا" },
    { fr: "Communication", en: "Communication", ar: "علوم الاتصال" },
    { fr: "Études culturelles", en: "Cultural studies", ar: "الدراسات الثقافية" },
    { fr: "Études du genre", en: "Gender studies", ar: "دراسات النوع" },
    { fr: "Arts et lettres", en: "Arts and letters", ar: "الآداب والفنون" },
    { fr: "Littérature et théories littéraires", en: "Literature and literary theory", ar: "الأدب ونظرياته" },
    { fr: "Philosophie", en: "Philosophy", ar: "الفلسفة" },
    { fr: "Études religieuses", en: "Religious studies", ar: "الدراسات الدينية" },
    { fr: "Arts visuels et arts de la scène", en: "Visual and performing arts", ar: "الفنون البصرية وفنون الأداء" },
    { fr: "Traduction et interprétation", en: "Translation and interpreting", ar: "الترجمة والتحرير" },
    { fr: "Terminologie et lexicologie", en: "Terminology and lexicology", ar: "المصطلحية وعلم المفردات" }
  ],

  documents: [
    {
      id: "presentation",
      title: { fr: "Présentation de la revue", en: "Journal presentation", ar: "تعريف بالمجلة" },
      file: "pdf/revue/presentation.pdf"
    },
    {
      id: "fiche",
      title: { fr: "Fiche technique", en: "Technical sheet", ar: "البطاقة التقنية" },
      file: "pdf/revue/fiche-technique.pdf"
    },
    {
      id: "comite",
      title: { fr: "Comité éditorial", en: "Editorial committee", ar: "الهيئة التحريرية" },
      file: "pdf/revue/comite-editorial.pdf"
    },
    {
      id: "domaines",
      title: { fr: "Domaines couverts", en: "Fields covered", ar: "المجالات المغطاة" },
      file: "pdf/revue/domaines-couverts.pdf"
    },
    {
      id: "guide",
      title: { fr: "Guide aux auteurs", en: "Author guidelines", ar: "دليل المؤلفين" },
      file: "pdf/revue/guide-auteurs.pdf"
    },
    {
      id: "template",
      title: { fr: "Template d’article", en: "Article template", ar: "قالب المقال" },
      file: "pdf/revue/template-auteur.pdf"
    }
  ]
};
