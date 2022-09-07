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
                            <span>Terms of </span>
                            <span className="pink">Use</span>
                        </h1>
                        <p className="updated">Effective date: 2020-08-10</p>
                    </div>
                </div>
            </section>
            <section className="pp-cnt">
                <div className="main-txt" dangerouslySetInnerHTML={{
                    __html: privacyData?.content[0]?.content,
                }}></div>
            </section>
            <Footer />
        </div>
    )
}
