"use client";
import { useState } from "react"
import { ArrowUpRight, Play, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  const features = [
    {
      title: "Real-time Trading",
      description: "Access live market data and execute trades instantly",
      icon: "/placeholder.svg",
    },
    {
      title: "Secure Platform",
      description: "Advanced encryption and security measures to protect your assets",
      icon: "/placeholder.svg",
    },
    {
      title: "Expert Support",
      description: "24/7 customer support from our experienced team",
      icon: "/placeholder.svg",
    },
    // Add more features as needed
  ]

  const services = [
    {
      title: "Forex Trading",
      description: "Trade currency pairs with competitive spreads",
      icon: "/forex.svg",
    },
    {
      title: "Cryptocurrency Trading",
      description: "Trade major cryptocurrencies with advanced tools",
      icon: "/crypto.svg",
    },
    {
      title: "Stock Trading",
      description: "Access global stock markets with real-time data",
      icon: "/stock.svg",
    },
    {
      title: "Forex Trading Signals",
      description: "Access most accurate signals in rwanda with the most trusted forex community",
      icon: "/signal.svg",
    },
    {
      title: "Forex Trading Signals",
      description: "Access most accurate signals in rwanda with the most trusted forex community",
      icon: "/signal.svg",
    },
    {
      title: "Forex Trading Signals",
      description: "Access most accurate signals in rwanda with the most trusted forex community",
      icon: "/signal.svg",
    },
   
    // Add more services
  ]

  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)

  const pricingPlans = [
    {
      name: "Basic",
      price: "29",
      features: ["Basic trading features", "Market analysis tools", "Email support", "Basic reporting"],
    },
    {
      name: "Pro",
      price: "99",
      features: ["Advanced trading features", "Premium analysis tools", "24/7 priority support", "Advanced reporting"],
    },
    {
      name: "Enterprise",
      price: "199",
      features: ["Custom solutions", "Dedicated account manager", "API access", "Custom reporting"],
    },
  ]

  const advisors = [
    {
      name: "John Smith",
      role: "Trading Expert",
      image: "/placeholder.svg",
    },
    // Add more advisors
  ]

  const articles = [
    {
      title: "Getting Started with Cryptocurrency Trading",
      excerpt: "Learn the basics of cryptocurrency trading and start your journey.",
      image: "/placeholder.svg",
      author: {
        name: "Jane Doe",
        avatar: "/placeholder.svg",
      },
    },
    // Add more articles
  ]

  return (
    <div className="bg-[#002419] text-white px-20">
      {/* Hero Section */}
      <section className="container mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Invest Your Money With <span className="text-[#00DC82]">Higher Return</span>
            </h1>
            <p className="text-gray-300 text-xl">
              Anyone can invest money to different currency to increase their earnings by the help of tradingo through
              online.
            </p>
            <div className="flex flex-wrap gap-6">
              <Button size="lg" className="bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90 text-lg">
                Get Started <ArrowUpRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                <Play className="mr-2" /> Watch Video
              </Button>
            </div>
          </div>
          <div className="relative h-[500px]">
            <Image src="/placeholder.svg" alt="Trading Platform" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section className="container mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Meet Our Company Unless Miss The Opportunity</h2>
            <p className="text-gray-300 text-xl">
              Experience the future of trading with our cutting-edge platform and expert guidance.
            </p>
            <Button size="lg" className="bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90 text-lg">
              Learn More <ArrowRight className="ml-2" />
            </Button>
          </div>
          <div className="relative h-[500px]">
            <Image src="/placeholder.svg" alt="Company Overview" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto p-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Features We Have</h2>
          <p className="text-gray-300 text-xl">Discover our powerful trading features</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#003626] p-8 rounded-lg">
              <Image
                src={feature.icon || "/crypto.svg"}
                alt={feature.title}
                width={64}
                height={64}
                className="mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300 text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto p-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Services We Offer</h2>
          <p className="text-gray-300 text-xl">Comprehensive trading solutions for every trader</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 ">
          {services.map((service, index) => (
       <div key={index} className="bg-[#003626] p-8 hover:border transition-opacity hover:cursor-pointer hover:border-[#28c193] md:h-[350px] flex flex-col items-center justify-center">
       <div className="rounded-full w-24 h-24 flex items-center justify-center bg-[#126a50]">
         <Image
           src={service.icon || "/placeholder.svg"}
           alt={service.title}
           width={64}
           height={64}
           className=""
         />
       </div>
       <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
       <p className="text-gray-300 text-lg">{service.description}</p>
     </div>
     
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto p-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Pricing Plan</h2>
          <p className="text-gray-300 text-xl">Choose the perfect plan for your trading needs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#003626] p-10 rounded-lg transition-all duration-300 ${
                hoveredPlan === index ? "transform scale-105 border-2 border-[#00DC82] shadow-xl" : ""
              }`}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-gray-300 text-xl">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-lg">
                    <CheckCircle2 className="text-[#00DC82] mr-3" size={24} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className={`w-full text-lg ${
                  hoveredPlan === index
                    ? "bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90"
                    : "bg-[#002419] text-white hover:bg-[#002419]/90"
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Advisors Section */}
      <section className="container mx-auto px-4 ">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Advisors</h2>
          <p className="text-gray-300 text-xl">Expert guidance from industry professionals</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {advisors.map((advisor, index) => (
            <div key={index} className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <Image
                  src={advisor.image || "/placeholder.svg"}
                  alt={advisor.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">{advisor.name}</h3>
              <p className="text-gray-300 text-lg">{advisor.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section className="container mx-auto px-4 ">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Articles For Pro Traders</h2>
          <p className="text-gray-300 text-xl">Stay updated with the latest trading insights</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, index) => (
            <div key={index} className="bg-[#003626] rounded-lg overflow-hidden">
              <div className="relative h-60">
                <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4">{article.title}</h3>
                <p className="text-gray-300 text-lg mb-6">{article.excerpt}</p>
                <div className="flex items-center">
                  <Image
                    src={article.author.avatar || "/placeholder.svg"}
                    alt={article.author.name}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <span className="text-gray-300 text-lg">{article.author.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="text-lg">
            View All Articles <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4">
        <div className="bg-[#003626] rounded-lg p-12 md:p-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Subscribe Our News</h2>
            <p className="text-gray-300 text-xl mb-10">Stay updated with our latest news and special offers</p>
            <div className="flex flex-col md:flex-row gap-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg bg-[#002419] text-white text-lg border border-gray-600 focus:outline-none focus:border-[#00DC82]"
              />
              <Button size="lg" className="bg-[#00DC82] text-[#002419] hover:bg-[#00DC82]/90 text-lg">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

