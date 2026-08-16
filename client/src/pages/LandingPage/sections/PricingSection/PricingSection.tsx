import { useState } from "react";
import styles from "./PricingSection.module.css";
import { subscriptionPlans } from "@/entities/subscription/model";
import type { BillingInterval, PlanPrice } from "@/entities/subscription/model";
import { Button } from "@/shared/ui/Button";
import { CheckCircleIcon } from "@/shared/assets/icons/CheckCircleIcon";

export function PricingSection() {
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("monthly");
  const planHandler = () => {
    setBillingInterval((current) =>
      current === "monthly" ? "yearly" : "monthly",
    );
  };

  const getCurrencySymbol = (price: PlanPrice) => {
    switch (price.currency) {
      case "EUR":
        return "€";
      case "CZK":
        return "Kč";
      case "USD":
        return "$";
      default:
        break;
    }
  };

  return (
    <section id="pricing" className={styles.section}>
      <header>
        <div className={styles.eyebrow}>PRICING</div>
        <div className={styles.title}>
          Practice made for the way
          <br />
          people actually learn.
        </div>
        <div className={styles.description}>
          No fake urgency. Upgrade when the free plan becomes too small.
        </div>
      </header>
      <div className={styles.content}>
        <Button
          variant="secondary"
          size="sm"
          onClick={planHandler}
          className={styles.planSwitch}
        >
          {billingInterval}
        </Button>
        <div className={styles.plans}>
          {subscriptionPlans.map((plan) => {
            const price = plan.prices[billingInterval];
            return (
              <div data-active={plan.highlighted} className={styles.plan}>
                {plan.highlighted && (
                    <div className={styles.tip}>
                        Best Choise
                    </div>
                )}
                <div className={styles.planTitle}>{plan.code}</div>
                <div className={styles.price}>
                  <div className={styles.priceCurrency}>
                    {getCurrencySymbol(price)}
                  </div>
                  <div className={styles.priceAmount}>{price.amount}</div>
                  <div className={styles.priceInterval}>/ {price.interval}</div>
                </div>
                <div className={styles.featuresList}>
                  {plan.features.map((feature) => (
                    <div className={styles.feature}>
                      <CheckCircleIcon className={styles.checkCircleIcon} />{" "}
                      {feature.label}
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  variant={plan.highlighted ? "primary" : "secondary"}
                >
                  Choose {plan.code}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
