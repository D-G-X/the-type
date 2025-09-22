"use client";
import { useState } from "react";
import Menu from "./components/Menu";
import Type from "./pages/Type";

export default function Home() {
  const tabs: Record<number, string> = { 1: "Type", 2: "Multiplayer" };
  const [currentTab, setCurrentTab] = useState<number>(1);
  return (
    <div className="min-h-screen flex flex-col relative">
      <Menu currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="flex flex-grow items-center justify-center px-1 sm:px-10 mt-6">
        {currentTab == 1 ? <Type /> : ""}
      </div>
    </div>
  );
}
