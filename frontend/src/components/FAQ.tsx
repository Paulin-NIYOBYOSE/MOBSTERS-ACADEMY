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
        "Market Mobsters provides a comprehensive 6-month structured program with live weekly sessions, hands-on practice, and real market application. We focus on practical trading skills, risk management, and building a complete trading plan, rather than just passive video content.",
    },
    {
      question: "Do I need any prior trading experience to join?",
      answer:
        "No prior experience is required! The program is designed to take complete beginners step-by-step to advanced trading concepts. We start from the basics and gradually build your knowledge and confidence.",
    },
    {
      question: "When do cohorts start and how many students are accepted?",
      answer:
        "We open new cohorts twice a year – in December and June. Each cohort is limited to 50 students to ensure quality mentorship and personalized attention. If a cohort is full, you can join the waitlist for priority access to the next opening.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Stripe (credit/debit cards), PayPal, and Mobile Money for international students. Payment plans are also available to make the program accessible to everyone.",
    },
    {
      question: "Do I get lifetime access to the course materials?",
      answer:
        "Yes! All enrolled students receive lifetime access to course materials, recordings of live sessions, and updates to the curriculum.",
    },
    {
      question: "Can I access the course materials on mobile devices?",
      answer:
        "Absolutely! Our student dashboard is fully responsive and works on any device – phone, tablet, or computer. You can access lessons, assignments, and community features anywhere.",
    },
    {
      question: "What kind of support is provided during the program?",
      answer:
        "Students get access to weekly live Q&A sessions, private community forums, and priority support from instructors. The goal is to ensure you always have guidance and answers when needed.",
    },
    {
      question: "Do you provide real trading signals?",
      answer:
        "Yes! We provide educational trading signals that include detailed analysis and reasoning. These signals are designed to help you learn market analysis and develop your own trading skills.",
    },
    {
      question: "How much money do I need to start trading?",
      answer:
        "We recommend starting with a demo account, which we provide guidance on. When ready for live trading, you can start with as little as $100-$500. Risk management is emphasized regardless of account size.",
    },
    {
      question: "Can I interact with other traders in the program?",
      answer:
        "Yes! Students get access to an exclusive trading community where you can connect, share insights, and learn from peers and mentors.",
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
