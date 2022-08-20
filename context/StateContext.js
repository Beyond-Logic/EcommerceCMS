/** @format */

import React, { createContext, useContext, useState, useEffect } from "react";

import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const Context = createContext();

export const StateContext = ({ children }) => {
  let router = useRouter();

  const getLocalStorage = (name) => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem(name);

      if (storage) return JSON.parse(localStorage.getItem(name));

      if (name === "cartItems") return [];

      return 0;
    }
  };
  const [name, setName] = useState(getLocalStorage("name"));
  const [email, setEmail] = useState(getLocalStorage("email"));
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(getLocalStorage("cartItems"));
  const [totalPrice, setTotalPrice] = useState(getLocalStorage("totalPrice"));
  const [totalQuantities, setTotalQuantities] = useState(
    getLocalStorage("totalQuantities")
  );

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const setDetails = () => {
    setName(name);
    setEmail(email);
  };
  const [qty, setQty] = useState(1);

  let findProduct;
  let index;

  useEffect(() => {
    localStorage.setItem("name", JSON.stringify(name));
    localStorage.setItem("email", JSON.stringify(email));
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
    localStorage.setItem("totalQuantities", JSON.stringify(totalQuantities));
  }, [name, email, cartItems, totalPrice, totalQuantities]);

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (cartProduct) => cartProduct._id === product._id
    );

    // setTotalPrice(
    //   (prevTotalPrice) => prevTotalPrice + product.price * quantity
    // );
    // setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      setTotalPrice(totalPrice + product.price * quantity);
      setTotalQuantities(totalQuantities + quantity);
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };

        return cartProduct;
      });

      setCartItems(updatedCartItems);
      toast.success(`${qty} ${product.name} added to the cart`);
    } else {
      setTotalPrice(totalPrice + product.price * quantity);
      setTotalQuantities(totalQuantities + quantity);
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);

      toast.success(`${qty} ${product.name} added to the cart.`);
    }
  };

  const onRemove = (product) => {
    findProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);
    setTotalPrice(totalPrice - findProduct.price * findProduct.quantity);
    setTotalQuantities(totalQuantities - findProduct.quantity);
    // setTotalPrice(
    //   (prevTotalPrice) =>
    //     prevTotalPrice - findProduct.price * findProduct.quantity
    // );
    // setTotalQuantities(
    //   (prevTotalQuantities) => prevTotalQuantities - findProduct.quantity
    // );
    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, value) => {
    findProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);

    const newCartItems = cartItems.filter((item) => item._id !== id);
    if (value === "inc") {
      findProduct.quantity += 1;
      cartItems[index] = findProduct;
      setTotalPrice(totalPrice + findProduct.price);
      setTotalQuantities(totalQuantities + 1);

      // setCartItems([
      //   ...newCartItems,
      //   { ...findProduct, quantity: findProduct.quantity + 1 },
      // ]);
      // setTotalPrice((prevTotalPrice) => prevTotalPrice + findProduct.price);
      // setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    }
    if (value === "dec") {
      if (findProduct.quantity > 1) {
        findProduct.quantity -= 1;
        cartItems[index] = findProduct;
        setTotalPrice(totalPrice - findProduct.price);
        setTotalQuantities(totalQuantities - 1);
        // setCartItems([
        //   ...newCartItems,
        //   { ...findProduct, quantity: findProduct.quantity - 1 },
        // ]);
        // setTotalPrice((prevTotalPrice) => prevTotalPrice - findProduct.price);
        // setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  // const incQty = () => {
  //   setQty((prevQty) => prevQty + 1);
  // };

  // const decQty = () => {
  //   setQty((prevQty) => {
  //     if (prevQty - 1 < 1) return 1;
  //     return prevQty - 1;
  //   });
  // };

  const incQty = () => {
    setQty((oldQty) => {
      const tempQty = oldQty + 1;
      return tempQty;
    });
  };

  const decQty = () => {
    setQty((oldQty) => {
      let tempQty = oldQty - 1;
      if (tempQty < 1) {
        tempQty = 1;
      }
      return tempQty;
    });
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    firstname: name,
    amount: totalPrice * 100,
    metadata: {
      custom_fields: [
        {
          display_name: "Orders(s)",
          variable_name: "Order(s)",
          value: cartItems,
        },
      ],
    },
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLISHABLE_KEY,
  };

  const handlePayStackSuccessAction = (reference) => {
    console.log("message", JSON.stringify(reference));
    setShowCart(false);
    if (reference) {
      router.push("/");
      localStorage.clear();
      setCartItems([]);
      setTotalPrice(0);
      setTotalQuantities(0);
      toast.success(`Transaction Successful`);
    }
  };

  const handlePayStackCloseAction = () => {
    setShowCart(false);
    toast.error(`Transaction Cancelled`);
  };

  const componentProps = {
    ...config,
    text: "Pay with PayStack",
    onSuccess: (reference) => handlePayStackSuccessAction(reference),
    onClose: handlePayStackCloseAction,
  };
  return (
    <Context.Provider
      value={{
        name,
        email,
        setName,
        setEmail,
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        validateEmail,
        handlePayStackSuccessAction,
        handlePayStackCloseAction,
        config,
        componentProps,
        setDetails,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
