import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

export const FAQ = () => {
const faqs = [
  {
    question: "What makes Mobsters Forex Academy different from other trading courses?",
    answer: "Most courses only give you pre-recorded videos. At Mobsters Forex Academy, we combine a structured 6-month program with weekly live mentorship, hands-on practice, and a strong focus on technical analysis, risk management, and trading psychology. You’ll also learn a proven trading plan that has been tested over years. For ongoing growth, we offer a monthly mentorship subscription where traders can refine their strategies and get real market guidance."
  },
   {
    question: "What’s the difference between the 6-month Academy and Monthly subscription Mentorship",
    answer: "The 6-Month Academy is a complete structured journey from beginner to advanced. The Mentorship is an ongoing monthly subscription for non-beginner struggling traders trying to become profitable,where we teach them proven systems and help them improve their risk management approaches and trading pyschology"
  },
  {
    question: "Do I need any prior trading experience to join?",
    answer: "Not at all. Our academy is built for complete beginners who want to start from scratch and eventually trade confidently. We begin with the absolute basics of Forex and gradually progress to advanced strategies, prop firm challenges, and wealth-building techniques."
  },
  {
    question: "When do cohorts start and how many students are accepted?",
    answer: "We launch new cohorts twice a year — in **December** and **June**. To maintain quality and personal attention, each cohort is capped at 50 students. Once the spots are filled, you can join our waitlist and get priority access to the next intake."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Stripe (all major credit/debit cards), PayPal, Crypto (USDT/BTC/ETH), and Mobile Money for international students. For the academy, we also provide flexible payment plans so you can spread the cost over time."
  },
  {
    question: "What happens after I complete the academy program?",
    answer: "Graduates receive a professional trading certification and lifetime access to all learning materials. Many students continue with our monthly mentorship for ongoing support, live strategy refinement, and advanced tools. Others go on to pass prop firm challenges and scale their trading careers."
  },
  {
    question: "How much money do I need to start trading?",
    answer: "We recommend starting with a demo account to practice safely. When you’re ready for live markets, you can begin with as little as $100–$500. The focus isn’t the size of your account but **risk management** and consistency — skills we emphasize heavily."
  },
  {
    question: "Can I access the course on mobile devices?",
    answer: "Yes. Our student portal is mobile-friendly and works smoothly on phones, tablets, and computers. You’ll have full access to lessons, assignments, market analysis, and community features anytime, anywhere."
  },
  {
    question: "What kind of support do students receive?",
    answer: "We provide weekly live Q&A sessions, mentorship calls, a private community of traders, and direct instructor messaging for personalized guidance. Our team is fully committed to making sure you never feel stuck on your journey."
  },
  {
    question: "Do you provide real trading signals?",
    answer: "Yes. Students receive access to structured signals with explanations — not just 'buy/sell' alerts. We break down the reasoning, so you understand the setup and can eventually analyze the markets independently."
  },
  {
    question: "Will I learn how to pass prop firm challenges?",
    answer: "Absolutely. Our mentorship program includes prop firm passing strategies, risk management rules, and psychological preparation so you can trade other people’s capital confidently and profitably."
  }
 
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
            Everything you need to know about joining Mobsters Forex Academy
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
                <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                  <AccordionTrigger className="text-left px-6 py-4 hover:bg-accent/50 transition-colors">
                    <span className="font-medium text-foreground">{faq.question}</span>
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
              href="https://wa.me/1234567890" 
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