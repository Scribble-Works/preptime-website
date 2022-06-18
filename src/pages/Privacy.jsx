import React, { useState, useEffect } from 'react'
import Footer from '../components/Footer';
import { axiosStrapi } from "../utils/services";

export default function Privacy() {
    const [privacyData, setPrivacyData] = useState(null);

    useEffect(() => {
        axiosStrapi.get("/privacy-policy-page").then((res) => {
            setPrivacyData(res.data);
        });
    }, []);

    return (
        <div className='sect-pp pnp bg-gradient-to-r from-feeling-moody-start to-feeling-moody-end'>
            <section className='pnp-hero'>
                <div className="sect-cnt">
                    <div className="pp-title">
                        <h1>
                            <span>Privacy &amp; </span>
                            <span className="pink">Policy_</span>
                        </h1>
                        <p className="updated">Effective date: 2020-08-10</p>
                    </div>
                    <p>
                    This Privacy Policy is meant to help you understand what
                    information we collect, why we collect it and how you can update
                    it, manage, export and delete your information.
                    </p>
                </div>
            </section>
            <section className="pp-cnt">
                <div className="main-txt" dangerouslySetInnerHTML={{
                    __html: privacyData?.content[1]?.content,
                }}></div>
            </section>
            <Footer />
        </div>
    )
}
