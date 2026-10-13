import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Container, PageHero } from "@/components/site/Blocks";
import { pageMeta } from "@/lib/metadata";

export const Route = createFileRoute("/refunds")({
  head: () =>
    pageMeta(
      "Refund and Cancellation Policy",
      "Understand refund requests, participant cancellations and event changes for paid Elite Forums programmes.",
      "/refunds",
    ),
  component: Refunds,
});

function Refunds() {
  return (
    <>
      <PageHero
        eyebrow="Payments and events"
        title="Refund policy"
        intro="Clear terms for paid programmes, event cancellations and registration changes."
      />
      <section className="section-space">
        <Container className="max-w-4xl">
          <p className="eyebrow text-electric">Last updated: 13 October 2026</p>
          <div className="mt-6 border border-electric/30 bg-electric/5 p-5 text-sm text-muted-foreground">
            This India-focused policy is a general template and is not legal advice. The
            organisation operating each paid programme must publish the event-specific price, taxes,
            cancellation window, refund method and legal entity before accepting payment.
          </div>
          <div className="reading-copy mt-8 space-y-10">
            <PolicySection title="1. When this policy applies">
              <p>
                This policy applies only when Elite Forums or an authorised programme partner
                charges a fee for an event, workshop, bootcamp, membership or other service. Free
                registrations are not purchases and normally have no refund amount.
              </p>
              <p>
                The event page, checkout or invoice may contain additional terms. If those terms
                conflict with this policy, the event-specific terms apply to that purchase, subject
                to mandatory rights under applicable consumer law.
              </p>
            </PolicySection>
            <PolicySection title="2. Prices, taxes and payment">
              <p>
                The amount payable, applicable taxes, inclusions, payment provider, currency and
                payment deadline will be displayed before you confirm a purchase. Payment
                credentials should be entered only into the authorised payment provider’s secure
                checkout; Elite Forums will not ask for an OTP, PIN or card password by email, phone
                or ordinary form.
              </p>
            </PolicySection>
            <PolicySection title="3. Participant cancellation">
              <p>
                Unless the event page states a different window, request a cancellation through the
                official contact channel at least 7 days before the published start time. Any
                eligible refund will be returned to the original payment method after applicable
                payment-provider charges or lawful deductions are disclosed.
              </p>
              <p>
                No-show registrations, late cancellation, partially used programmes and
                registrations obtained through inaccurate information may be non-refundable where
                the event-specific terms clearly say so and applicable law permits.
              </p>
            </PolicySection>
            <PolicySection title="4. Event cancellation or material change">
              <p>
                If we cancel an event, materially change its date or cannot provide the purchased
                service, we will notify registered purchasers and explain the available
                alternatives, such as transfer, rescheduling or a refund. The remedy will depend on
                the nature of the change and applicable law.
              </p>
              <p>
                Venue restrictions, public emergencies, severe weather, transport disruption or
                other events outside reasonable control may require a change. We will communicate
                promptly and act fairly, without limiting non-excludable consumer rights.
              </p>
            </PolicySection>
            <PolicySection title="5. How to request a refund">
              <p>
                Contact us from the email used for the purchase and include your name, order or
                registration reference, event, payment date, amount and reason. Do not include card
                numbers, passwords or OTPs. We may verify the request before processing it.
              </p>
              <p>
                Approved refunds are initiated within the timeline stated in the event terms or, if
                none is stated, within a reasonable period. Banks and payment providers may take
                additional time to credit the amount.
              </p>
            </PolicySection>
            <PolicySection title="6. Complaints and legal rights">
              <p>
                If you are not satisfied, use our{" "}
                <a href="/contact" className="text-foreground underline">
                  Contact
                </a>{" "}
                page and select the relevant event topic. Nothing in this policy limits rights
                available under the Consumer Protection Act, 2019, the Information Technology Act,
                2000, or other applicable law.
              </p>
              <p>
                <strong>Merchant / organiser:</strong> [insert registered legal name, address,
                support email and grievance contact]. Complete these details before accepting paid
                orders.
              </p>
            </PolicySection>
          </div>
        </Container>
      </section>
    </>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-8 first:border-0 first:pt-0">
      <h2 className="mb-4 text-2xl text-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
