import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import grades from '../assets/images/grades.svg';
import arrowdown from '../assets/features/arrowdown.png';

const GetStarted = () => {
  const [subscribe, setSubscribe] = useState(false);
  const [userType, setUserType] = useState('individual');

  const toTitle = word => word[0].toUpperCase() + word.slice(1);
  const navigate = useNavigate();

  const submitForm = e => {
    e.preventDefault()
    navigate('/picker')
  }

  const toggleDropdown = _ => {
    const dropdown = document.getElementById('userType');
    dropdown.classList.toggle('active')
  }

  useEffect(_ => {
    window.addEventListener('click', e => {
      const dropdown = document.getElementById('userType');
      if (dropdown) {
        const target = e.target;
        if (dropdown.contains(target))
          return;
        dropdown.classList.remove('active')
      }
    })
  }, [])

  return (
    <div>
      <section className="get-started bg-slate-light  pt-12 md:pt-[150px] min-h-[80vh]">
        <div className="max-w-default py-12 md:py-[30px] mx-6 lg:m-auto">
          <div className="started-content">
            <div className="fx-left">
              <h1 className="std-title">Let's Get Started</h1>
              <p className="subtext">PrepTime makes analyzing and reporting of assessments easy and simple. When you use our services, your're trusting us with your information. We understand this is a big responsibility and work to protect your information and pit you in control.</p>
              <form className="start" onSubmit={submitForm}>
                <div className="form-cnt">
                  <label htmlFor="userType">I am using PrepTime Analytics as an:</label>
                  <div className="dropdown" id="userType" onClick={toggleDropdown}>
                    <span>{ toTitle(userType) }</span>
                    <img src={arrowdown} alt="arrow down" />
                    <ul className="droplist">
                      <li onClick={_ => setUserType('individual')}>
                        <span>Individual</span>
                      </li>
                      <li onClick={_ => setUserType('organization')}>
                        <span>Organization</span>
                      </li>
                    </ul>
                  </div>
                  <p className="subscribe-txt">This service is currently being piloted. To get our latest updates please;</p>
                  <input type="checkbox" id="subscribe" onChange={e => setSubscribe(e.target.checked)} />
                  <label htmlFor="subscribe">Subscribe to our news letters.</label>
                  <p>Thank you.</p>
                  <div className="submit">
                    <button
                      className="px-8 py-2 font-medium text-white rounded-lg font-dm-sans bg-brand-pink hover:opacity-90 text-desktop-paragraph md:w-auto"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="fx-img-right">
              <img src={grades} alt="grade analysis illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer  */}
      <Footer />
    </div>
  );
};

export default GetStarted;
