import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosStrapi } from "../utils/services";
import nap from "../assets/images/nap.jpg";
import Footer from "../components/Footer";

const Blog = () => {
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    axiosStrapi.get("/articles").then((res) => {
      setBlogData(res.data);
    });
  }, []);

  if (!blogData) return null;

  return (
    <div>
      <section className="sect-blog bg-slate-light pt-12 md:pt-[150px] min-h-[80vh]">
        <div className="max-w-default py-12 md:py-[30px] mx-6 lg:m-auto">
          <h1 className="font-bold text-5xl">All The Latest</h1>
          <hr className="my-3 border-black" />
          {blogData.map((article, i) => {
            return (
              <React.Fragment key={i}>
                <div className="flex justify-between space-y-7 my-6">
                  <Link to={`/blog/${article.id}`}>
                    <h1 className="font-medium leading-snug text-mobile-h2 md:text-desktop-h2 w-full md:w-10/12">
                      {article?.title}
                    </h1>
                  </Link>
                  <img
                    className="hidden md:block h-[200px]"
                    src={nap}
                    // height="76px" width="101px"

                    alt=""
                  />
                </div>
                {i !== blogData?.length - 1 && (
                  <hr className="my-3 h-[0.01px] border-black" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Footer  */}
      <Footer />
    </div>
  );
};

export default Blog;
