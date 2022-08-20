/** @format */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BsBagCheckFill } from "react-icons/bs";
import { useStateContext } from "../context/StateContext";
import { runFireWorks } from "../lib/utils";
import { useRouter } from "next/router";

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities, setShowCart } =
    useStateContext();

  useEffect(() => {
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    // runFireWorks();
  }, []);

  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Order Placed!</h2>
        <p className="email-msg">Check your email inbox for the receipt.</p>
        <p className="description">
          If you have any question, please email{" "}
          <a className="email" href="mailto:edemaero@gmail.com">
            edemaero@gmail.com
          </a>
        </p>
        <Link href="/">
          <button
            type="button"
            width="300px"
            className="btn"
            onClick={() => setShowCart(false)}
          >
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
