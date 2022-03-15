import { useEffect, useState } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { axiosStrapi } from "../utils/services";
import ArrowRight from "@heroicons/react/solid/ArrowRightIcon";
import DownloadIcon from "@heroicons/react/outline/DownloadIcon";
import personImg from "../assets/heros/person1.svg";
import menuLogo from "../assets/heros/menu.svg";
import invoiceBanner from "../assets/heros/invoicedetailbanner.svg";
import receiptSVG from "../assets/features/bookmark.svg";
import greenTick from "../assets/features/greentick.svg";
import logo from "../assets/logos/PrepTime_analyser_logo.png";
import twitter from "../assets/footers/twitter.svg";
import facebook from "../assets/footers/facebook.svg";
import youtube from "../assets/footers/youtube.svg";

import $ from "jquery";

const PrimaryButton = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        className="w-full px-8 py-4 font-medium text-white rounded-lg font-dm-sans bg-brand-pink hover:opacity-90 text-desktop-paragraph md:w-auto"
        onClick={() => {
          navigate("/contact");
        }}
      >
        Get Started For Free
      </button>
    </div>
  );
};

const GenerateImageSection = ({ homeData }) => (
  <div>
    <img src={homeData?.feature[3]?.media[0]?.url} alt="" />
  </div>
);
const HighlightText = ({ homeData }) => {
  const [section3Steps, setSection3Steps] = useState([]);
  useEffect(() => {
    if (!homeData) return null;

    const $uls = $(homeData?.feature[2]?.description);
    $uls.each(function () {
      $(this)
        .find("li")
        .each(function (i, v) {
          const innerSpanOfLi = $(this).html();

          setSection3Steps((data) => [
            ...data,
            {
              title: `Step ${i + 1}`,
              innerHTML: innerSpanOfLi,
            },
          ]);
        });
    });
  }, [homeData]);

  return (
    <div className="md:w-1/2 md:px-[102px] h-full">
      <div className="flex items-center h-full">
        <div>
          <h2 className="font-medium w-[279px] md:w-auto m-auto text-center text-mobile-h2 md:text-desktop-h2 text-slate-headline md:text-left">
            {homeData?.feature[2]?.name}
          </h2>

          {section3Steps?.map((step, i) => {
            return (
              <div key={i} className="mt-3">
                <div className="flex justify-between items-center px-2 py-2 bg-white rounded-2xl">
                  <div className="flex items-center">
                    <div
                      className={`bg-yellow-300 rounded-2xl w-[54px] h-[54px] p-[18px]`}
                    >
                      <img src={receiptSVG} className="w-5" />
                    </div>

                    <p
                      dangerouslySetInnerHTML={{ __html: step.innerHTML }}
                      className="pl-4 font-medium text-desktop-paragraph text-slate-headline"
                    />
                  </div>

                  <div className="pl-7">
                    <img className="w-5" src={greenTick} alt="Green Tick" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ImageSection = ({ homeData }) => (
  <img
    className="max-h-[659px]"
    src={homeData?.feature[0]?.media[0]?.url}
    alt={homeData?.feature[0]?.media[0]?.url}
  />
  // <img className="max-h-[659px]" src={invoiceBanner} alt="" />
);

const Hero4 = () => {
  const [homeData, setHomeData] = useState(null);
  const [section2Steps, setSection2Steps] = useState([]);

  useEffect(() => {
    axiosStrapi.get("/home-page").then((res) => {
      setHomeData(res.data);
    });
  }, []);

  useEffect(() => {
    if (!homeData) return null;

    const descBox = document?.getElementById("section-1-desc");
    const descBoxChildren = descBox?.getElementsByTagName("p") || [];

    descBoxChildren[0]?.classList?.add(
      "!text-slate-body",
      "text-desktop-subheading",
      "mt-6",
      "md:mt-[30px]"
    );

    descBoxChildren[1]?.classList?.add(
      "!text-slate-body",
      "mt-6",
      "md:mt-[30px]"
    );

    // section 2

    const $uls = $(homeData?.feature[1]?.description);
    $uls.each(function () {
      $(this)
        .find("li")
        .each(function (i, v) {
          const innerSpanOfLi = $(this).html();

          setSection2Steps((data) => [
            ...data,
            {
              title: `Step ${i + 1}`,
              innerHTML: innerSpanOfLi,
            },
          ]);
        });
    });
  }, [homeData]);

  if (!homeData) return null;

  return (
    <section className="bg-gradient-to-r from-feeling-moody-start to-feeling-moody-end pt-12 md:pt-[150px]">
      <section className="px-6 md:px-0">
        <div className="m-auto max-w-default">
          <div className="flex flex-col items-center md:flex-row">
            <div className="w-full md:mr-[17px] order-2 md:order-1">
              <div className="mt-[48px] md:mt-0">
                <h1 className="font-medium leading-none text-mobile-h1 md:text-desktop-h1 text-slate-headline">
                  {homeData?.feature[0]?.name}
                </h1>

                <div
                  id="section-1-desc"
                  dangerouslySetInnerHTML={{
                    __html: homeData?.feature[0]?.description,
                  }}
                />

                <div className="mt-12 md:mr-5 pb-12 md:pb-[90px]">
                  <div className="flex flex-col items-start justify-center px-4 py-6 bg-white md:pt-5 md:pr-10 md:flex-row md:pl-7 bg-opacity-40 md:pb-9 rounded-2xl">
                    <img
                      className="w-16 h-16 m-auto rounded-full"
                      src={
                        "https://cdn.hashnode.com/res/hashnode/image/upload/v1606518806901/b7m2b7FPQ.jpeg?w=400&h=400&fit=crop&crop=faces&auto=compress"
                      }
                      alt="Person Profile Picture"
                    />
                    <div className="mt-4 text-center md:mt-0 md:ml-7 md:text-left">
                      <p className=" text-slate-body text-desktop-paragraph">
                        “An absolutely awesome tool. A simple tool to make
                        everyday school tasks easier”.
                      </p>
                      <p className="text-[13px] text-slate-body opacity-50 mt-3">
                        Castro Agbo, Developer, HandyTradie
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 w-full md:order-2">
              <div className="flex justify-center md:justify-end">
                <ImageSection homeData={homeData} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate-light font-dm-sans py-12 md:py-[90px] px-6 md:px-0">
        <div className="m-auto max-w-default">
          <h2 className="text-mobile-h2 md:text-desktop-h2 font-medium text-slate-headline max-w-[558px] leading-tight">
            {homeData?.feature[1]?.name}
          </h2>
        </div>
        <div className="mt-[60px]">
          <div className="m-auto md:flex md:justify-between w-full max-w-default">
            {section2Steps.map((step, i) => {
              return (
                <div key={i} className="md:max-w-[250px]">
                  <div className="bg-white rounded-3xl py-9 px-[30px]">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-pink text-white font-bold">
                      {i + 1}
                    </div>
                    <h4 className="mt-4 text-xl font-medium">{step.title} </h4>
                    <p
                      dangerouslySetInnerHTML={{ __html: step.innerHTML }}
                      className="mt-4 text-desktop-paragraph"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-slate-light font-dm-sans py-12 md:py-[90px]">
        <div className="mx-6 md:m-auto max-w-default rounded-3xl md:overflow-y-hidden">
          <div className="items-center justify-center h-full md:flex">
            <HighlightText homeData={homeData} />
            <div className="relative mt-8 md:w-1/2 md:mt-0">
              <img
                src={homeData?.feature[2]?.media[0]?.url}
                alt={homeData?.feature[2]?.media[0]?.url}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Section 4 */}
      <section>
        <div className="bg-slate-light font-dm-sans py-12 md:py-[90px] px-6 md:px-0">
          <div className="m-auto max-w-default">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full">
                <GenerateImageSection homeData={homeData} />
              </div>
              <div className="flex items-center w-full mt-[78px] md:mt-0">
                <div className="max-w-[362px] m-auto">
                  <span className="px-6 py-2 rounded-full bg-slate-orange text-[15px] font-bold text-white uppercase">
                    POWERFUL!
                  </span>
                  <h3 className="mt-6 font-medium leading-snug text-mobile-h3 md:text-mobile-h2 ">
                    {homeData?.feature[3]?.name}
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: homeData?.feature[3]?.description,
                    }}
                    className="text-slate-body text-desktop-subheading mt-6 md:mt-[30px] "
                  />

                  <div className="mt-8 md:mt-12">
                    <PrimaryButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer  */}
      <footer className="bg-slate-light font-dm-sans">
        <div className="py-6 mx-6 max-w-default md:m-auto">
          <div className="items-center md:space-x-12 md:flex">
            <img className="h-12" src={logo} alt="logo" />
            <p className="mt-3 text-sm font-normal md:mt-0 md:w-1/3 text-slate-body">
              Preptime Analytics. Powered by Scribble Works
            </p>
          </div>
          <hr className="my-6" />

          <div className="flex md:hidden space-x-4 mb-4">
            <Link to="/about">
              <p className="text-base font-normal">About</p>
            </Link>
            <Link to="/contact">
              <p className="text-base font-normal">Contact</p>
            </Link>
            <a
              href="https://pt-analyser.scribbleworks.com.gh/privacy-policy"
              target={"_blank"}
              rel="noreferrer"
            >
              <p className="text-base font-normal">Privacy</p>
            </a>
            <a
              href="https://pt-analyser.scribbleworks.com.gh/terms-of-service"
              target={"_blank"}
              rel="noreferrer"
            >
              <p className="text-base font-normal">Terms</p>
            </a>
            <a href="#" target={"_blank"}>
              <p className="text-base font-normal">Feeback</p>
            </a>
          </div>
          <div className="flex justify-between">
            <p> Copyright 2021 </p>

            <div className="hidden md:flex space-x-4">
              <Link to="/about">
                <p className="text-base font-normal">About</p>
              </Link>
              <Link to="/contact">
                <p className="text-base font-normal">Contact</p>
              </Link>
              <a
                href="https://pt-analyser.scribbleworks.com.gh/privacy-policy"
                target={"_blank"}
                rel="noreferrer"
              >
                <p className="text-base font-normal">Privacy</p>
              </a>
              <a
                href="https://pt-analyser.scribbleworks.com.gh/terms-of-service"
                target={"_blank"}
                rel="noreferrer"
              >
                <p className="text-base font-normal">Terms</p>
              </a>
              <a href="#" target={"_blank"}>
                <p className="text-base font-normal">Feeback</p>
              </a>
            </div>

            <div className="flex space-x-10">
              <img src={twitter} alt="twitter" />
              <img src={facebook} alt="facebook" />

              <a
                href="https://www.youtube.com/embed/FOgfK-W1l14"
                target={"_blank"}
                rel="noreferrer"
              >
                <img className="h-full" src={youtube} alt="youtube" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Hero4;
