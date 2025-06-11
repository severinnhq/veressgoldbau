'use client';

import React, { useState, useEffect } from 'react';
import {   Clock, Phone, Mail,  CheckCircle,  Star, Building2 } from 'lucide-react';
import NegativeConsequences from '@/components/NegativeConsequences';
import ReviewSection from '@/components/ReviewSection';


interface FormData {
  projectType: string;
  budget: string;
  timeline: string;
  location: string;
  size: string;
  style: string;
  features: string[];
  name: string;
  email: string;
  phone: string;
}

interface QuizOption {
  value: string;
  label: string;
  icon: string;
}

interface QuizStep {
  question: string;
  type: 'single' | 'multiple';
  field: keyof FormData;
  options: QuizOption[];
}

export default function ConstructionFunnel() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    budget: '',
    timeline: '',
    location: '',
    size: '',
    style: '',
    features: [],
    name: '',
    email: '',
    phone: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ► key under which we persist quiz progress
  const STORAGE_KEY = 'quizProgress';

  // ► on mount: clear only if a "fresh" navigation, otherwise restore
  useEffect(() => {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (nav?.type === 'navigate') {
      // user arrived by link/bookmark—start fresh
      localStorage.removeItem(STORAGE_KEY);
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { step, data, results } = JSON.parse(saved);
        setCurrentStep(step);
        setFormData(data);
        setShowResults(results);
      } catch { /* ignore parse errors */ }
    }
  }, []);

  // ► on any state change, save to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
     JSON.stringify({
        step: currentStep,
        data: formData,
        results: showResults,
      })
    );
  }, [currentStep, formData, showResults]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const quizSteps: QuizStep[] = [
    {
      question: "Milyen típusú házat szeretne építeni?",
      type: "single",
      field: "projectType",
      options: [
        { value: "modern", label: "Modern családi ház", icon: "🏗️" },
        { value: "traditional", label: "Hagyományos magyar ház", icon: "🏠" },
        { value: "luxury", label: "Luxus villa", icon: "🏛️" },
        { value: "eco", label: "Környezetbarát ház", icon: "🌱" }
      ]
    },
    {
      question: "Mi a tervezett költségvetése?",
      type: "single",
      field: "budget",
      options: [
        { value: "10-25", label: "10-25 millió Ft", icon: "💰" },
        { value: "25-50", label: "25-50 millió Ft", icon: "💎" },
        { value: "50-100", label: "50-100 millió Ft", icon: "👑" },
        { value: "100+", label: "100+ millió Ft", icon: "✨" }
      ]
    },
    {
      question: "Mikor szeretné elkezdeni az építkezést?",
      type: "single",
      field: "timeline",
      options: [
        { value: "immediately", label: "Azonnal", icon: "⚡" },
        { value: "3months", label: "3 hónapon belül", icon: "📅" },
        { value: "6months", label: "6 hónapon belül", icon: "🗓️" },
        { value: "1year", label: "1 éven belül", icon: "⏰" }
      ]
    },
    {
      question: "Mekkora házat képzel el?",
      type: "single",
      field: "size",
      options: [
        { value: "small", label: "80-120 m²", icon: "🏘️" },
        { value: "medium", label: "120-200 m²", icon: "🏡" },
        { value: "large", label: "200-300 m²", icon: "🏠" },
        { value: "xlarge", label: "300+ m²", icon: "🏰" }
      ]
    },
    {
      question: "Milyen extra szolgáltatások érdekelnek?",
      type: "multiple",
      field: "features",
      options: [
        { value: "pool", label: "Medence", icon: "🏊" },
        { value: "garage", label: "Garázs", icon: "🚗" },
        { value: "garden", label: "Kertészeti munkák", icon: "🌳" },
        { value: "smart", label: "Okos otthon rendszer", icon: "📱" },
        { value: "solar", label: "Napelem rendszer", icon: "☀️" },
        { value: "basement", label: "Pince", icon: "🏠" }
      ]
    }
  ];

  const handleAnswerSelect = (value: string) => {
    const currentQuestion = quizSteps[currentStep - 1];
    
    if (currentQuestion.type === 'multiple') {
      const currentFeatures = formData.features || [];
      const newFeatures = currentFeatures.includes(value)
        ? currentFeatures.filter(f => f !== value)
        : [...currentFeatures, value];
      setFormData({ ...formData, features: newFeatures });
    } else {
      setFormData({ ...formData, [currentQuestion.field]: value });
    }
  };

  const nextStep = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleContactSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Kérjük, töltse ki az összes kötelező mezőt!');
      return;
    }
    // Here you would typically send the data to your backend
    alert('Köszönjük! Hamarosan felvesszük Önnel a kapcsolatot!');
  };

  const getBudgetLevel = (): string => {
    const budget = formData.budget;
    if (budget === '100+') return 'PRÉMIUM';
    if (budget === '50-100') return 'LUXUS';
    if (budget === '25-50') return 'PRÉMIUM';
    return 'STANDARD';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 overflow-hidden">
      {/* Animated background elements with glowing effects */}
      <div className="fixed inset-0 opacity-30">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-200 to-blue-200 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-3xl animate-bounce" />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-lg border-b border-gray-300" style={{ backgroundColor: '#302f2f' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">
              LOGO
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-white">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-300" />
                <span>+36 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-300" />
                <span>email</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {!showResults ? (
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              {/* Progress bar */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    {currentStep}. lépés {quizSteps.length}-ból
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round((currentStep / quizSteps.length) * 100)}% kész
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${(currentStep / quizSteps.length) * 100}%`, backgroundColor: '#ffc500' }}
                  />
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
                  {quizSteps[currentStep - 1]?.question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {quizSteps[currentStep - 1]?.options.map((option: QuizOption, index: number) => {
                    const currentQuestion = quizSteps[currentStep - 1];
                    const isSelected = currentQuestion.type === 'multiple' 
                      ? formData.features?.includes(option.value)
                      : formData[currentQuestion.field as keyof FormData] === option.value;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          handleAnswerSelect(option.value);
                          if (quizSteps[currentStep - 1].type !== 'multiple') {
                            setTimeout(() => nextStep(), 300);
                          }
                        }}
                        className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          isSelected
                            ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-500/25'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">{option.icon}</span>
                          <span className="text-lg font-medium text-gray-800">{option.label}</span>
                          {isSelected && <CheckCircle className="w-6 h-6 text-blue-500 ml-auto" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {currentStep > 1 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="group bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow"
                    >
                      VISSZA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          /* Results Section */
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  🎉 GRATULÁLUNK!
                </h2>
                <p className="text-2xl text-gray-600 mb-8">
                  Személyre szabott ajánlatunk {getBudgetLevel()} kategóriában
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Results Card */}
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                    <Star className="w-6 h-6 text-yellow-500 mr-2" />
                    Az Ön álomháza
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Ház típusa:</span>
                      <span className="font-semibold text-gray-800">{formData.projectType}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Költségkeret:</span>
                      <span className="font-semibold text-gray-800">{formData.budget} M Ft</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Méret:</span>
                      <span className="font-semibold text-gray-800">{formData.size}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Időkeret:</span>
                      <span className="font-semibold text-gray-800">{formData.timeline}</span>
                    </div>
                    {formData.features?.length > 0 && (
                      <div className="py-2">
                        <span className="text-gray-600 block mb-2">Extra szolgáltatások:</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.features.map((feature, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-lg rounded-3xl p-8 border border-blue-200 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                    <Phone className="w-6 h-6 text-blue-600 mr-2" />
                    Ingyenes konzultáció
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Teljes név *"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <input
                      type="email"
                      placeholder="E-mail cím *"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Telefonszám *"
                      value={formData.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      onClick={handleContactSubmit}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                      INGYENES KONZULTÁCIÓ KÉRÉSE
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-4 text-center">
                    * 24 órán belül felvesszük Önnel a kapcsolatot
                  </p>
                </div>
              </div>

              {/* Special Offer */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 backdrop-blur-lg rounded-3xl p-8 border border-orange-300 shadow-2xl text-center">
                <h3 className="text-3xl font-bold mb-4 text-orange-600">
                  🔥 LIMITÁLT AJÁNLAT!
                </h3>
                <p className="text-xl mb-6 text-gray-800">
                  Az első 10 jelentkező számára <span className="font-bold text-orange-600">15% kedvezmény</span> a teljes projektre!
                </p>
                <div className="flex justify-center items-center space-x-4 text-lg text-gray-700">
                  <Clock className="w-6 h-6 text-orange-500" />
                  <span>Az ajánlat csak a következő 48 órában érvényes!</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      <NegativeConsequences />
     {/* <ReviewSection /> */}
    </div>
  );
}