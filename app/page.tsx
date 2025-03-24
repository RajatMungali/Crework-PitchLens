'use client';

import { motion } from 'framer-motion';
import { Upload, Sparkles, Target, LineChart, Clock, Star } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "AI-Powered Analysis",
    description: "Advanced GPT-4 analysis of your pitch deck content, structure, and presentation."
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Slide-by-Slide Feedback",
    description: "Detailed feedback and improvement suggestions for each slide in your deck."
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Comprehensive Scoring",
    description: "Get scores across multiple dimensions including clarity, impact, and completeness."
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Instant Results",
    description: "Receive detailed analysis and recommendations in seconds, not hours."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Startup Founder",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    content: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    name: "Michael Rodriguez",
    role: "VC Associate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    content: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    name: "Emily Zhang",
    role: "Angel Investor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    content: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
];

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleAnalyzeDeck = () => {
    setIsUploading(true);
    router.push('/result');  
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10">
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <h1 className="text-6xl md:text-7xl font-bold text-[#be00e8] mb-6 leading-tight">
                Perfect Your Pitch Deck<br /> with AI
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Get instant, professional feedback on your pitch deck. Our AI analyzes every aspect to help you create a compelling story that investors love.
              </p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <button 
                  onClick={handleAnalyzeDeck}
                  className="bg-[#be00e8] hover:bg-[#9a00c4] text-white font-bold py-4 px-8 rounded-full text-xl transition-colors duration-300 ease-in-out shadow-lg hover:shadow-xl"
                >
                  Analyze the Deck
                </button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Everything you need to create a pitch deck that stands out
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-[#be00e8] mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials section remains the same */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">What Users Say</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Join hundreds of founders who've improved their pitch decks with CreworkAI
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}