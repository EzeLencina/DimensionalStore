'use client';

import { useState } from 'react';
import { cn } from '@lib/helpers/cn';
import { Section, Container } from '@components/layout';
import { ProgressIndicator } from '../progress';
import { CustomerForm } from '../customer';
import { AddressForm } from '../address';
import { ShippingSelector } from '../shipping';
import { PaymentMethods } from '../payment';
import { OrderSummary } from '../summary';
import { OrderConfirmation } from '../confirmation';
import type { CheckoutStepId, CheckoutCustomer, CheckoutAddress, CheckoutShippingMethod } from '../mock-data';

type CheckoutStepsProps = {
  className?: string;
};

export function CheckoutSteps({ className }: CheckoutStepsProps) {
  const [step, setStep] = useState<CheckoutStepId>('customer');
  const [customer, setCustomer] = useState<CheckoutCustomer | null>(null);
  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [shipping, setShipping] = useState<CheckoutShippingMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const goTo = (s: CheckoutStepId) => setStep(s);

  const stepIndex = ['customer', 'address', 'shipping', 'payment', 'confirmation'];
  const currentIndex = stepIndex.indexOf(step);

  return (
    <Section spacing="md" className={cn('min-h-screen', className)}>
      <Container>
        <div className="max-w-5xl mx-auto">
          <ProgressIndicator currentStep={step} className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
                {step === 'customer' && (
                  <CustomerForm
                    onNext={(data) => { setCustomer(data); goTo('address'); }}
                  />
                )}
                {step === 'address' && (
                  <AddressForm
                    onNext={(data) => { setAddress(data); goTo('shipping'); }}
                    onBack={() => goTo('customer')}
                  />
                )}
                {step === 'shipping' && (
                  <ShippingSelector
                    onNext={(method) => { setShipping(method); goTo('payment'); }}
                    onBack={() => goTo('address')}
                  />
                )}
                {step === 'payment' && (
                  <PaymentMethods
                    onNext={(method) => { setPaymentMethod(method); goTo('confirmation'); }}
                    onBack={() => goTo('shipping')}
                  />
                )}
                {step === 'confirmation' && (
                  <OrderConfirmation
                    shippingMethod={shipping}
                    paymentMethod={paymentMethod ? { id: paymentMethod, name: paymentMethod, description: '', icon: '' } : null}
                  />
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 z-10">
                <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
                  <OrderSummary
                    shippingMethod={shipping}
                    paymentMethod={paymentMethod ? { id: paymentMethod, name: paymentMethod, description: '', icon: '' } : null}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
