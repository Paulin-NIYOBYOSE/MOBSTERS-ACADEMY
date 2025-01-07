// Hero Component - Hero.js

import Navbar from "./Navbar";

const Hero = () => {
  return (
    <>
      <Navbar />
      {/* Hero section */}
      <section className="">
        <div className="w-1/2">
          <h3>
            Forex trader Makes $2 million dollars profit in 3 months using
            simple trading roadmap
          </h3>
          <div>
            <p>
              Did you know there are ordinary, average people quietly Taking
              Small Amounts of Money and Turning Them into Windfalls of Cash?
              Well, What if You Knew What They Know? Imagine How Your Life Would
              Change For The Better!
            </p>
            <div>
              <button></button>
              <button></button>
              <button></button>
            </div>
          </div>
        </div>
        <div className="w-1/2"></div>
      </section>
    </>
  );
};

export default Hero;
