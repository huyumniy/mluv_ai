import type {
  GrammarContent,
  LessonLibraryItem,
  LessonPlaylistSummary,
  LessonSummary,
  TranscriptLine,
  VocabularyItem,
} from "../lesson.types";
import atTheRestaurantImage from "@/shared/assets/images/at-the-restaurant.png"
import spellCheckImage from "@/shared/assets/images/spell-check.png";
import audio from "@/shared/assets/audios/lesson.mp3";
import temp from "@/shared/assets/audios/temp.mp3";



/* -------------------------------------------------- */
/* LESSONS */
/* -------------------------------------------------- */

export const lessonSummaries: LessonSummary[] = [
  {
    id: "lesson-restaurant-a2",
    type: "lesson",

    title: "At the Restaurant",
    description:
      "Learn practical Czech phrases for ordering food, asking about the menu, speaking with waiters, and paying the bill.",

    level: "A2",
    topic: "Food and restaurants",

    durationMinutes: 18,
    phraseCount: 28,
    progress: 65,

    imageSrc: atTheRestaurantImage,
    audioSrc: temp,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-07-12T10:30:00.000Z",
    updatedAt: "2026-08-02T18:15:00.000Z",

    status: "continue",

    folderIds: [
      "folder-daily-life",
      "folder-vocabulary",
    ],
  },

  {
    id: "lesson-doctor-a2",
    type: "lesson",

    title: "At the Doctor",
    description:
      "Learn how to describe symptoms, understand basic questions from a doctor, and talk about pain and medication.",

    level: "A2",
    topic: "Health",

    durationMinutes: 19,
    phraseCount: 31,
    progress: 35,

    imageSrc: spellCheckImage,
    audioSrc: temp,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-08-05T09:20:00.000Z",
    updatedAt: "2026-08-12T18:40:00.000Z",

    status: "continue",

    folderIds: [
      "folder-daily-life",
      "folder-vocabulary",
    ],
  },

  {
    id: "lesson-factory-instructions-a2",
    type: "lesson",

    title: "Factory Instructions",
    description:
      "Practice common Czech instructions used at work, including safety commands, machine operation, and production tasks.",

    level: "A2",
    topic: "Work",

    durationMinutes: 24,
    phraseCount: 38,
    progress: 75,

    imageSrc: spellCheckImage,
    audioSrc: audio,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-08-07T06:30:00.000Z",
    updatedAt: "2026-09-01T14:10:00.000Z",

    status: "continue",

    folderIds: [
      "folder-work",
      "folder-custom-factory-czech",
      "folder-verbs",
    ],
  },

  {
    id: "lesson-perfective-verbs-b1",
    type: "lesson",

    title: "Perfective vs Imperfective Verbs",
    description:
      "Understand how Czech speakers choose between completed and ongoing actions using perfective and imperfective verbs.",

    level: "B1",
    topic: "Verb aspect",

    durationMinutes: 28,
    phraseCount: 44,
    progress: 0,

    imageSrc: spellCheckImage,
    audioSrc: temp,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-08-10T17:15:00.000Z",
    updatedAt: "2026-08-10T17:15:00.000Z",

    status: "not-started",

    folderIds: [
      "folder-verbs",
      "folder-grammar",
    ],
  },

  {
    id: "lesson-small-talk-a1",
    type: "lesson",

    title: "Everyday Small Talk",
    description:
      "Learn simple Czech expressions for greetings, weather, weekends, work, and short everyday conversations.",

    level: "A1",
    topic: "Daily conversation",

    durationMinutes: 12,
    phraseCount: 21,
    progress: 100,

    imageSrc: atTheRestaurantImage,
    audioSrc: audio,

    availableFiles: ["mp3"],

    createdAt: "2026-07-02T12:00:00.000Z",
    updatedAt: "2026-08-18T20:15:00.000Z",

    status: "listened",

    folderIds: [
      "folder-daily-life",
      "folder-vocabulary",
    ],
  },

  {
    id: "lesson-phone-calls-a2",
    type: "lesson",

    title: "Making Phone Calls",
    description:
      "Practice answering the phone, asking for someone, leaving messages, and arranging appointments in Czech.",

    level: "A2",
    topic: "Communication",

    durationMinutes: 17,
    phraseCount: 27,
    progress: 15,

    imageSrc: atTheRestaurantImage,
    audioSrc: temp,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-08-14T11:30:00.000Z",
    updatedAt: "2026-08-20T16:05:00.000Z",

    status: "continue",

    folderIds: [
      "folder-daily-life",
      "folder-work",
    ],
  },

  {
    id: "lesson-czech-cases-b1",
    type: "lesson",

    title: "Czech Cases in Practice",
    description:
      "Practice the most common Czech case patterns through practical sentences rather than isolated grammar tables.",

    level: "B1",
    topic: "Cases",

    durationMinutes: 34,
    phraseCount: 52,
    progress: 5,

    imageSrc: spellCheckImage,
    audioSrc: audio,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-08-21T19:20:00.000Z",
    updatedAt: "2026-08-25T08:50:00.000Z",

    status: "continue",

    folderIds: [
      "folder-grammar",
      "folder-custom-difficult-phrases",
    ],
  },

  {
    id: "lesson-apartment-problems-a2",
    type: "lesson",

    title: "Problems in the Apartment",
    description:
      "Learn how to explain problems with heating, water, electricity, appliances, and repairs to a landlord.",

    level: "A2",
    topic: "Housing",

    durationMinutes: 20,
    phraseCount: 33,
    progress: 0,

    imageSrc: atTheRestaurantImage,
    audioSrc: temp,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-08-27T15:10:00.000Z",
    updatedAt: "2026-08-27T15:10:00.000Z",

    status: "not-started",

    folderIds: [
      "folder-daily-life",
      "folder-vocabulary",
    ],
  },

  {
    id: "lesson-shift-conversation-a2",
    type: "lesson",

    title: "Talking During a Work Shift",
    description:
      "Learn practical Czech for asking coworkers for help, reporting problems, changing tasks, and talking about breaks.",

    level: "A2",
    topic: "Workplace",

    durationMinutes: 23,
    phraseCount: 36,
    progress: 55,

    imageSrc: spellCheckImage,
    audioSrc: audio,

    availableFiles: ["mp3"],

    createdAt: "2026-08-30T05:45:00.000Z",
    updatedAt: "2026-09-10T17:25:00.000Z",

    status: "continue",

    folderIds: [
      "folder-work",
      "folder-custom-factory-czech",
    ],
  },

  {
    id: "lesson-pronouns-a2",
    type: "lesson",

    title: "Personal and Reflexive Pronouns",
    description:
      "Practice Czech personal, object, and reflexive pronouns in common conversational situations.",

    level: "A2",
    topic: "Pronouns",

    durationMinutes: 21,
    phraseCount: 34,
    progress: 100,

    imageSrc: spellCheckImage,
    audioSrc: temp,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-07-19T14:30:00.000Z",
    updatedAt: "2026-08-16T10:00:00.000Z",

    status: "listened",

    folderIds: [
      "folder-grammar",
      "folder-custom-difficult-phrases",
    ],
  },

  {
    id: "lesson-train-station-a1",
    type: "lesson",

    title: "At the Train Station",
    description:
      "Learn how to buy tickets, ask about platforms, understand delays, and find the right train.",

    level: "A1",
    topic: "Travel",

    durationMinutes: 15,
    phraseCount: 26,
    progress: 0,

    imageSrc: atTheRestaurantImage,
    audioSrc: audio,

    availableFiles: ["mp3", "pdf"],

    createdAt: "2026-09-02T13:00:00.000Z",
    updatedAt: "2026-09-02T13:00:00.000Z",

    status: "not-started",

    folderIds: [
      "folder-daily-life",
      "folder-vocabulary",
    ],
  },
];


