import type { SubscriptionPlan } from "./subscription.types";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    code: "free",

    name: "Free",
    description:
      "Try Mluv and start learning Czech.",

    prices: {
      monthly: {
        amount: 0,
        currency: "EUR",
        interval: "monthly",
      },
      yearly: {
        amount: 0,
        currency: "EUR",
        interval: "yearly"
      }
    },

    features: [
      {
        id: "lessons",
        label: "3 generated lessons per month",
        included: true,
      },
      {
        id: "audio",
        label: "Natural Czech audio",
        included: true,
      },
      {
        id: "downloads",
        label: "Offline downloads",
        included: false,
      },
    ],
  },

  {
    code: "plus",

    name: "Plus",
    description:
      "For learners who practice regularly.",

    highlighted: true,

    prices: {
      monthly: {
        amount: 999,
        currency: "EUR",
        interval: "monthly",
      },

      yearly: {
        amount: 8999,
        currency: "EUR",
        interval: "yearly",
      },
    },

    features: [
      {
        id: "lessons",
        label: "Unlimited generated lessons",
        included: true,
      },
      {
        id: "audio",
        label: "Natural + slow Czech audio",
        included: true,
      },
      {
        id: "downloads",
        label: "MP3 and PDF downloads",
        included: true,
      },
      {
        id: "repetition",
        label: "Smart repetition",
        included: true,
      },
    ],
  },

  {
    code: "pro",

    name: "Pro",
    description:
      "Everything you need for serious Czech learning.",

    prices: {
      monthly: {
        amount: 1599,
        currency: "EUR",
        interval: "monthly",
      },

      yearly: {
        amount: 13999,
        currency: "EUR",
        interval: "yearly",
      },
    },

    features: [
      {
        id: "everything-plus",
        label: "Everything in Plus",
        included: true,
      },
      {
        id: "advanced-ai",
        label: "Advanced AI lesson generation",
        included: true,
      },
      {
        id: "priority-generation",
        label: "Priority lesson generation",
        included: true,
      },
    ],
  },
];

export const freePlan = subscriptionPlans[0];
export const plusPlan = subscriptionPlans[1];
export const proPlan = subscriptionPlans[2];
