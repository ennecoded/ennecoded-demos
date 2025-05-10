import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Enne-agrams" },
  { name: "description", content: "An anagram game (inspired by bananagrams)" },
];

export default function Index() {
  return (
    <>
      <section className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-2xl font-bold">Enne-agrams</h1>
        <button>
          <a
            href="/solitaire"
            className="bg-cocoa dark:bg-pinky text-ivory dark:text-cocoa font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300"
          >
            Solo Play
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
    </>
  );
}
