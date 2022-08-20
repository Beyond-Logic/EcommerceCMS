/** @format */

import React from "react";
import { PaystackButton } from "react-paystack";
import { useStateContext } from "../../context/StateContext";


const PayStack = () => {
  const { name, email, validateEmail, componentProps } = useStateContext();

  return (
    <>
      <PaystackButton
        {...componentProps}
        className={`btn ${
          name.length < 1 || !validateEmail(email) ? "btn-disabled" : ""
        }`}
      />
    </>
  );
};

export default PayStack;
