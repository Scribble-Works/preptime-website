import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import XIcon from "@heroicons/react/outline/XIcon";

import logo from "./assets/logos/PrepTime_analyser_logo.png";
import AppContextProvider from "./context";
import menuLogo from "./assets/heros/menu.svg";
import About from "./pages/About";
import Home from "./pages/Home";

import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import GetStarted from "./pages/GetStarted";
import Contact from "./pages/Contact";
import './assets/styles/app.css';
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Picker from './pages/Picker';
import Analysis from "./pages/Analysis";

const AppNavlink = ({ links, location }) =>
  links.map(link => {
    return location.pathname === '/picker' && link.url === '/started'  ? null : (
        <p key={link.url}>
          <NavLink
            to={link.url}
            className={({ isActive }) =>
              isActive
                ? "font-medium transition-all duration-300 active:text-slate-blue"
                : "font-medium transition-all duration-300 hover:text-slate-blue"
            }
          >
            {link.name}
          </NavLink>
        </p>
       )
  });

const linkArray = [
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Blog Post",
    url: "/blog",
  },
  {
    name: "Get Started",
    url: "/started",
  },
  {
    name: "Contact",
    url: "/contact",
  },
];

const Nav = ({ setShowMobileMenu, location }) => (
  <nav>
    <div className="pt-6 m-auto md:pt-[53px] max-w-default md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <NavLink to="/">
            <img
              className="h-[50px] w-[50px] md:w-auto md:h-10"
              src={logo}
              alt="Logo"
            />
          </NavLink>
          <div className="">
            <ul className="hidden ml-12 space-x-12 font-medium md:flex text-slate-headline">
              <AppNavlink links={linkArray} location={location} />
            </ul>
          </div>
        </div>
        <div className="block cursor-pointer md:hidden">
          <img
            onClick={() => setShowMobileMenu(true)}
            className="w-6 h-6 md:w-8 md:h-8"
            src={menuLogo}
            alt="Menu"
          />
        </div>
      </div>
    </div>
  </nav>
);

const MobileMenu = ({ setShowMobileMenu, location }) => (
  <section className="md:hidden">
    <div className="absolute top-0 w-full min-h-[295px] p-2">
      <div className="w-full p-3 bg-gray-100 rounded-2xl border border-gray-300">
        <div className="flex items-center justify-between">
          <NavLink to="/">
            <img className="h-[50px] w-[50px] md:h-15" src={logo} alt="Logo" />
          </NavLink>
          <div className="">
            <ul className="ml-12 space-x-12 font-medium md:flex text-slate-headline">
              <XIcon
                onClick={() => setShowMobileMenu(false)}
                className="w-6 h-6 text-slate-headline"
              />
            </ul>
          </div>
        </div>
        <div>
          <ul className="mt-6 space-y-4">
            <AppNavlink links={linkArray} location={location} />
          </ul>
        </div>
      </div>
    </div>
  </section>
);

function App() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  let location = useLocation();

  // useEffect(() => {
  //   console.log('from base of the app:\n', process.env)
  // }, [location])

  return (
    <div className="relative font-dm-sans w-full">
      <div className="absolute w-full bg-transparent">
        {
          location.pathname.indexOf('/report/') < 0 ? (
            <>
              <Nav setShowMobileMenu={setShowMobileMenu} location={location} />
              {showMobileMenu && <MobileMenu setShowMobileMenu={setShowMobileMenu} location={location} />}
            </>
          ) : null
        }
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="blog/:id" element={<BlogPost />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="started" element={<GetStarted />} />
        <Route path="picker" element={<Picker />} />
        <Route path="report/:id" element={<Analysis />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
      </Routes>
    </div>
  );
}

export default App;
