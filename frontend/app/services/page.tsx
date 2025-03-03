import Image from "next/image";

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
    description:
      "Access the most accurate signals in Rwanda with the most trusted forex community",
    icon: "/signal.svg",
  },
  {
    title: "Forex Trading Signals",
    description:
      "Access the most accurate signals in Rwanda with the most trusted forex community",
    icon: "/signal.svg",
  },
  {
    title: "Forex Trading Signals",
    description:
      "Access the most accurate signals in Rwanda with the most trusted forex community",
    icon: "/signal.svg",
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto md:px-4 py-8 mt-10">
      {/* Services Section */}
      <section className="p-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Services We Offer
          </h2>
          <p className="text-gray-300 text-xl">
            Comprehensive trading solutions for every trader
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#003626] p-8 hover:border transition-opacity hover:cursor-pointer hover:border-[#28c193] md:h-[350px] flex flex-col items-center justify-center"
            >
              <div className="rounded-full w-24 h-24 flex items-center justify-center bg-[#126a50]">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={64}
                  height={64}
                  priority
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-300 text-lg text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
