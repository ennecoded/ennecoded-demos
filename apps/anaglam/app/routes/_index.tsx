import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Anaglam" },
  { name: "description", content: "An anagram game (inspired by bananagrams)" },
];

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 transition-colors">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 w-12 h-12 rounded-full border border-current flex items-center justify-center transition duration-300 hover:rotate-180"
        aria-label="Toggle dark mode"
      >
        <span className="text-xl">{isDarkMode ? "🌞" : "🌙"}</span>
      </button>

      <section className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-2xl font-bold">Ana✨glam✨</h1>
        <button>
          <a
            href="/single-player"
            className="bg-cocoa dark:bg-pinky text-ivory dark:text-cocoa font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300"
          >
            Single Player
          </a>
        </button>
      </section>

      <footer className="mt-8 text-center">
        <p className="text-base opacity-80">
          Check out the blog at{" "}
          <a
            href="https://ennecoded.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-cocoa dark:hover:text-pinky font-medium transition"
          >
            ennecoded.com
          </a>
        </p>
      </footer>
    </main>
  );
}
