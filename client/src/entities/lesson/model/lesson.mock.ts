import type {
  GrammarContent,
  LessonSummary,
  TranscriptLine,
  VocabularyItem,
} from "./lesson.types";
import atTheRestaurantImage from "@/shared/assets/images/at-the-restaurant.png"

export const lessonSummaries: LessonSummary[] = [
  {
    id: "lesson-restaurant-a2",
    title: "At the Restaurant",
    level: "A2",
    topic: "Food and restaurants",
    durationMinutes: 18,
    phraseCount: 28,
    imageSrc: atTheRestaurantImage,
    progress: 65,
  },
  {
    id: "lesson-verb-constructions-a1",
    title: "Verb Constructions",
    level: "A1",
    topic: "Grammar",
    durationMinutes: 16,
    phraseCount: 50,
    imageSrc: "/images/lessons/verbs.png",
    progress: 20,
  },
  {
    id: "lesson-past-tense-a2",
    title: "Past Tense 1",
    level: "A2",
    topic: "Past tense",
    durationMinutes: 22,
    phraseCount: 35,
    imageSrc: "/images/lessons/past-tense.png",
    progress: 0,
  },
  {
    id: "lesson-shopping-a1",
    title: "Shopping in Czech",
    level: "A1",
    topic: "Shopping",
    durationMinutes: 14,
    phraseCount: 24,
    imageSrc: "/images/lessons/shopping.png",
    progress: 100,
  },
  {
    id: "lesson-workplace-b1",
    title: "Conversations at Work",
    level: "B1",
    topic: "Work and communication",
    durationMinutes: 27,
    phraseCount: 42,
    imageSrc: "/images/lessons/workplace.png",
    progress: 40,
  },
  {
    id: "lesson-travel-b2",
    title: "Handling Travel Problems",
    level: "B2",
    topic: "Travel",
    durationMinutes: 31,
    phraseCount: 46,
    imageSrc: "/images/lessons/travel.png",
    progress: 10,
  },
];

export const restaurantTranscript: TranscriptLine[] = [
  {
    id: "transcript-restaurant-1",
    original: "Dobrý den, vítejte v naší restauraci.",
    translation: "Good afternoon, welcome to our restaurant.",
  },
  {
    id: "transcript-restaurant-2",
    original: "Máte rezervaci?",
    translation: "Do you have a reservation?",
  },
  {
    id: "transcript-restaurant-3",
    original: "Ano, rezervace je na jméno Novák.",
    translation: "Yes, the reservation is under the name Novák.",
  },
  {
    id: "transcript-restaurant-4",
    original: "Co si dáte k pití?",
    translation: "What would you like to drink?",
  },
  {
    id: "transcript-restaurant-5",
    original: "Dám si minerální vodu, prosím.",
    translation: "I’ll have mineral water, please.",
  },
  {
    id: "transcript-restaurant-6",
    original: "Už jste si vybrali?",
    translation: "Have you already chosen?",
  },
  {
    id: "transcript-restaurant-7",
    original: "Ano, dám si kuřecí řízek s bramborami.",
    translation: "Yes, I’ll have chicken schnitzel with potatoes.",
  },
  {
    id: "transcript-restaurant-8",
    original: "Mohu dostat účet, prosím?",
    translation: "Can I have the bill, please?",
  },
];

export const verbVocabulary: VocabularyItem[] = [
  {
    id: "vocabulary-verb-1",
    title: "Imperfective verb",
    word: "číst",
    translation: "to read",
    note: "Describes an ongoing or repeated action.",
  },
  {
    id: "vocabulary-verb-2",
    title: "Perfective verb",
    word: "přečíst",
    translation: "to finish reading",
    note: "Describes a completed action.",
    highlighted: true,
  },
  {
    id: "vocabulary-verb-3",
    title: "Time expression",
    word: "dvě hodiny",
    translation: "for two hours",
    note: "Used to describe a duration.",
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
    note: "An ongoing or repeated writing action.",
  },
  {
    id: "vocabulary-verb-6",
    title: "Perfective verb",
    word: "napsat",
    translation: "to write and finish",
    note: "A completed writing action.",
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

export const restaurantLesson = lessonSummaries[0];
export const verbConstructionsLesson = lessonSummaries[1];
export const pastTenseLesson = lessonSummaries[2];