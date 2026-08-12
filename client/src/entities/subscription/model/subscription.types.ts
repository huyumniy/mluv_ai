export type BillingInterval =
  | "monthly"
  | "yearly";

export type SubscriptionPlanCode =
  | "free"
  | "plus"
  | "pro";

export interface PlanFeature {
  id: string;
  label: string;
  included: boolean;
}


export interface PlanPrice {
  amount: number;
  currency: "EUR" | "CZK" | "USD";
  interval: BillingInterval;
}

export interface SubscriptionPlan {
  code: SubscriptionPlanCode;

  name: string;
  description: string;

  prices: {
    monthly: PlanPrice;
    yearly: PlanPrice;
  };

  features: PlanFeature[];

  highlighted?: boolean;
}
