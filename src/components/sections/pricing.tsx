"use client";

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Build your first full app or MVP',
      priceMonthly: '25',
      priceYearly: '20',
      credits: '100 credits',
      features: [
        '100 credits',
        'Unlimited projects',
        'Full Agentic mode access',
        'Email support',
      ],
      variant: 'starter',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    },
    {
      name: 'Growth',
      description: 'Build your first full app or MVP',
      priceMonthly: '69',
      priceYearly: '55',
      credits: '250 credits',
      features: [
        '250 credits',
        'Export full codebase',
        'Custom domains',
        'Dedicated support channel on Whatsapp',
      ],
      variant: 'growth',
      popular: true,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH,
    },
    {
      name: 'Professional',
      description: 'For advanced builders and continuous development',
      priceMonthly: '129',
      priceYearly: '103',
      credits: '500 credits',
      features: [
        '500 credits',
        'Everything in Growth',
        'Premium support',
        'Early access to new features',
      ],
      variant: 'professional',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL,
    },
    {
      name: 'Business',
      description: 'For teams managing multiple products',
      priceMonthly: '299',
      priceYearly: '239',
      credits: '1000 credits',
      features: [
        '1,000 credits',
        'Everything in Professional',
        'Dedicated success manager',
        'Custom integrations',
      ],
      variant: 'business',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,
    },
  ];

    const getCardStyles = (variant: string) => {
      switch (variant) {
        case 'starter':
          return 'card-starter-grainy';
        case 'growth':
          return 'card-growth-grainy';
        case 'professional':
          return 'card-pro-grainy';
        case 'business':
          return 'card-business-grainy';
        default:
          return 'bg-background text-foreground';
      }
    };

    const getButtonStyles = (variant: string) => {
      if (variant === 'growth') {
        return 'bg-white text-black hover:bg-white/90 shadow-sm';
      }
      return 'bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all';
    };

    return (
      <section id="pricing" className="relative py-20 lg:py-32 bg-background overflow-hidden">
        {/* Subtle Pinkish Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-pink-100/20 blur-[120px] rounded-full pointer-events-none z-0" />
        
        {/* Background Grid Pattern Overlay (Visual only) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
          <div className="grid-overlay h-full w-full"></div>
        </div>

        <div className="container relative z-10 px-6 lg:px-14">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4 text-center">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl">
              Choose the plan that's right for you and start building your next big idea today.
            </p>

            <Tabs 
              defaultValue="monthly" 
              onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
              className="w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
            {billingCycle === 'yearly' && (
              <p className="mt-4 text-sm font-semibold text-blue-500">
                Save up to 20% with yearly billing
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1314px] mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative flex flex-col p-8 rounded-2xl transition-transform duration-300 hover:scale-[1.02] overflow-hidden ${getCardStyles(
                  plan.variant
                )}`}
              >
                {/* Content wrapper to stay above grainy overlay */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Plan Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                      {plan.popular && (
                        <span className="text-[10px] font-mono uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className={`text-[13px] leading-relaxed mb-8 opacity-70`}>
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tighter">
                        ${billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly}
                      </span>
                      <span className="text-[14px] opacity-60">/month</span>
                    </div>
                    <div className="mt-4 text-[13px] font-medium opacity-60">
                      {plan.credits}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-xl text-[14px] font-semibold mb-10 transition-colors ${getButtonStyles(
                      plan.variant
                    )}`}
                    onClick={async () => {
                      if (!plan.priceId) {
                        window.location.href = "/builder";
                        return;
                      }

                      const res = await fetch("/api/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ priceId: plan.priceId }),
                      });

                      if (!res.ok) {
                        window.location.href = "/builder";
                        return;
                      }

                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url as string;
                      }
                    }}
                  >
                    Get started
                  </button>

                  {/* Features List */}
                  <div className="space-y-4 mt-auto">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={3} />
                        <span className="text-[14px] leading-tight font-medium opacity-90">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

export default PricingSection;
