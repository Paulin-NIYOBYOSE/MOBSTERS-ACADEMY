import { Button } from "";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto md:px-4 py-12 mt-10">
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-6">
          About Market Mobsters
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Market mobsters is more than just a trading group—it's a movement.
          Built by seasoned traders, we provide a trusted community where
          expertise meets opportunity. Whether you're a beginner or a pro, we
          equip you with the strategies, tools, and signals to dominate the
          forex markets.
        </p>
      </section>

      {/* Stats & Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        <div className="bg-[#003626] p-6 rounded-xl text-center shadow-lg">
          <h2 className="text-4xl font-bold text-[#28c193]">10K+</h2>
          <p className="text-gray-300 text-lg">Traders in Our Community</p>
        </div>
        <div className="bg-[#003626] p-6 rounded-xl text-center shadow-lg">
          <h2 className="text-4xl font-bold text-[#28c193]">60%+</h2>
          <p className="text-gray-300 text-lg">Signal Accuracy with 1:2RR</p>
        </div>
        <div className="bg-[#003626] p-6 rounded-xl text-center shadow-lg">
          <h2 className="text-4xl font-bold text-[#28c193]">24/7</h2>
          <p className="text-gray-300 text-lg">Support & Market Insights</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mt-16 grid md:grid-cols-2 gap-12">
        <div className="bg-[#003626] p-8 rounded-xl shadow-lg">
          <h3 className="text-3xl font-semibold text-white mb-4">
            Our Mission
          </h3>
          <p className="text-gray-300 text-lg">
            To empower traders worldwide by providing top-tier education,
            real-time market analysis, and the most accurate forex signals in
            the industry.
          </p>
        </div>
        <div className="bg-[#003626] p-8 rounded-xl shadow-lg">
          <h3 className="text-3xl font-semibold text-white mb-4">Our Vision</h3>
          <p className="text-gray-300 text-lg">
            To be the leading forex trading community, where traders thrive
            through shared knowledge, mentorship, and consistent profits.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold text-white mb-4">
          Join the Forex Mobsters Today
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Become part of an elite trading network and start making profitable
          trades with precision.
        </p>
        <Button
          size="lg"
          className="bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90 text-lg"
        >
          Join us now <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
