"use client"
import React, { useState } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle, Award, BarChart2, BookOpen, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GradientBackground from '@/components/GradientBackground';

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
    <div className="flex flex-col min-h-screen">
      <GradientBackground />
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
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
  setErrorMessage
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

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 4.5MB');
        return;
      }

      if (!file.type.includes('pdf')) {
        setErrorMessage('Please upload a PDF file');
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
          lastModified: file.lastModified
        };

        setPdfContent(pdfMetadata);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze pitch deck');
        }

        const data = await response.json();
        setAnalysisResults(data);

      } catch (error: any) {
        console.error('Error:', error);
        setErrorMessage(error.message || 'Failed to analyze the pitch deck. Please try again.');
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
          className={`border-2 border-dashed rounded-xl p-8 text-center ${dragActive ? 'border-[#be00e8] bg-purple-50' :
            errorMessage ? 'border-red-400 bg-red-50' : 'border-gray-300'
            } transition-colors hover:border-purple-400`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
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
            className={`flex flex-col items-center ${!isUploading ? 'cursor-pointer' : ''}`}
          >
            {isUploading ? (
              <Loader2 className="h-12 w-12 text-[#be00e8] animate-spin" />
            ) : errorMessage ? (
              <AlertCircle className="h-12 w-12 text-red-500" />
            ) : (
              <Upload className="h-12 w-12 text-[#be00e8]" />
            )}

            <h3 className={`mt-4 text-2xl font-semibold ${errorMessage ? 'text-red-600' : 'text-gray-800'
              }`}>
              {isUploading ? 'Analyzing your deck...' :
                errorMessage ? 'Error' : 'Upload your pitch deck'}
            </h3>

            {errorMessage ? (
              <p className="mt-2 text-red-600">{errorMessage}</p>
            ) : (
              <p className="mt-2 text-gray-600">
                Drop your PDF here or click to browse
              </p>
            )}

            {!errorMessage && (
              <p className="mt-1 text-sm text-gray-400">
                Maximum file size: 4.5MB
              </p>
            )}

            {errorMessage && (
              <button
                onClick={() => setErrorMessage(null)}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
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

const ResultsPage = ({ analysisResults, pdfContent, onReupload }: ResultsPageProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('content');

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-gradient-to-r from-purple-400 to-purple-600';
    if (score >= 70) return 'bg-gradient-to-r from-purple-300 to-purple-500';
    if (score >= 50) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-red-600';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

    const renderSlideReviews = () => {
    const slideReviews = analysisResults.slideBySlideReview || [];
    
    if (slideReviews.length === 0) {
      return (
        <p className="text-gray-600 text-sm">
          No detailed slide reviews available at this time.
        </p>
      );
    }
  
    return slideReviews.map((slide, index) => {
      // More robust pattern matching for section splitting
      const reviewRegex = /^([\s\S]*?)\s*Areas for Improvement:\s*([\s\S]*)$/i;
      const matches = slide.review.match(reviewRegex);
      
      let strengthsContent = slide.review;
      let improvementContent = 'No specific areas for improvement noted.';
      
      if (matches && matches.length >= 3) {
        strengthsContent = matches[1].replace(/^Strengths:\s*/i, '').trim();
        improvementContent = matches[2].trim();
      }
      
      return (
        <div 
          key={index} 
          className="bg-purple-50 rounded-lg p-4 mb-3 border border-purple-100"
        >
          <div className="text-gray-700">
            <p className="mb-2"> <span className='text-purple-700 font-semibold'> Slide {slide.slideNumber}: </span> {slide.title}</p>
            <p className="font-semibold">Strengths:</p>
            <p>{strengthsContent}</p>
            <p className="font-semibold mt-2">Areas for Improvement:</p>
            <p>{improvementContent}</p>
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
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Deck Analysis Results</h1>
              {pdfContent && (
                <p className="text-gray-600 mt-1 text-sm sm:text-base">{pdfContent.name}</p>
              )}
            </div>
            <div className={`${getScoreColor(analysisResults.score)} text-white rounded-xl p-3 sm:p-4 flex items-center justify-center min-w-24 sm:min-w-28`}>
              <span className="text-2xl sm:text-3xl font-bold">{analysisResults.score.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {pdfContent && (
          <div className="bg-white border-x border-gray-200">
            <div className="p-4 sm:p-6">
              <iframe
                src={pdfContent.url}
                className="w-full h-64 sm:h-96 border border-gray-200 rounded-lg"
                title="PDF Preview"
              />
            </div>
          </div>
        )}

        <div className="bg-purple-50 p-4 sm:p-6 border-x border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Metrics Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <MetricCard
              title="Spelling & Grammar"
              value={analysisResults.spelling}
              icon={<CheckCircle className="h-5 w-5 text-purple-600" />}
            />
            <MetricCard
              title="Structure"
              value={analysisResults.structure}
              icon={<BarChart2 className="h-5 w-5 text-purple-600" />}
            />
            <MetricCard
              title="Deck Length"
              value={analysisResults.deckLength}
              icon={<BookOpen className="h-5 w-5 text-purple-600" />}
            />
            <MetricCard
              title="Clarity"
              value={analysisResults.clarity}
              icon={<Award className="h-5 w-5 text-purple-600" />}
            />

            {pdfContent && (
              <MetricCard
                title="File Size"
                value={formatFileSize(pdfContent.size)}
                suffix=""
                icon={<Award className="h-5 w-5 text-purple-600" />}
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200">
          <FeedbackSection
            title="Content Feedback"
            icon={<BookOpen className="h-5 w-5" />}
            expanded={expandedSection === 'content'}
            toggleExpanded={() => toggleSection('content')}
            content={analysisResults.feedback.content}
          />

          <FeedbackSection
            title="Design Feedback"
            icon={<Award className="h-5 w-5" />}
            expanded={expandedSection === 'design'}
            toggleExpanded={() => toggleSection('design')}
            content={analysisResults.feedback.design}
            className="border-t border-gray-200"
          />

          <FeedbackSection
            title="Spelling & Grammar"
            icon={<CheckCircle className="h-5 w-5" />}
            expanded={expandedSection === 'spelling'}
            toggleExpanded={() => toggleSection('spelling')}
            content={analysisResults.feedback.spelling}
            className="border-t border-gray-200"
          />

          <FeedbackSection
            title="Slide-by-Slide Review"
            icon={<Target className="h-5 w-5" />}
            expanded={expandedSection === 'slides'}
            toggleExpanded={() => toggleSection('slides')}
            content={renderSlideReviews()}
            className="border-t border-gray-200"
          />

          <div className="p-4 sm:p-6 border-t border-gray-200">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800">Increase your score by</h3>
                  <p className="text-gray-700 mt-1">{analysisResults.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onReupload}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            Re-upload
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </button>
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
}

const MetricCard = ({ title, value, icon, suffix = "" }: MetricCardProps) => (
  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {icon}
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 ml-2">{title}</h3>
      </div>
      <span className="text-base sm:text-xl font-bold text-gray-900">{value}{suffix}</span>
    </div>
  </div>
);

const FeedbackSection = ({ title, icon, expanded, toggleExpanded, content, className = "" }: FeedbackSectionProps) => (
  <div className={`${className}`}>
    <button
      onClick={toggleExpanded}
      className="w-full p-4 sm:p-6 text-left flex items-center justify-between focus:outline-none"
    >
      <div className="flex items-center">
        <div className="text-purple-600 mr-3">{icon}</div>
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{title}</h3>
      </div>
      {expanded ?
        <ChevronUp className="h-5 w-5 text-gray-500" /> :
        <ChevronDown className="h-5 w-5 text-gray-500" />
      }
    </button>
    {expanded && (
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        {typeof content === 'string' ? (
          <p className="text-gray-700 text-sm sm:text-base">{content}</p>
        ) : (
          content
        )}
      </div>
    )}
  </div>
);

export default App;