import React, { useEffect, useState } from "react";
import ArrowRight from "@heroicons/react/solid/ArrowRightIcon";
import { axiosStrapi } from "../utils/services";
import { useNavigate } from "react-router-dom";
import growth from "../assets/pricing-tables/growth.svg";
import laptop from "../assets/images/analser2.png";
import Footer from "../components/Footer";

const SmallerGrid = ({ plan }) => {
  let navigate = useNavigate();
  return (
    <div className="plan bg-white md:w-[24%] relative p-[32px] rounded-3xl min-h-full">
      <div>
        <div className="flex">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-pink">
            <img src={growth} alt="Growth" />
          </div>
          <div className="ml-4 text-left">
            <h4 className="text-lg font-medium leading-none"> {plan?.name} </h4>
            <p className="mt-1 text-desktop-paragraph text-slate-body">
              {`${plan?.priceInCents / 100} USD`}
            </p>
          </div>
        </div>
        <hr className="mt-6" />
        <div
          dangerouslySetInnerHTML={{ __html: plan?.features[0]?.description }}
        />

        <div className="pln-btn mt-6">
          <button
            className="flex items-center justify-center w-full py-4 transition-all duration-300 bg-white border-2 rounded-lg text-slate-blue border-slate-blue text-desktop-paragraph hover:bg-slate-blue hover:text-white"
            onClick={() => {
              navigate("/contact");
            }}
          >
            <span>Start</span>
            <ArrowRight className="w-4 ml-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  let navigate = useNavigate();
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    axiosStrapi.get("/about-page").then((res) => {
      setAboutData(res.data);
    });
  }, []);

  if (!aboutData) return null;

  return (
    <div>
      <section className="sect-about bg-gradient-to-r from-feeling-moody-start to-feeling-moody-end pt-12 md:pt-[150px]">
        <div className="max-w-default py-12 md:py-[30px] mx-6 lg:m-auto">
          <div className="md:w-7/12 space-y-7">
            <h1 className="font-medium leading-snug text-mobile-h2 md:text-desktop-h2">
              {aboutData?.content[0]?.header}
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: aboutData?.content[0]?.content,
              }}
              className="font-normal text-desktop-subheading text-slate-body"
            />
          </div>
        </div>

        <div className="max-w-default py-12 md:py-[30px] mx-6 lg:m-auto flex justify-end">
          <div className="md:w-7/12 space-y-7">
            <h1 className="font-medium leading-snug text-mobile-h2 md:text-desktop-h2">
              {aboutData?.content[1]?.header}
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: aboutData?.content[1]?.content,
              }}
              className="font-normal text-desktop-subheading text-slate-body"
            />
          </div>
        </div>

        <div className="max-w-default py-12 md:py-[30px] mx-6 lg:m-auto">
          <div className="md:w-7/12 space-y-7">
            <h1 className="font-medium leading-snug text-mobile-h2 md:text-desktop-h2">
              {aboutData?.content[2]?.header}
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: aboutData?.content[2]?.content,
              }}
              className="font-normal text-desktop-subheading text-slate-body"
            />
          </div>
        </div>

        <div className="max-w-default py-12 md:py-[30px] mx-6 lg:m-auto flex justify-end">
          <div className="md:w-7/12 space-y-7">
            <h1 className="font-medium leading-snug text-mobile-h2 md:text-desktop-h2">
              {aboutData?.content[3]?.header}
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: aboutData?.content[3]?.content,
              }}
              className="font-normal text-desktop-subheading text-slate-body"
            />
          </div>
        </div>

        <section className="bg-slate-light font-dm-sans">
          <div className="main-cnt md:m-auto max-w-default py-12 md:py-[90px] mx-6">
            <div className="text-center">
              <h5 className="text-base font-bold uppercase text-slate-orange">
                A plan for everyone
              </h5>
              <div className="mt-[18px]">
                <h2 className="font-medium text-slate-headline text-mobile-h2 lg:text-desktop-h2">
                  Pricing
                </h2>
              </div>

              <div className="mt-[60px]">
                <div className="plans flex flex-col items-center space-4 text-left md:space-y-4 md:flex-row">
                  <SmallerGrid plan={aboutData?.plans[0]} />
                  {/* <SmallerGrid plan={aboutData?.plans[1]} />
                  <SmallerGrid plan={aboutData?.plans[2]} />
                  <SmallerGrid plan={aboutData?.plans[3]} /> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-light font-dm-sans py-12 md:py-[30px]">
          <div className="bg-white mx-6 md:m-auto max-w-default rounded-3xl md:h-[580px] md:overflow-y-hidden">
            <div className="items-center justify-center h-full md:flex">
              <div className="pt-10 mx-6 md:pt-0 md:mx-0 md:w-1/2">
                <div className="md:my-[32px] md:mx-7">
                  <img src={laptop} alt="banner" />
                </div>
              </div>
              <div className="md:w-1/2 px-6 md:px-[102px] h-full">
                <div className="flex items-center h-full">
                  <div className="py-12 text-center md:py-0">
                    <h2 className="font-medium leading-none text-mobile-h2 md:text-desktop-h2 text-slate-headline">
                      PrepTime Analyser in Action
                    </h2>
                    <p className="pt-6 text-desktop-subheading">
                      Everything you need to know about PrepTime Analyser
                    </p>
                    <button
                      className="py-2 px-12 font-thin text-white rounded cursor-pointer text-desktop-paragraph bg-blue-500 mt-4"
                      onClick={() => {
                        navigate("/blog");
                      }}
                    >
                      Blog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Footer  */}
      <Footer />
    </div>
  );
};

export default About;
