// /components/ui/card.tsx
import React from "react";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 border rounded-lg ${className}`}>{children}</div>;
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-lg font-semibold ${className}`}>{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2">{children}</div>;
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4">{children}</div>;
}
