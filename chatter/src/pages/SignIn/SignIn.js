import React from "react";
import "./styles/_sign-in-page.scss";
import { Input } from "../../common/components/Input/Input";
import { useForm } from "react-hook-form";

/**
 *  Very simple register implementation to create new users
 */
export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);

  const onSubmit = (data) => console.log(data);

  return (
    <div className="sign-in-page">
      <div className="sign-in-page__container">
        <form className="sign-in-page__container__form" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("number", { required: "This is a required field" })} label={"User number:"} errorMessage={errors?.number?.message} />
          <button className="sign-in-page__container__form__button" type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};
