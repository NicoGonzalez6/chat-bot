import React, { forwardRef } from "react";
import cx from "classnames";
import "./_input.scss";

export const Input = forwardRef(({ label, onChange, name, errorMessage }, ref) => {
  return (
    <div className="input-wrapper">
      {label && <label className="input-wrapper__label">{label}</label>}
      <input className={cx("input-wrapper__input", { error: errorMessage })} onChange={onChange} ref={ref} name={name} />
      {errorMessage && <p className="input-wrapper__error">{errorMessage}</p>}
    </div>
  );
});
