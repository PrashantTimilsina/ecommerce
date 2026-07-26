"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our catalog, select the product, choose your size and color, then click Add to Cart. Once you're ready, go to your cart and follow the checkout steps to enter shipping and payment details.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Visa, Mastercard, PayPal, Apple Pay, and Google Pay. All payments are processed securely at checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with a tracking number and a link to follow your package's journey in real time.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "You can return or exchange unworn items within 30 days of delivery, with tags attached and in original packaging. Visit the Orders section in your account to start a return.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination and are calculated at checkout.",
  },
  {
    question: "How do I manage my account and deliveries?",
    answer:
      "Log in to your account and go to Manage Deliveries to update your shipping address, view order history, or change delivery preferences.",
  },
];

function FAQ() {
  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide mb-6 sm:mb-8">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <Accordion className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base sm:text-lg  cursor-pointer hover:no-underline font-normal">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ;
