"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  LineChart,
  Clock,
  UploadCloud,
  Lock,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const features = [
  // {
  //   icon: <Sparkles className="h-6 w-6" />,
  //   title: "Investor lens",
  //   description:
  //     "Reads your deck the way a seed investor would, benchmarked against [X] decks that raised.",
  // },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Slide by slide notes",
    description: "Specific notes on every slide, not generic advice.",
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Scores that matter",
    description:
      "Story, problem, market, traction, team, the ask and build readiness.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "One fix first",
    description: "The single change that will move your score the most.",
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
    title: "We read it like an investor would",
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

const subscores = [
  { label: "Story", value: 82 },
  { label: "Traction", value: 61 },
  { label: "Build readiness", value: 48 },
];

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

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
                  Free tool by Crework Labs for pre-seed and seed founders
                </p>
                <h1 className="font-grotesk text-5xl font-bold leading-[1.05] tracking-tight text-black md:text-6xl">
                  Know what investors will question before they see your deck.
                </h1>
                {/* <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-700">
                  Get a score, slide by slide notes and the one fix that matters
                  most. Benchmarked against [X] decks that raised. Free, no sign
                  up.
                </p> */}

                <motion.button
                  onClick={handleAnalyzeDeck}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="analyze"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-7 py-3.5 font-grotesk text-lg font-bold text-white shadow-comic comic-press"
                >
                  <UploadCloud className="h-5 w-5" />
                  Analyze my deck
                </motion.button>

                <p className="mt-4 flex items-center gap-1.5 text-sm text-neutral-500">
                  <Lock className="h-3.5 w-3.5" />
                  Your deck is never stored or used to train models.
                </p>
              </motion.div>

              <div className="relative hidden md:block">
                {/* sample report preview card — replaces the old floating score badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 w-80 rounded-2xl border-2 border-black bg-white p-5 shadow-comic-lg"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    Sample report
                  </span>

                  <div className="mb-4 mt-2 flex items-baseline gap-2">
                    <span className="font-grotesk text-4xl font-bold leading-none text-black">
                      74
                    </span>
                    <span className="text-sm text-neutral-500">
                      /100 investor readiness
                    </span>
                  </div>

                  <div className="mb-4 space-y-2 border-y-2 border-black py-3">
                    {subscores.map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-neutral-700">{s.label}</span>
                        <span className="font-grotesk font-bold text-black">
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3 rounded-lg border-2 border-black bg-beige p-3">
                    <p className="mb-1 text-[10px] font-semibold uppercase text-neutral-500">
                      Slide 4 · Market
                    </p>
                    <p className="text-sm text-neutral-800">
                      TAM is top down only. Add a bottom up number investors can
                      check.
                    </p>
                  </div>

                  <div className="rounded-lg border-2 border-black bg-beige p-3">
                    <p className="mb-1 text-[10px] font-semibold uppercase text-neutral-500">
                      Fix this first
                    </p>
                    <p className="text-sm font-medium text-black">
                      Move traction to slide 2. It&apos;s your strongest proof.
                    </p>
                  </div>
                </motion.div>

                {/* floating slide fragment */}
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

                {/* small orbiting sparkle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.6 },
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  }}
                  className="absolute -left-6 -top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-beige shadow-comic-sm"
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

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, rotate: index % 2 === 0 ? -0.6 : 0.6 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-2xl border-2 border-black bg-white p-6 shadow-comic-sm transition-shadow hover:shadow-comic"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-beige">
                  {feature.icon}
                </div>
                <h3 className="font-grotesk text-lg font-bold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {feature.description}
                </p>
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
            Analyze my deck
          </motion.button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
