import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Former Beginner, Now Profitable Trader',
      image: '👩‍💼',
      content: 'I started with zero knowledge about forex. After completing the 6-month academy, I\'m consistently profitable. The structured approach and live sessions made all the difference.',
      rating: 5,
      profit: '+$12,400 in 6 months'
    },
    {
      name: 'Marcus Johnson',
      role: 'Academy Graduate',
      image: '👨‍💻',
      content: 'The risk management tools alone are worth the entire course fee. I went from losing my account to having a solid trading plan. Best investment I\'ve made.',
      rating: 5,
      profit: '+89% portfolio growth'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Monthly Mentorship Member',
      image: '👩‍🎓',
      content: 'The weekly mentorship calls keep me accountable and learning. The signals are educational and help me understand market movements better.',
      rating: 5,
      profit: 'Consistent 15% monthly returns'
    },
    {
      name: 'David Kim',
      role: 'Community Member',
      image: '👨‍🚀',
      content: 'Started with the free community and immediately saw value. The daily signals helped me understand market analysis. Upgrading to the full academy next!',
      rating: 5,
      profit: 'First profitable month ever'
    },
    {
      name: 'Lisa Thompson',
      role: 'Academy Graduate & Mentor',
      image: '👩‍🏫',
      content: 'Not only did I master trading, but now I help others in the community. The certification opened doors I never expected in the finance industry.',
      rating: 5,
      profit: 'Career change success'
    },
    {
      name: 'Ahmed Al-Rashid',
      role: 'Professional Trader',
      image: '👨‍💼',
      content: 'I had some experience but was inconsistent. The academy\'s systematic approach and journal templates helped me identify and fix my weaknesses.',
      rating: 5,
      profit: '+$45K in 8 months'
    }
  ];

  return (
    <section id="testimonials" className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Success Stories from Our Students
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real results from real people who transformed their trading with Mobsters Forex Academy.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                
                <p className="text-foreground mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="bg-success-light rounded-lg p-3">
                  <p className="text-success font-semibold text-sm">
                    📈 {testimonial.profit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-medium">Average Rating: 4.9/5 from 2,500+ students</span>
          </div>
        </div>
      </div>
    </section>
  );
};