import { FaRegHandshake } from "react-icons/fa6";
import { FaAnglesDown } from "react-icons/fa6";
import { MdOutlineCandlestickChart } from "react-icons/md";
import { CommunityCardGrid } from "../components/reusable/LearningWithDiv"
import { PricingPlansGrid } from "@/components/reusable/PricingPlansGrid"



const Hero = () => {
  return (
    <>
      {/* Hero section */}
      <section className="px-14 mt-20 md:flex">
        <div className="w-1/2 flex flex-col gap-5">
          <h3 className="text-[45px] ">
            Forex trader Makes{" "}
            <span className="text-blue-600 font-bold">
              {" "}
              $2 million dollar profit{" "}
            </span>
            in 3 months using simple trading roadmap
          </h3>

          <div className=" flex flex-col gap-5">
            <p className=" font-thin text-[15px] text-gray-600">
              Did you know there are ordinary, average people quietly Taking
              Small Amounts of Money and Turning Them into Windfalls of Cash?
              Well, What if You Knew What They Know? Imagine How Your Life Would
              Change For The Better!
            </p>
            <div className="grid grid-cols-2 gap-2 ">
              <button className="inline-flex items-center w-40 justify-center bg-blue-600 text-white font-bold h-16 hover:bg-blue-700 transition ease-in-out duration-300 rounded-tr-full rounded-tl-full rounded-bl-full">
                <a href="#">
                  Take a free tour
                  <span>➜</span>
                </a>
              </button>
              <button className="inline-flex items-center w-28 justify-center bg-blue-100 text-blue-600 font-bold h-16 transition ease-in-out duration-300 rounded-tr-full rounded-tl-full rounded-bl-full">
                <a href="#">
                  Enroll now
                  <span>➜</span>
                </a>
              </button>
              <button className="inline-flex items-center w-60 justify-center bg-white text-blue-600 border-2 border-blue-600 font-bold h-16 rounded-tl-full rounded-tr-full rounded-bl-full transition ease-in-out duration-300">
                <a href="#">
                  Speak with a representative
                  <span>➜</span>
                </a>
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2">
        <img src="/hero_image.png" className="w-full" alt="" />
        </div>
      </section>
      {/* Learn more section */}
      <section className="px-14">
        <h3 className="text-blue-600 font-semibold flex flex-col items-center justify-center">
          Learn more about Forex mobsters
          <FaAnglesDown />
        </h3>
        <div className="">
          <h3 className="flex text-4xl gap-2 text-slate-950 font-bold mt-5">
            <FaRegHandshake className="text-[60px] text-blue-600" />
            Meet your mentor...
          </h3>
          <div className="flex flex-row gap-5">
            <div className="w-3/5 flex flex-col gap-10 text-2xl text-gray-600">
              <p>
                <span className="text-blue-600 font-bold">
                  NIYOBYOSE Paulin{" "}
                </span>
                is a professional, profitable and notable forex trader with over
                8 years of experience, a thought leader, an investor and an
                international keynote speaker. He is also a kingmaker,
                passionate about helping humans through their “grass to grace”
                journeys.
              </p>
              <p>
                He is the founder of Mobsters Trading Academy, Rwanda's leading
                online forex and crypto trading academy, where he trains over
                one million beginners and advanced traders on how to trade
                profitably.
              </p>
            </div>
            <div className="w-2/5 border-2 border-blue-200 h-[30rem]"></div>
          </div>

          <div className="flex flex-row gap-5 mt-5">
            <div className="w-2/5 border-2 border-blue-200 h-[30rem]"></div>
            <div className="w-3/5 flex flex-col gap-10 ">
              <p className="text-2xl text-gray-600 poppins-regular">
                <span className="font-semibold text-lg text-blue-600">
                  ASIDES HIS PAID MENTORSHIP
                </span>
                ,Paulin helps youths all over the world take charge of their
                finances by making hundreds of forex videos, courses, and
                webinars available for FREE on both his website and YouTube
                Channel.
              </p>
              <p className="text-2xl text-gray-600">
                He is the founder and pioneer of the Forex Millionaire Expo,
                launched in 2023, out of the need to create a haven for forex
                traders to learn from and connect with the industry's biggest
                thought leader in Africa.
              </p>
              <div>
                <h3 className="text-blue-600 ml-2 font-semibold ">
                  Want to know more about FXMA Mentorship?
                </h3>
                <div className="flex gap-2 mt-6">
                  <button className="inline-flex items-center w-60 justify-center bg-blue-600 text-white font-bold h-16 hover:bg-blue-700 transition ease-in-out duration-300 rounded-tr-full rounded-tl-full rounded-bl-full">
                    <a href="#">
                      Speak with a representative
                      <span>➜</span>
                    </a>
                  </button>
                  <button className="inline-flex items-center w-52 justify-center border-2 border-blue-600 text-blue-600 font-bold h-16 transition ease-in-out duration-300 rounded-tr-full rounded-tl-full rounded-bl-full">
                    <a href="#">
                      Visit telegram channel <span>➜</span>
                    </a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-14 mt-10">
        <h3 className="text-blue-600 text-2xl font-semibold">
          A LITTLE MORE ABOUT MY JOURNEY THUS FAR...
        </h3>
        <div className="space-y-6 text-gray-600 font-extralight leading-relaxed mt-10 roboto-bold poppins-thin">
          <p>
            You see, just a few years ago, I was just like most teenagers,
            trying to figure out how to make some extra money online. Unlike my
            classmates, I wasn’t content with the traditional path of school,
            college, and a 9-to-5 job. At 17, I realized I needed something
            different, something bigger if I wanted to achieve the life I’ve
            always dreamed of. For as long as I can remember, my dream has been
            to own a Lamborghini, travel the world, and live life on my own
            terms without being tied down by location or time. But when I looked
            at the typical career paths around me, it didn’t take long to
            realize that none of them would get me there. I knew I had to find a
            new way, and that’s when my journey into the world of online income
            began.
          </p>
          <p>
            You’re probably reading this because you, too, have big dreams or
            financial goals. Maybe you want to help your family, buy your dream
            car, save for college, or even just prove to yourself that you can
            make it on your own terms. Whatever your goal, I understand where
            you’re coming from because I’ve been there. The truth is, not every
            path will take you to your destination. It’s not enough to dream
            big—you need the right strategy and the right vehicle to get you
            there. For me, that vehicle was learning how to make money online.
          </p>
          <p>
            Once I discovered the potential of online income, I decided to go
            all in. At first, I was skeptical, but I kept asking myself, "What
            if this works?" Imagine making an extra $100, $600, or even $1,000 a
            month—how much closer would that bring you to your goals? I remember
            when I made my first $100 online, the feeling was unreal. I couldn’t
            believe it was real. People around me started noticing, and my
            friends even questioned if what I was doing was legit. But it was
            real, and that’s when I knew I was onto something life-changing.
          </p>
          <p>
            Now, I’m on a mission to share this opportunity with others who are
            just starting out, just like I was. Whether you’re a total newbie or
            someone who has tried and struggled before, I’ve created a roadmap
            to help you get started and succeed. This roadmap is unlike anything
            you’ve ever seen before. I’ve spent years learning and
            experimenting, and now I want to help you trade smarter, not harder.
          </p>
        </div>
      </section>
      <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Join Our Trading Community</h1>
      <CommunityCardGrid />
    </div>

    {/* Pricing */}
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <PricingPlansGrid />
    </div>

      {/* Offerings*/}
      {/* <section className="px-14">
        <div>
          <MdOutlineCandlestickChart />
          <h3>
            Learning with <span>Forex Mobsters Academy</span> offers you
          </h3>
        </div>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </section> */}
    </>
  );
};

export default Hero;
