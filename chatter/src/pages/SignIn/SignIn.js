import React from "react";
import "./styles/_sign-in-page.scss";
import { Input } from "../../components/Input/Input";
import { useForm } from "react-hook-form";
import { AXIOS_INSTANCE } from "../../config";
import { ENDPOINTS } from "../../constants";
import { useAuthContext } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { RedirectLink } from "../../components/RedirectLink/RedirectLink";

/**
 *  Very simple register implementation to create new users
 */
export const SignIn = () => {
  const { authenticateUser } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await AXIOS_INSTANCE.post(ENDPOINTS.SIGN_IN, data);
    authenticateUser(response);
    navigate("/");
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in-page__container">
        <form className="sign-in-page__container__form" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("number", { required: "This is a required field", valueAsNumber: true })} label={"User number:"} errorMessage={errors?.number?.message} />
          <button className="sign-in-page__container__form__button" type="submit">
            Confirm
          </button>
          <RedirectLink to={"/sign-up"}>I dont have an account</RedirectLink>
        </form>
      </div>
    </div>
  );
};
