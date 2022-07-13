import React from 'react';
import { Link } from "react-router-dom";
import twitter from "../assets/footers/twitter.svg";
import facebook from "../assets/footers/facebook.svg";
import youtube from "../assets/footers/youtube.svg";
import logo from "../assets/logos/PrepTime_analyser_logo.png";

export default function Footer() {
  return (
    <footer className="bg-slate-light font-dm-sans">
        <div className="main-cnt py-6 mx-6 max-w-default md:m-auto">
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
                <Link to="/privacy">
                    <p className="text-base font-normal">Privacy</p>
                </Link>
                <Link to="/terms">
                    <p className="text-base font-normal">Terms</p>
                </Link>
            </div>
            <div className="flex justify-between">
            <p> Copyright 2022 </p>

            <div className="hidden md:flex space-x-4">
                <Link to="/about">
                    <p className="text-base font-normal">About</p>
                </Link>
                <Link to="/contact">
                    <p className="text-base font-normal">Contact</p>
                </Link>
                <Link to="/privacy">
                    <p className="text-base font-normal">Privacy</p>
                </Link>
                <Link to="/terms">
                    <p className="text-base font-normal">Terms</p>
                </Link>
            </div>

            <div className="flex space-x-10">
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
  )
}
