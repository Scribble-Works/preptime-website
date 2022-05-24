import React, { useEffect, useState } from "react";
import { Routes, Route, Link, NavLink, useParams } from "react-router-dom";
import ArrowRight from "@heroicons/react/solid/ArrowRightIcon";
import { axiosStrapi } from "../utils/services";
import $ from "jquery";
import CheckMark from "@heroicons/react/solid/CheckIcon";
import { useNavigate } from "react-router-dom";
import twitter from "../assets/footers/twitter.svg";
import facebook from "../assets/footers/facebook.svg";
import youtube from "../assets/footers/youtube.svg";
import growth from "../assets/pricing-tables/growth.svg";
import laptop from "../assets/images/analser2.png";
import logo from "../assets/logos/PrepTime_analyser_logo.png";

const BlogPost = () => {
  let params = useParams();
  const { id } = params;
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    axiosStrapi.get(`/articles/${id}`).then((res) => {
      setBlogData(res.data);
    });
  }, [id]);

  if (!blogData) return null;

  return (
    <div>
      <section className="sect-blog bg-slate-light pt-12 md:pt-[150px] min-h-[80vh]">
        <div className="max-w-default py-12 md:py-[30px] mx-6 lg:m-auto">
          <div className="md:w-12/12 space-y-7">
            <h1 className="font-medium leading-snug text-mobile-h2 md:text-desktop-h2">
              {blogData?.title}
            </h1>

            <div
              dangerouslySetInnerHTML={{
                __html: blogData?.content,
              }}
              className="font-normal text-desktop-subheading text-slate-body"
            />
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
    </div>
  );
};

export default BlogPost;
