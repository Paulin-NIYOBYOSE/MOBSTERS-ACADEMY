import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export const FAQ = () => {
  const faqs = [
    {
      question:
        "What makes Market Mobsters different from other trading courses?",
      answer:
        "Our academy offers a comprehensive 6-month structured program with live weekly sessions, hands-on practice, and ongoing mentorship. Unlike other courses that just provide videos, we focus on practical application, risk management, and building a complete trading plan.",
    },
    {
      question: "Do I need any prior trading experience to join?",
      answer:
        "No prior experience is required! Our program is designed to take complete beginners and guide them step-by-step to advanced trading concepts. We start with the basics and gradually build up your knowledge and skills.",
    },
    {
      question: "When do cohorts start and how many students are accepted?",
      answer:
        "We open new cohorts twice a year - in December and June. Each cohort is limited to 50 students to ensure personalized attention and quality mentorship. If a cohort is full, you can join our waitlist for priority access to the next opening.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept multiple payment methods including Stripe (credit/debit cards), PayPal, and Mobile Money for international students. Payment plans are available for the academy program to make it accessible to everyone.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer:
        "Yes! We offer a 30-day money-back guarantee for the academy program. If you're not satisfied with the quality of education within the first 30 days, we'll provide a full refund, no questions asked.",
    },
    {
      question: "What happens after I complete the academy program?",
      answer:
        "Upon completion, you'll receive a professional trading certification and lifetime access to all course materials. Many graduates continue with our monthly mentorship program for ongoing support and advanced strategies.",
    },
    {
      question: "How much money do I need to start trading?",
      answer:
        "We recommend starting with a demo account first (which we provide training on). When you're ready for live trading, you can start with as little as $100-500. We emphasize proper risk management regardless of account size.",
    },
    {
      question: "Can I access the course materials on mobile devices?",
      answer:
        "Yes! Our student dashboard is fully responsive and works on all devices. You can access lessons, assignments, and community features from your phone, tablet, or computer.",
    },
    {
      question: "What kind of support do you provide during the program?",
      answer:
        "You'll have access to weekly live Q&A sessions, private community forums, direct messaging with instructors, and priority support. We're committed to your success and provide comprehensive support throughout your journey.",
    },
    {
      question: "Do you provide real trading signals?",
      answer:
        'Yes! All programs include access to our educational signals with detailed analysis. These aren\'t just "buy/sell" signals - we explain the reasoning behind each trade to help you learn market analysis and develop your own skills.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about joining Market Mobsters
          </p>
        </div>

        <Card className="shadow-medium border-border/50">
          <CardHeader className="bg-gradient-card">
            <CardTitle className="text-2xl text-center text-foreground">
              Got Questions? We Have Answers!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border/50"
                >
                  <AccordionTrigger className="text-left px-6 py-4 hover:bg-accent/50 transition-colors">
                    <span className="font-medium text-foreground">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@mobstersforex.com"
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              📧 support@mobstersforex.com
            </a>
            <a
              href="https://wa.me/0796358871"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              💬 WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
