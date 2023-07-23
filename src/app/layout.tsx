"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
export const graphContext = React.createContext();
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UI Dashboard",
  description: "customizable dashboards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <graphContext.Provider value={graphData}>
        <body className={`$(inter.className)`}>{children}</body>
      </graphContext.Provider>
    </html>
  );
}

const graphData = {
  data: [
    ["Sector", "Intensity"],
    ["Sector 1", 60],
    ["Sector 2", 30],
    ["Sector 3", 70],
    ["Sector 4", 40],
  ],
  countryData: [
    ["Country", "Intensity"],
    ["USA", 10],
    ["Canada", 20],
    ["Russia", 10],
    ["Brazil", 6],
    ["Australia", 15],
    ["Algeria", 10],
    ["India", 20],
    ["South Africa", 15],
  ]
  
};