/* -------------------------------------------------- */
/* PLAYLISTS */
/* -------------------------------------------------- */

export const lessonPlaylists: LessonPlaylistSummary[] = [
  {
    id: "playlist-workplace-czech",
    type: "playlist",

    title: "Czech at Work",
    description:
      "A practical sequence of lessons for communicating with coworkers, understanding instructions, and handling everyday workplace situations.",

    topic: "Work",

    imageSrc: spellCheckImage,

    lessonIds: [
      "lesson-factory-instructions-a2",
      "lesson-phone-calls-a2",
      "lesson-shift-conversation-a2",
    ],

    folderIds: [
      "folder-work",
      "folder-custom-factory-czech",
    ],

    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-09-10T17:25:00.000Z",
  },

  {
    id: "playlist-grammar-essentials",
    type: "playlist",

    title: "Grammar Essentials",
    description:
      "A focused Czech grammar playlist covering verb aspect, cases, and pronouns through practical examples.",

    topic: "Grammar",

    imageSrc: spellCheckImage,

    lessonIds: [
      "lesson-perfective-verbs-b1",
      "lesson-czech-cases-b1",
      "lesson-pronouns-a2",
    ],

    folderIds: [
      "folder-grammar",
      "folder-verbs",
    ],

    createdAt: "2026-08-10T12:00:00.000Z",
    updatedAt: "2026-09-04T13:30:00.000Z",
  },

  {
    id: "playlist-everyday-czech",
    type: "playlist",

    title: "Everyday Czech",
    description:
      "Useful Czech for common daily situations including restaurants, doctors, housing, small talk, and travel.",

    topic: "Daily life",

    imageSrc: atTheRestaurantImage,

    lessonIds: [
      "lesson-small-talk-a1",
      "lesson-restaurant-a2",
      "lesson-doctor-a2",
      "lesson-apartment-problems-a2",
      "lesson-train-station-a1",
    ],

    folderIds: [
      "folder-daily-life",
      "folder-vocabulary",
    ],

    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-09-02T13:00:00.000Z",
  },
];


