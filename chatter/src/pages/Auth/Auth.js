import React, { useCallback, useState } from "react";
import "./styles/_auth-page.scss";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";

/**
 * Generate a random number between 0 and 9999
 * for new user on register
 */
const generateUserNumber = () => {
  return Math.floor(Math.random() * 10000);
};

const newUserNumber = generateUserNumber();

/**
 *  Very shallow auth implementation to create new users
 *
 * @TODO Create validation so it cant have repited user numbers
 */
export const Auth = () => {
  const { authenticateUser } = useCurrentUser();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({ name: "", number: newUserNumber });

  const onChangeHandler = useCallback(
    (evt) => {
      setFormValues({ ...formValues, [evt.target.name]: evt.target.value });
    },
    [formValues.name]
  );

  const submitHandler = useCallback(
    (evt) => {
      evt.preventDefault();
      authenticateUser(formValues);
      navigate("/");
    },
    [formValues.name]
  );

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <form className="auth-page__container__form" onSubmit={submitHandler}>
          <div className="auth-page__container__form__input">
            <label>What is your name?</label>
            <input onChange={onChangeHandler} value={formValues.name} name={"name"}></input>
          </div>
          <div className="auth-page__container__form__input">
            <label>User number</label>
            <input disabled value={newUserNumber}></input>
          </div>
          <button className="auth-page__container__form__button" type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};
