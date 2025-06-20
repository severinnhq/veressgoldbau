"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Phone, Mail, CheckCircle, Star, Building2 } from 'lucide-react';
import NegativeConsequences from '@/components/NegativeConsequences';
import ReviewsGallery from '@/components/ReviewsGallery';
import Header from '@/components/Header';
import Hero from '@/components/Hero'; 
import FbReps from '@/components/FbReps';


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

  const STORAGE_KEY = 'quizProgress';

  useEffect(() => {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (nav?.type === 'navigate') {
      localStorage.removeItem(STORAGE_KEY);
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { step, data, results } = JSON.parse(saved);
        setCurrentStep(step);
        setFormData(data);
        setShowResults(results);
      } catch { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step: currentStep, data: formData, results: showResults })
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
        { value: "modern", label: "Modern családi ház", icon: "modern.png" },
        { value: "traditional", label: "Hagyományos magyar ház", icon: "traditional.png" },
        { value: "luxury", label: "Luxus villa", icon: "luxury.png" },
        { value: "eco", label: "Környezetbarát ház", icon: "eco.png" }
      ]
    },
     {
       question: "Mekkora házat képzel el?",
       type: "single",
       field: "size",
       options: [
         { value: "0-50", label: "0-50 m²", icon: "size-0-50.png" },
         { value: "50-100", label: "50-100 m²", icon: "size-50-100.png" },
         { value: "100-150", label: "100-150 m²", icon: "size-100-150.png" },
         { value: "150-200", label: "150-200 m²", icon: "size-150-200.png" },
         { value: "200+", label: "200+ m²", icon: "size-200plus.png" },
         { value: "idk", label: "Nem tudom", icon: "size-idk.png" }
       ]
     },
    {
      question: "Mikor szeretné elkezdeni az építkezést?",
      type: "single",
      field: "timeline",
      options: [
        { value: "immediately", label: "Azonnal", icon: "immediately.png" },
        { value: "3months", label: "3 hónapon belül", icon: "3months.png" },
        { value: "6months", label: "6 hónapon belül", icon: "6months.png" },
        { value: "1year", label: "1 éven belül", icon: "1year.png" }
      ]
    },
    {
      question: "Mi a tervezett költségvetése?",
      type: "single",
      field: "budget",
      options: [
        { value: "10-25", label: "10-25 millió Ft", icon: "50-100.png" },
        { value: "25-50", label: "25-50 millió Ft", icon: "25-50.png" },
        { value: "50-100", label: "50-100 millió Ft", icon: "50-100.png" },
        { value: "100+", label: "100+ millió Ft", icon: "100plus.png" }
      ]
    },
    {
      question: "Milyen extra szolgáltatások érdekelnek?",
      type: "multiple",
      field: "features",
      options: [
        { value: "pool", label: "Medence", icon: "pool.png" },
        { value: "garage", label: "Garázs", icon: "garage.png" },
        { value: "garden", label: "Kertészeti munkák", icon: "garden.png" },
        { value: "smart", label: "Okos otthon rendszer", icon: "smart.png" },
        { value: "solar", label: "Napelem rendszer", icon: "solar.png" },
        { value: "basement", label: "Pince", icon: "basement.png" }
      ]
    }
  ];

  const handleAnswerSelect = (value: string) => {
    const currentQuestion = quizSteps[currentStep - 1];
    if (currentQuestion.type === 'multiple') {
      const currentFeatures = formData.features;
      const newFeatures = currentFeatures.includes(value)
        ? currentFeatures.filter(f => f !== value)
        : [...currentFeatures, value];
      setFormData({ ...formData, features: newFeatures });
    } else {
      setFormData({ ...formData, [currentQuestion.field]: value });
    }
  };

  const nextStep = () => {
    if (currentStep < quizSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleContactSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Kérjük, töltsd ki az összes kötelez mezőt!');
      return;
    }
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
          {/* <Header /> */}
    <Hero /> {/* ✅ Inserted hero section */}

      <div className="relative z-10">
        {!showResults ? (
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <div className="flex justify-between mb-4 text-sm text-gray-600">
                  <span>{currentStep}. lépés {quizSteps.length}-ból</span>
                  <span>{Math.round((currentStep / quizSteps.length) * 100)}% kész</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-500 ease-out shadow-lg" style={{ width: `${(currentStep / quizSteps.length) * 100}%`, backgroundColor: '#ffc500' }} />
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">{quizSteps[currentStep - 1]?.question}</h2>

                {/* Conditionally render timeline & budget as vertical radio buttons */}
                {['timeline', 'budget'].includes(quizSteps[currentStep - 1]?.field) ? (
                  <div className="flex flex-col items-start gap-4 mb-8 max-w-md mx-auto">
                    {quizSteps[currentStep - 1]?.options.map((option, i) => {
                      const currentQuestion = quizSteps[currentStep - 1];
                      const isSelected = formData[currentQuestion.field] === option.value;

                      return (
                        <label key={i} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name={currentQuestion.field}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => {
                              handleAnswerSelect(option.value);
                              setTimeout(nextStep, 300);
                            }}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-gray-800 text-base font-medium">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`
                    grid gap-3 mb-8 max-w-fit mx-auto
                    grid-cols-2
                    md:grid-cols-${quizSteps[currentStep - 1]?.options.length === 4 ? '2' : '3'}
                  `}>
                    {quizSteps[currentStep - 1]?.options.map((option, i) => {
                      const currentQuestion = quizSteps[currentStep - 1];
                      const isSelected = currentQuestion.type === 'multiple'
                        ? formData.features.includes(option.value)
                        : formData[currentQuestion.field] === option.value;

                      const buttonWidth = quizSteps[currentStep - 1]?.options.length === 4 ? 'w-52' : 'w-44';
                      const imageHeight = quizSteps[currentStep - 1]?.options.length === 4 ? 'h-40' : 'h-32';

                      return (
                        <button
                          key={i}
                          onClick={() => {
                            handleAnswerSelect(option.value);
                            if (currentQuestion.type === 'single') setTimeout(nextStep, 300);
                          }}
                          className={`group ${buttonWidth} p-3 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 flex flex-col justify-between ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-400/30'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`${imageHeight} flex flex-col items-center justify-between`}>
                            <div className="flex-grow overflow-hidden">
                              <img
                                src={`/uploads/${option.icon}`} 
                                alt={option.label} 
                                className="w-full h-full object-cover rounded-t-xl"
                              />
                            </div>
                            <div className="h-10 flex items-center justify-center px-2">
                              <span className="text-sm font-semibold text-gray-800 text-center leading-tight">
                                {option.label}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentStep > 1 && (
                  <div className="flex justify-center mt-4">
                    <button onClick={() => setCurrentStep(currentStep - 1)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow">VISSZA</button>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
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
      <ReviewsGallery />
  {/* <FbReps /> */}
    </div>
  );
}