/* -------------------------------------------------- */
/* EVERYTHING DISPLAYABLE IN THE LIBRARY */
/* -------------------------------------------------- */

export const lessonLibraryItems: LessonLibraryItem[] = [
  ...lessonPlaylists,
  ...lessonSummaries,
];


/* -------------------------------------------------- */
/* LESSON CONTENT */
/* -------------------------------------------------- */

export const restaurantTranscript: TranscriptLine[] = [
  {
    id: "transcript-restaurant-1",
    original: "Dobrý den, vítejte v naší restauraci.",
    originalSlowed:
      "Dobrý... den..., vítejte... v... naší... restauraci.",
    translation:
      "Good afternoon, welcome to our restaurant.",
  },
  {
    id: "transcript-restaurant-2",
    original: "Máte rezervaci?",
    originalSlowed:
      "Máte... rezervaci?",
    translation:
      "Do you have a reservation?",
  },
  {
    id: "transcript-restaurant-3",
    original:
      "Ano, rezervace je na jméno Novák.",
    originalSlowed:
      "Ano..., rezervace... je... na... jméno... Novák.",
    translation:
      "Yes, the reservation is under the name Novák.",
  },
  {
    id: "transcript-restaurant-4",
    original: "Co si dáte k pití?",
    originalSlowed:
      "Co... si... dáte... k... pití?",
    translation:
      "What would you like to drink?",
  },
  {
    id: "transcript-restaurant-5",
    original:
      "Dám si minerální vodu, prosím.",
    originalSlowed:
      "Dám... si... minerální... vodu..., prosím.",
    translation:
      "I’ll have mineral water, please.",
  },
  {
    id: "transcript-restaurant-6",
    original: "Už jste si vybrali?",
    originalSlowed:
      "Už... jste... si... vybrali?",
    translation:
      "Have you already chosen?",
  },
  {
    id: "transcript-restaurant-7",
    original:
      "Ano, dám si kuřecí řízek s bramborami.",
    originalSlowed:
      "Ano..., dám... si... kuřecí... řízek... s... bramborami.",
    translation:
      "Yes, I’ll have chicken schnitzel with potatoes.",
  },
  {
    id: "transcript-restaurant-8",
    original:
      "Mohu dostat účet, prosím?",
    originalSlowed:
      "Mohu... dostat... účet..., prosím?",
    translation:
      "Can I have the bill, please?",
  },
];


