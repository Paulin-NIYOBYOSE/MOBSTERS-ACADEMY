"use client";
import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const price = searchParams.get("price");

  return (
    <div className="container mx-auto p-8 mt-10">
      <h2 className="text-4xl font-bold mb-6">Payment Methods</h2>
      <p className="text-xl mb-4">
        Selected Plan: <strong>{plan}</strong>
      </p>
      <p className="text-xl mb-4">
        Price: <strong>${price}</strong>
      </p>
      <div className="mt-6">{/* Payment methods UI here */}</div>
    </div>
  );
}
