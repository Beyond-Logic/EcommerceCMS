/** @format */

import React from "react";
import Link from "next/link";
import { urlFor } from "../lib/client";

const FooterBanner = ({
  footerBanner: {
    discount,
    largeText1,
    largeText2,
    saleTime,
    smallText,
    midText,
    desc,
    product,
    buttonText,
    image,
  },
}) => {
  return (
    <div className="footer-banner-container">
      <div className="footer-section">
        <div>Worldwide Shipping</div>
        <div>Best Quality</div>
        <div>Best Offers</div>
        <div>Secure Payments</div>
      </div>
    </div>
  );
};

export default FooterBanner;
