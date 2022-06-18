import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosStrapi } from "../utils/services";
import Footer from "../components/Footer";

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
      <Footer />
    </div>
  );
};

export default BlogPost;
