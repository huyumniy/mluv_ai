import wordOrder from "@/shared/assets/images/word-order.png";
import pastTense from "@/shared/assets/images/past-tense.png";
import nounGender from "@/shared/assets/images/noun-gender.png";
import verbAspect from "@/shared/assets/images/verb-aspect.png";
import dailyConversation from "@/shared/assets/images/daily-conversation.png";
import restaurant from "@/shared/assets/images/at-the-restaurant.png";
import doctor from "@/shared/assets/images/at-the-doctor.png";
import travelVocabulary from "@/shared/assets/images/travel-vocabulary.png";
import questions from "@/shared/assets/images/questions.png";
import pronouns from "@/shared/assets/images/pronouns.png";
import numbers from "@/shared/assets/images/numbers.png";
import smallTalk from "@/shared/assets/images/small-talk.png";
import type { Topic } from "./topic.types";

export const topics: Topic[] = [
  {
    id: "past-tense",
    label: "Past Tense",
    image: pastTense,
  },
  {
    id: "noun-gender",
    label: "Noun Gender",
    image: nounGender,
  },
  {
    id: "verb-aspect",
    label: "Verb Aspect",
    image: verbAspect,
  },
  {
    id: "daily-conversation",
    label: "Daily Conversation",
    image: dailyConversation,
  },
  {
    id: "restaurant",
    label: "At the Restaurant",
    image: restaurant,
  },
  {
    id: "doctor",
    label: "At the Doctor",
    image: doctor,
  },
  {
    id: "travel",
    label: "Travel Vocabulary",
    image: travelVocabulary,
  },
  {
    id: "questions",
    label: "Questions",
    image: questions,
  },
  {
    id: "pronouns",
    label: "Pronouns",
    image: pronouns,
  },
  {
    id: "word-order",
    label: "Word Order",
    image: wordOrder,
  },
  {
    id: "numbers",
    label: "Numbers",
    image: numbers,
  },
  {
    id: "small-talk",
    label: "Small Talk",
    image: smallTalk,
  },
];
