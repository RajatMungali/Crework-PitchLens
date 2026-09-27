"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  LineChart,
  Clock,
  UploadCloud,
  BadgeCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "AI-Powered Analysis",
    description:
      "Deep analysis of your deck\u2019s content, structure, and narrative — benchmarked against decks that raised.",
    big: true,
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Slide-by-Slide Feedback",
    description:
      "Concrete, specific notes on every slide — not generic advice.",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Comprehensive Scoring",
    description:
      "Scores across clarity, structure, spelling, and overall investor-readiness.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Instant Results",
    description: "Upload a PDF, get a full breakdown back in seconds.",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your deck",
    description: "Drop in your pitch deck as a PDF. No sign-up required.",
  },
  {
    number: "02",
    title: "AI reviews it",
    description:
      "We analyze every slide for clarity, structure, and investor readiness.",
  },
  {
    number: "03",
    title: "Get the breakdown",
    description:
      "A full score, slide-by-slide notes, and the one thing to fix first.",
  },
];

const TYPED_WORDS = ["investor-ready.", "fundable.", "backable.", "sharper."];

function useTypewriter(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const typingSpeed = isDeleting ? 45 : 90;
    const atEnd = !isDeleting && text === current;
    const atStart = isDeleting && text === "";

    const timeout = setTimeout(() => {
      if (atEnd) {
        setTimeout(() => setIsDeleting(true), 1200);
        return;
      }
      if (atStart) {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
        return;
      }
      setText((prev) =>
        isDeleting
          ? current.slice(0, prev.length - 1)
          : current.slice(0, prev.length + 1),
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words]);

  return text;
}

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const typed = useTypewriter(TYPED_WORDS);

  const handleAnalyzeDeck = () => {
    setIsUploading(true);
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="container mx-auto px-4 pt-16 pb-24">
          <div className="relative mx-auto max-w-6xl rounded-3xl border-2 border-black bg-beige px-6 py-16 md:px-16 md:py-20">
            {/* texture layers — own rounded+clipped layer so it doesn't cut off the floating pieces below */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-dot-grid" />
              <div className="absolute inset-0 bg-noise" />
            </div>

            <span className="corner-dot -left-1.5 -top-1.5" />
            <span className="corner-dot -right-1.5 -top-1.5" />
            <span className="corner-dot -left-1.5 -bottom-1.5" />
            <span className="corner-dot -right-1.5 -bottom-1.5" />

            <div className="relative grid items-center gap-16 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="mb-4 inline-block rounded-full border-2 border-black bg-white px-3 py-1 font-grotesk text-xs font-semibold uppercase tracking-wide">
                  Built for Overnight CTO founders
                </p>
                <h1 className="font-grotesk text-5xl font-bold leading-[1.05] tracking-tight text-black md:text-6xl">
                  Get your pitch deck
                  <br />
                  <span className="relative inline-block bg-black px-2 text-white">
                    {typed}
                    <span className="cursor-blink ml-0.5 inline-block w-[3px] translate-y-0.5 bg-white align-middle h-[0.85em]" />
                  </span>
                </h1>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-700">
                  Instant, brutally honest AI feedback on your deck —
                  benchmarked against decks that actually raised. Built by
                  Crework Labs for early-stage founders.
                </p>

                <motion.button
                  onClick={handleAnalyzeDeck}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="analyze"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-7 py-3.5 font-grotesk text-lg font-bold text-white shadow-comic comic-press"
                >
                  <UploadCloud className="h-5 w-5" />
                  Analyze the deck
                </motion.button>
              </motion.div>

              <div className="relative hidden md:block">
                {/* central deck mockup — stays put, everything else floats around it */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 rounded-2xl border-2 border-black bg-white p-4 shadow-comic-lg"
                >
                  <div className="mb-3 flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-black bg-white" />
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-black bg-white" />
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-black bg-white" />
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-3 w-2/3 rounded bg-black" />
                    <div className="h-2 w-full rounded bg-neutral-200" />
                    <div className="h-2 w-5/6 rounded bg-neutral-200" />
                    <div className="mt-4 h-2 w-1/2 rounded bg-neutral-200" />
                    <div className="h-2 w-3/4 rounded bg-neutral-200" />
                  </div>
                </motion.div>

                {/* floating score badge — top right, mirrors the top-right torn-paper piece in the reference */}
                <motion.div
                  initial={{ opacity: 0, rotate: 14, y: -10 }}
                  animate={{ opacity: 1, rotate: [10, 5, 10], y: [0, -5, 0] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.3 },
                    rotate: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute -right-8 -top-10 z-20 flex flex-col items-center gap-0.5 rounded-2xl border-2 border-black bg-white px-4 py-3 shadow-comic"
                >
                  <BadgeCheck className="h-5 w-5" />
                  <span className="font-grotesk text-xl font-bold leading-none">
                    86
                  </span>
                  <span className="text-[10px] font-medium uppercase text-neutral-500">
                    Score
                  </span>
                </motion.div>

                {/* floating slide fragment — bottom left, mirrors the bottom-left torn-paper piece in the reference */}
                <motion.div
                  initial={{ opacity: 0, rotate: -16, y: 10 }}
                  animate={{ opacity: 1, rotate: [-12, -7, -12], y: [0, 6, 0] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.45 },
                    rotate: {
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute -bottom-10 -left-10 z-20 w-32 rounded-xl border-2 border-black bg-white p-3 shadow-comic"
                >
                  <div className="space-y-1.5">
                    <div className="h-2 w-3/4 rounded bg-black" />
                    <div className="h-1.5 w-full rounded bg-neutral-200" />
                    <div className="h-1.5 w-2/3 rounded bg-neutral-200" />
                  </div>
                </motion.div>

                {/* small orbiting sparkle — top left, extra bit of life */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.6 },
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  }}
                  className="absolute -left-6 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-beige shadow-comic-sm"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES — bento grid */}
        <section className="container mx-auto px-4 pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-grotesk text-3xl font-bold text-black md:text-4xl">
              What you get
            </h2>
            <p className="mt-3 text-neutral-600">
              Everything a founder needs to know before a deck goes to
              investors.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, rotate: index % 2 === 0 ? -0.6 : 0.6 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className={`rounded-2xl border-2 border-black p-6 shadow-comic-sm transition-shadow hover:shadow-comic ${
                  feature.big
                    ? "bg-black text-white lg:col-span-2 lg:row-span-2 flex flex-col justify-between"
                    : "bg-white"
                }`}
              >
                <div>
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black ${
                      feature.big ? "bg-white text-black" : "bg-beige"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-grotesk text-lg font-bold">
                    {feature.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      feature.big ? "text-neutral-300" : "text-neutral-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
                {feature.big && (
                  <span className="mt-6 font-grotesk text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    The core engine →
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="border-y-2 border-black bg-beige py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-grotesk text-3xl font-bold text-black md:text-4xl">
                How it works
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border-2 border-black bg-white p-6 shadow-comic-sm hover:shadow-comic transition-shadow"
                >
                  <span className="font-grotesk text-3xl font-bold text-neutral-300">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-grotesk text-lg font-bold text-black">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="container mx-auto px-4 py-24 text-center">
          <h2 className="font-grotesk text-3xl font-bold text-black md:text-4xl">
            Ready to see where your deck stands?
          </h2>
          <motion.button
            onClick={handleAnalyzeDeck}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-7 py-3.5 font-grotesk text-lg font-bold text-white shadow-comic comic-press"
          >
            <UploadCloud className="h-5 w-5" />
            Analyze the deck
          </motion.button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
