"use client";

import type React from "react";

import { createContext, useContext, useState } from "react";

export type AddressInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type PaymentInfo = {
  paymentMethod: "credit_card" | "paypal" | "apple_pay" | "google_pay";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
};

type CheckoutContextType = {
  addressInfo: AddressInfo;
  paymentInfo: PaymentInfo;
  updateAddressInfo: (info: Partial<AddressInfo>) => void;
  updatePaymentInfo: (info: Partial<PaymentInfo>) => void;
};

const defaultAddressInfo: AddressInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
};

const defaultPaymentInfo: PaymentInfo = {
  paymentMethod: "credit_card",
  cardNumber: "",
  cardHolder: "",
  expiryDate: "",
  cvv: "",
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [addressInfo, setAddressInfo] =
    useState<AddressInfo>(defaultAddressInfo);
  const [paymentInfo, setPaymentInfo] =
    useState<PaymentInfo>(defaultPaymentInfo);

  const updateAddressInfo = (info: Partial<AddressInfo>) => {
    setAddressInfo((prev) => ({ ...prev, ...info }));
  };

  const updatePaymentInfo = (info: Partial<PaymentInfo>) => {
    setPaymentInfo((prev) => ({ ...prev, ...info }));
  };

  return (
    <CheckoutContext.Provider
      value={{
        addressInfo,
        paymentInfo,
        updateAddressInfo,
        updatePaymentInfo,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
