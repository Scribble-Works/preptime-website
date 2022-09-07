import ArrowRightIcon from "@heroicons/react/outline/ArrowRightIcon";


import { useState } from "react";

import orangeBar from "../assets/logos/orangebar.svg";
import { axiosStrapi } from "../utils/services";

const InputWithLabel = ({ name, type, ...props }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-base font-medium text-slate-body"> {name} </label>
    <input className="p-3 border-2 rounded-lg" type={type} {...props} />
  </div>
);

const TextAreaWithLabel = ({ name, ...props }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-base font-medium text-slate-body"> {name} </label>
    <textarea className="p-3 border-2 rounded-lg" {...props} rows={6} />
  </div>
);

const ContinueButton = ({ sendContact, sending }) => (
  <button
    disabled={sending}
    className={`flex items-center justify-center w-full px-6 py-4 space-x-2 rounded-lg ${
      sending ? "bg-gray-200" : "bg-slate-blue hover:brightness-125"
    } filter`}
    onClick={sendContact}
  >
    <span className="text-white"> {sending ? "Sending..." : "Send"} </span>
    <ArrowRightIcon className="w-5 text-white" />
  </button>
);

const Register5 = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  const sendContact = async () => {
    try {
      setMessage(null);
      if (!formData.name || !formData.phoneNumber || !formData.email) {
        return setMessage({
          status: false,
          message: "Please fill all fields",
        });
      }
      setSending(true);
      axiosStrapi
        .post(`/contacts`, formData)
        .then((res) => {
          setMessage({
            status: true,
            message: "Successful",
          });
          setFormData({
            name: "",
            phoneNumber: "",
            email: "",
            message: "",
          });
        })
        .catch((e) => {
          setMessage({
            status: false,
            message: e.message,
          });
        })
        .finally(() => {
          setSending(false);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen bg-white font-dm-sans ">
      <div>
        <div className="min-h-screen mx-6 md:mx-0 md:flex">
          <div className="hidden bg-cover md:block md:w-1/3 bg-register-page">
            <Sidebar />
          </div>
          <div className="my-12 md:my-0 md:w-2/3 pt-[80px] md:pt-[120px] min-h-[80vh] ">
            <div className="cntc-blk flex items-center justify-center h-full">
              <div className="md:w-[574px] w-full space-y-8">
                <h1 className="font-medium text-[32px]"> Get In Touch </h1>
                <InputWithLabel
                  name={"Name"}
                  type={"text"}
                  placeholder="Micheal Martey"
                  required
                  value={formData?.name}
                  onChange={(e) => {
                    e.persist();
                    setFormData((data) => ({
                      ...data,
                      name: e.target.value,
                    }));
                  }}
                />
                <InputWithLabel
                  name={"Phone Number"}
                  type={"number"}
                  placeholder="0244444444"
                  required
                  value={formData?.phoneNumber}
                  onChange={(e) => {
                    e.persist();
                    setFormData((data) => ({
                      ...data,
                      phoneNumber: e.target.value,
                    }));
                  }}
                />
                <InputWithLabel
                  name={"Email"}
                  type={"email"}
                  placeholder="mikeMartey@gmail.com"
                  required
                  value={formData?.email}
                  onChange={(e) => {
                    e.persist();
                    setFormData((data) => ({
                      ...data,
                      email: e.target.value,
                    }));
                  }}
                />
                <TextAreaWithLabel name={"Your Message"} />

                <p
                  className={`${
                    message?.status ? "text-green-500" : "text-red-500"
                  }  text-xs my-1`}
                >
                  {message?.message}
                </p>
                <ContinueButton sendContact={sendContact} sending={sending} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Sidebar = () => (
  <div className="flex flex-col justify-between h-full bg-black bg-opacity-50">
    <div></div>
    <div>
      <div className="flex justify-start space-x-12">
        <h1 className="text-base font-bold text-white uppercase">
          {" "}
          Used by teams worldwide{" "}
        </h1>
        <img src={orangeBar} alt="Orange Bar" />
      </div>
    </div>
  </div>
);
export default Register5;
