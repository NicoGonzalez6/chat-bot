import React from "react";
import "./styles/_sign-up-page.scss";

import { useForm } from "react-hook-form";
import { Input } from "../../common/components/Input/Input";
import { toast } from "react-toastify";
import { ENDPOINTS, TOAST_MESSAGES } from "../../common/constants";
import { AXIOS_INSTANCE } from "../../config";
import { RedirectLink } from "../../common/components/RedirectLink/RedirectLink";
import { useNavigate } from "react-router-dom";

/**
 *  Very simple register implementation to create new users
 */
export const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await AXIOS_INSTANCE.post(ENDPOINTS.SIGN_UP, data);
    reset();
    toast.success(TOAST_MESSAGES.REGISTER.WELCOME);
    navigate("/sign-in");
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-page__container">
        <form className="sign-up-page__container__form" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("name", { required: "This is a required field" })} label={"User name:"} errorMessage={errors?.name?.message} />
          <Input {...register("number", { required: "This is a required field", valueAsNumber: true })} label={"User number:"} errorMessage={errors?.number?.message} />
          <button className="sign-up-page__container__form__button" type="submit">
            Confirm
          </button>
          <RedirectLink to={"/login"}>I already have an account</RedirectLink>
        </form>
      </div>
    </div>
  );
};
