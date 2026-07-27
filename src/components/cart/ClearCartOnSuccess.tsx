"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnSuccess() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // run once on mount only; `clear` identity changes whenever cart items change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