export const verbVocabulary: VocabularyItem[] = [
  {
    id: "vocabulary-verb-1",
    title: "Imperfective verb",
    word: "číst",
    translation: "to read",
    note:
      "Describes an ongoing or repeated action.",
  },
  {
    id: "vocabulary-verb-2",
    title: "Perfective verb",
    word: "přečíst",
    translation: "to finish reading",
    note:
      "Describes a completed action.",
    highlighted: true,
  },
  {
    id: "vocabulary-verb-3",
    title: "Time expression",
    word: "dvě hodiny",
    translation: "for two hours",
    note:
      "Used to describe a duration.",
  },
  {
    id: "vocabulary-verb-4",
    title: "Time expression",
    word: "včera",
    translation: "yesterday",
  },
  {
    id: "vocabulary-verb-5",
    title: "Imperfective verb",
    word: "psát",
    translation: "to write",
    note:
      "An ongoing or repeated writing action.",
  },
  {
    id: "vocabulary-verb-6",
    title: "Perfective verb",
    word: "napsat",
    translation: "to write and finish",
    note:
      "A completed writing action.",
    highlighted: true,
  },
];


export const reflexivePronounsGrammar: GrammarContent = {
  title: "Reflexive pronouns se and si",

  paragraphs: [
    "Czech uses the reflexive pronouns se and si when the subject performs an action that refers back to itself.",
    "The pronoun se is normally used with verbs that do not require an indirect object. The pronoun si is used when the action is done for oneself or to oneself.",
    "Some Czech verbs always appear with se or si. In these cases, the reflexive pronoun is part of the verb and should be learned together with it.",
  ],

  points: [
    "učit se — to learn",
    "dívat se — to watch",
    "dát si — to have or order something for oneself",
    "koupit si — to buy something for oneself",
  ],
};


export const pastTenseGrammar: GrammarContent = {
  title: "Forming the Czech past tense",

  paragraphs: [
    "The Czech past tense is formed with a past participle and a form of the auxiliary verb být.",
    "The past participle changes according to the gender and number of the subject.",
    "In the third person, the auxiliary verb is omitted.",
  ],

  points: [
    "Já jsem pracoval. — I worked. Masculine speaker.",
    "Já jsem pracovala. — I worked. Feminine speaker.",
    "On pracoval. — He worked.",
    "Ona pracovala. — She worked.",
    "Oni pracovali. — They worked.",
  ],
};


/* -------------------------------------------------- */
/* CONVENIENT SINGLE MOCKS */
/* -------------------------------------------------- */

export const restaurantLesson =
  lessonSummaries.find(
    (lesson) =>
      lesson.id === "lesson-restaurant-a2",
  )!;

export const factoryLesson =
  lessonSummaries.find(
    (lesson) =>
      lesson.id ===
      "lesson-factory-instructions-a2",
  )!;

export const verbAspectLesson =
  lessonSummaries.find(
    (lesson) =>
      lesson.id ===
      "lesson-perfective-verbs-b1",
  )!;

export const workplacePlaylist =
  lessonPlaylists.find(
    (playlist) =>
      playlist.id ===
      "playlist-workplace-czech",
  )!;


export const verbConstructionsLesson = lessonSummaries[1];
export const pastTenseLesson = lessonSummaries[2];