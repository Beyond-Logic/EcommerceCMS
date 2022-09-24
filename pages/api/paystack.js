/** @format */

import React from "react";
import { PaystackButton } from "react-paystack";
import { useStateContext } from "../../context/StateContext";

const PayStack = () => {
  const { validateEmail, componentProps } = useStateContext();
  const firstName = sessionStorage.getItem("firstName");
  const email = sessionStorage.getItem("email");

  return (
    <>
      <PaystackButton
        {...componentProps}
        className={`btn ${
          firstName || validateEmail(email) ? "btn-disabled" : ""
        }`}
      />
    </>
  );
};

export default PayStack;
