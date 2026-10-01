"use client";
import React, { useState } from "react";
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  Award,
  BarChart2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  Wrench,
  Linkedin,
  Download,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FeedbackSectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  toggleExpanded: () => void;
  content: string | React.ReactNode;
  className?: string;
}

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [pdfContent, setPdfContent] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReupload = () => {
    setAnalysisResults(null);
    if (pdfContent && pdfContent.url) {
      URL.revokeObjectURL(pdfContent.url);
    }
    setPdfContent(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-20 pb-12">
        {!analysisResults ? (
          <FileUpload
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            setAnalysisResults={setAnalysisResults}
            setPdfContent={setPdfContent}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        ) : (
          <ResultsPage
            analysisResults={analysisResults}
            pdfContent={pdfContent}
            onReupload={handleReupload}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

interface FileUploadProps {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  setAnalysisResults: (value: any) => void;
  setPdfContent: (value: any) => void;
  errorMessage: string | null;
  setErrorMessage: (value: string | null) => void;
}

const FileUpload = ({
  isUploading,
  setIsUploading,
  setAnalysisResults,
  setPdfContent,
  errorMessage,
  setErrorMessage,
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    await handleFiles(files);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setErrorMessage(null);

    if (files?.[0]) {
      const file = files[0];

      if (file.size > 4.5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 4.5MB");
        return;
      }

      if (!file.type.includes("pdf")) {
        setErrorMessage("Please upload a PDF file");
        return;
      }

      setIsUploading(true);

      try {
        const pdfUrl = URL.createObjectURL(file);

        const pdfMetadata = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: pdfUrl,
          lastModified: file.lastModified,
        };

        setPdfContent(pdfMetadata);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to analyze pitch deck");
        }

        const data = await response.json();
        setAnalysisResults(data);
      } catch (error: any) {
        console.error("Error:", error);
        setErrorMessage(
          error.message ||
            "Failed to analyze the pitch deck. Please try again.",
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-xl mx-auto px-4">
        <div
          className={`relative rounded-2xl border-2 border-black p-10 text-center transition-all ${
            dragActive
              ? "bg-beige shadow-comic-sm scale-[1.01]"
              : errorMessage
                ? "bg-white shadow-comic-sm border-red-500"
                : "bg-white shadow-comic-sm"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <span className="corner-dot -left-1.5 -top-1.5" />
          <span className="corner-dot -right-1.5 -top-1.5" />
          <span className="corner-dot -left-1.5 -bottom-1.5" />
          <span className="corner-dot -right-1.5 -bottom-1.5" />

          <input
            type="file"
            accept=".pdf"
            onChange={handleChange}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />

          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center ${!isUploading ? "cursor-pointer" : ""}`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-beige">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : errorMessage ? (
                <AlertCircle className="h-8 w-8 text-red-600" />
              ) : (
                <Upload className="h-8 w-8" />
              )}
            </span>

            <h3
              className={`mt-5 font-grotesk text-2xl font-bold ${
                errorMessage ? "text-red-600" : "text-black"
              }`}
            >
              {isUploading
                ? "Analyzing your deck..."
                : errorMessage
                  ? "Error"
                  : "Upload your pitch deck"}
            </h3>

            {errorMessage ? (
              <p className="mt-2 text-red-600">{errorMessage}</p>
            ) : (
              <p className="mt-2 text-neutral-600">
                Drop your PDF here or click to browse
              </p>
            )}

            {!errorMessage && (
              <p className="mt-1 text-sm text-neutral-400">
                Maximum file size: 4.5MB
              </p>
            )}

            {errorMessage && (
              <button
                onClick={() => setErrorMessage(null)}
                className="mt-5 rounded-full border-2 border-black bg-white px-5 py-2 font-grotesk text-sm font-semibold shadow-comic-sm comic-press"
                type="button"
              >
                Try Again
              </button>
            )}
          </label>
        </div>
      </div>
    </motion.div>
  );
};

interface ResultsPageProps {
  analysisResults: {
    score: number;
    spelling: number;
    structure: number;
    deckLength: number;
    clarity: number;
    buildReadiness: number;
    slideBySlideReview?: SlideReview[];
    feedback: {
      content: string;
      design: string;
      spelling: string;
    };
    recommendation: string;
  };
  pdfContent: {
    name: string;
    size: number;
    type: string;
    url: string;
    lastModified: number;
  } | null;
  onReupload: () => void;
}

interface SlideReview {
  slideNumber: number;
  title: string;
  review: string;
}

const KEEP_GOING_LINKS = [
  {
    title: "FounderOS",
    description: "Run your startup ops in one place.",
    href: "https://crework-founderos.vercel.app",
  },
  {
    title: "Idea to Impact",
    description: "A newsletter on building from zero.",
    href: "https://substack.com/@ideatoimpactbysj",
  },
  {
    title: "Crework Labs",
    description: "See everything else we build for founders.",
    href: "https://www.creworklabs.com",
  },
];

const ResultsPage = ({
  analysisResults,
  pdfContent,
  onReupload,
}: ResultsPageProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "content",
  );

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Strong";
    if (score >= 70) return "Promising";
    if (score >= 50) return "Needs work";
    return "Not ready";
  };

  const getScoreDot = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-400";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const roundedScore = Math.round(analysisResults.score);
  const shareText = `My deck scored ${roundedScore} on PitchLens`;

  const handleShareLinkedIn = () => {
    const siteUrl = "https://creworkpitchlens.vercel.app";

    const postText = [
      `I just ran my pitch deck through PitchLens by Crework Labs and scored ${roundedScore}/100.`,
      ``,
      `It reviewed every slide, flagged what investors would push back on, and showed me exactly what to fix before my next pitch.`,
      ``,
      `Raising soon? See how your deck scores 👉 ${siteUrl}`,
      ``,
    ].join("\n");

    // Open the tab first: browsers block popups opened after an await.
    window.open(
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postText)}`,
      "_blank",
      "noopener,noreferrer",
    );

    // Download the score image so the user can attach it to the post.
    handleDownloadImage();

    // Fallback in case LinkedIn stops prefilling the text.
    navigator.clipboard?.writeText(postText).catch(() => {});
  };

  const handleDownloadImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    // corner dots
    ctx.fillStyle = "#ffffff";
    [
      [24, 24],
      [canvas.width - 24, 24],
      [24, canvas.height - 24],
      [canvas.width - 24, canvas.height - 24],
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    ctx.font = "600 32px sans-serif";
    ctx.fillText("MY PITCH DECK SCORED", canvas.width / 2, 340);

    ctx.font = "bold 320px sans-serif";
    ctx.fillText(String(roundedScore), canvas.width / 2, 640);

    ctx.font = "600 32px sans-serif";
    ctx.fillText("ON", canvas.width / 2, 720);

    ctx.font = "bold 64px sans-serif";
    ctx.fillText("PitchLens", canvas.width / 2, 800);

    ctx.font = "400 24px sans-serif";
    ctx.fillStyle = "#555555";
    ctx.fillText("by Crework Labs", canvas.width / 2, 850);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pitchlens-score-${roundedScore}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const renderSlideReviews = () => {
    const slideReviews = analysisResults.slideBySlideReview || [];

    if (slideReviews.length === 0) {
      return (
        <p className="text-neutral-600 text-sm">
          No detailed slide reviews available at this time.
        </p>
      );
    }

    return slideReviews.map((slide, index) => {
      const reviewRegex = /^([\s\S]*?)\s*Areas for Improvement:\s*([\s\S]*)$/i;
      const matches = slide.review.match(reviewRegex);

      let strengthsContent = slide.review;
      let improvementContent = "No specific areas for improvement noted.";

      if (matches && matches.length >= 3) {
        strengthsContent = matches[1].replace(/^Strengths:\s*/i, "").trim();
        improvementContent = matches[2].trim();
      }

      return (
        <div
          key={index}
          className="rounded-xl border-2 border-black bg-beige p-4 mb-3 shadow-comic-sm"
        >
          <div className="text-neutral-800">
            <p className="mb-2 font-grotesk">
              <span className="font-bold">Slide {slide.slideNumber}:</span>{" "}
              {slide.title}
            </p>
            <p className="font-semibold">Strengths</p>
            <p className="text-sm">{strengthsContent}</p>
            <p className="font-semibold mt-2">Areas for Improvement</p>
            <p className="text-sm">{improvementContent}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="rounded-2xl border-2 border-black bg-white p-4 sm:p-6 shadow-comic">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="font-grotesk text-xl sm:text-2xl font-bold text-black">
                Deck Analysis Results
              </h1>
              {pdfContent && (
                <p className="text-neutral-600 mt-1 text-sm sm:text-base">
                  {pdfContent.name}
                </p>
              )}
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-black bg-black px-5 py-3 text-white">
              <span className="font-grotesk text-3xl font-bold leading-none">
                {roundedScore}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${getScoreDot(analysisResults.score)}`}
                />
                {getScoreLabel(analysisResults.score)}
              </span>
            </div>
          </div>
        </div>

        {pdfContent && (
          <div className="mt-4 rounded-2xl border-2 border-black bg-white p-4 sm:p-6 shadow-comic-sm">
            <iframe
              src={pdfContent.url}
              className="w-full h-64 sm:h-96 rounded-xl border-2 border-black"
              title="PDF Preview"
            />
          </div>
        )}

        <div className="mt-4 rounded-2xl border-2 border-black bg-beige p-4 sm:p-6 shadow-comic-sm">
          <h2 className="font-grotesk text-base sm:text-lg font-bold text-black mb-4">
            Metrics Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <MetricCard
              title="Spelling & Grammar"
              value={analysisResults.spelling}
              icon={<CheckCircle className="h-5 w-5" />}
            />
            <MetricCard
              title="Structure"
              value={analysisResults.structure}
              icon={<BarChart2 className="h-5 w-5" />}
            />
            <MetricCard
              title="Deck Length"
              value={analysisResults.deckLength}
              icon={<BookOpen className="h-5 w-5" />}
            />
            <MetricCard
              title="Clarity"
              value={analysisResults.clarity}
              icon={<Award className="h-5 w-5" />}
            />
            <MetricCard
              title="Build Readiness"
              value={analysisResults.buildReadiness}
              icon={<Wrench className="h-5 w-5" />}
              badge="new"
            />

            {pdfContent && (
              <MetricCard
                title="File Size"
                value={formatFileSize(pdfContent.size)}
                suffix=""
                icon={<Award className="h-5 w-5" />}
              />
            )}
          </div>
        </div>

        {analysisResults.buildReadiness < 60 && (
          <div className="mt-4 rounded-2xl border-2 border-black bg-black p-5 sm:p-6 text-white shadow-comic">
            <p className="font-grotesk text-lg font-bold">
              Investors will ask who&apos;s building this.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              Crework&apos;s Overnight CTO team ships production MVPs in 3 to 4
              weeks. NailFound went live with 50+ artists signed up in its first
              week.
            </p>
            <a
              href="https://www.creworklabs.com/overnight-cto"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-5 py-2.5 font-grotesk text-sm font-semibold text-black shadow-comic-sm comic-press"
            >
              See how Overnight CTO works
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        )}

        <div className="mt-4 rounded-2xl border-2 border-black bg-white shadow-comic-sm overflow-hidden">
          <FeedbackSection
            title="Content Feedback"
            icon={<BookOpen className="h-5 w-5" />}
            expanded={expandedSection === "content"}
            toggleExpanded={() => toggleSection("content")}
            content={analysisResults.feedback.content}
          />

          <FeedbackSection
            title="Design Feedback"
            icon={<Award className="h-5 w-5" />}
            expanded={expandedSection === "design"}
            toggleExpanded={() => toggleSection("design")}
            content={analysisResults.feedback.design}
            className="border-t-2 border-black"
          />

          <FeedbackSection
            title="Spelling & Grammar"
            icon={<CheckCircle className="h-5 w-5" />}
            expanded={expandedSection === "spelling"}
            toggleExpanded={() => toggleSection("spelling")}
            content={analysisResults.feedback.spelling}
            className="border-t-2 border-black"
          />

          <FeedbackSection
            title="Slide-by-Slide Review"
            icon={<Target className="h-5 w-5" />}
            expanded={expandedSection === "slides"}
            toggleExpanded={() => toggleSection("slides")}
            content={renderSlideReviews()}
            className="border-t-2 border-black"
          />

          <div className="p-4 sm:p-6 border-t-2 border-black">
            <div className="rounded-xl border-2 border-black bg-beige p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-grotesk font-bold text-black">
                    Increase your score by
                  </h3>
                  <p className="text-neutral-700 mt-1 text-sm sm:text-base">
                    {analysisResults.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border-2 border-black bg-beige p-5 sm:p-6 text-center shadow-comic-sm">
          <p className="font-grotesk text-lg font-bold text-black">
            {shareText}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleShareLinkedIn}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-5 py-2.5 font-grotesk text-sm font-semibold text-white shadow-comic-sm comic-press"
            >
              <Linkedin className="h-4 w-4" />
              Share on LinkedIn
            </button>
            <button
              onClick={handleDownloadImage}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-5 py-2.5 font-grotesk text-sm font-semibold text-black shadow-comic-sm comic-press"
            >
              <Download className="h-4 w-4" />
              Download image
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={onReupload}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-6 py-3 font-grotesk font-semibold text-white shadow-comic comic-press"
          >
            Re-upload
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </motion.button>
        </div>

        <div className="mt-16">
          <h2 className="mb-4 text-center font-grotesk text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Keep going
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {KEEP_GOING_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border-2 border-black bg-white p-5 shadow-comic-sm transition-shadow hover:shadow-comic"
              >
                <div className="flex items-center justify-between">
                  <span className="font-grotesk font-bold text-black">
                    {link.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-black" />
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {link.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  suffix?: string;
  badge?: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  suffix = "",
  badge,
}: MetricCardProps) => (
  <div className="rounded-xl border-2 border-black bg-white p-3 sm:p-4 shadow-comic-sm">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {icon}
        <h3 className="text-xs sm:text-sm font-medium text-neutral-700 ml-2">
          {title}
        </h3>
        {badge && (
          <span className="ml-1.5 text-[10px] font-semibold uppercase text-neutral-400">
            {badge}
          </span>
        )}
      </div>
      <span className="font-grotesk text-base sm:text-xl font-bold text-black">
        {value}
        {suffix}
      </span>
    </div>
  </div>
);

const FeedbackSection = ({
  title,
  icon,
  expanded,
  toggleExpanded,
  content,
  className = "",
}: FeedbackSectionProps) => (
  <div className={`${className}`}>
    <button
      onClick={toggleExpanded}
      className="w-full p-4 sm:p-6 text-left flex items-center justify-between focus:outline-none"
    >
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <h3 className="font-grotesk font-bold text-black text-sm sm:text-base">
          {title}
        </h3>
      </div>
      {expanded ? (
        <ChevronUp className="h-5 w-5 text-neutral-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-neutral-500" />
      )}
    </button>
    {expanded && (
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        {typeof content === "string" ? (
          <p className="text-neutral-700 text-sm sm:text-base">{content}</p>
        ) : (
          content
        )}
      </div>
    )}
  </div>
);

export default App;
