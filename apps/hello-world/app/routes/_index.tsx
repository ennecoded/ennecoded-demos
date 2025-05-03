import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "ennecoded - hello world" },
  { name: "description", content: "Welcome to Ennecoded Demos!" },
];

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 transition-colors">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 w-12 h-12 rounded-full border border-current flex items-center justify-center transition duration-300 hover:rotate-180"
        aria-label="Toggle dark mode"
      >
        <span className="text-xl">{isDarkMode ? "🌞" : "🌙"}</span>
      </button>

      <section className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Welcome to Your First <span className="italic">Ennecoded</span> Demo
          Project
        </h1>
      </section>
    </main>
  );
}
