"use client";

import React, { useState, useEffect } from 'react';
import NegativeConsequences from '@/components/NegativeConsequences';
import ReviewsGallery from '@/components/ReviewsGallery';

import Hero from '@/components/Hero'; 


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
  acceptedPrivacy: boolean;
}

interface QuizOption {
  value: string;
  label: string;
  icon: string;
}

interface QuizStep {
  question: string;
  type: 'single' | 'multiple' | 'input' | 'contact';
  field?: keyof FormData;
  options?: QuizOption[];
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
    phone: '',
    acceptedPrivacy: false
  });
  const [showResults, setShowResults] = useState(false);

  const [errors, setErrors] = useState<{email?: string; phone?: string}>({});

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



  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Simple phone validation - at least 6 digits
    const re = /^[0-9\s+\-()]{6,}$/;
    return re.test(phone);
  };

  const sendToGHL = async () => {
    const payload = {
      contact: {
        project_type: formData.projectType,
        size:         formData.size,
        timeline:     formData.timeline,
        budget:       formData.budget,
        location:     formData.location,
        features:     formData.features.join(', '),
        email:        formData.email,
        phone:        formData.phone,
        name:         formData.name,
      }
    };

    try {
      const res = await fetch(
        'https://services.leadconnectorhq.com/hooks/bJPQjhb90Jsg6klKL6Hm/webhook-trigger/fafe3546-ffef-4178-8ca1-ba14a73ae1f2',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error('GHL webhook error:', res.status, text);
        alert('Hiba történt az adatok elküldésekor.');
        return;
      }

      alert('Köszönjük! Az adatokat elküldtük.');
      setShowResults(true);
    } catch (err) {
      console.error('Network error sending to GHL:', err);
      alert('Hálózati hiba történt.');
    }
  };

  const validateContactInfo = () => {
    const newErrors: {email?: string; phone?: string} = {};
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Érvénytelen e-mail cím formátum';
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Érvénytelen telefonszám formátum';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        { value: "azonnal", label: "Azonnal", icon: "immediately.png" },
        { value: "1-2 het", label: "1-2 héten belül", icon: "1-2hetes.png" },
        { value: "1honap", label: "1 hónap múlva", icon: "1month.png" }
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
      question: "Hol lesz az építkezés helyszíne? (város)",
      type: "input",
      field: "location"
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
        { value: "none", label: "Egyik se", icon: "none.png" }
      ]
    },
    {
      question: "Kapcsolattartási adatok",
      type: "contact"
    }
  ];

  const handleAnswerSelect = (value: string) => {
    const currentQuestion = quizSteps[currentStep - 1];
    if (currentQuestion.type === 'multiple' && currentQuestion.field) {
      const currentFeatures = formData.features;
      const newFeatures = currentFeatures.includes(value)
        ? currentFeatures.filter(f => f !== value)
        : [...currentFeatures, value];
      setFormData({ ...formData, features: newFeatures });
    } else if (currentQuestion.field) {
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

 
    
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 overflow-hidden">
      <Hero />
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

                {quizSteps[currentStep - 1]?.type === 'input' ? (
                  <div className="max-w-sm mx-auto mb-8">
                    <input
                      type="text"
                      placeholder="Írd be a várost"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      onClick={nextStep}
                      className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition-all"
                    >
                      TOVÁBB
                    </button>
                  </div>
                ) : quizSteps[currentStep - 1]?.type === 'contact' ? (
                  <div className="max-w-md mx-auto">
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        placeholder="Teljes név *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      
                      <div>
                        <input
                          type="email"
                          placeholder="E-mail cím *"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          onBlur={() => validateContactInfo()}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <input
                          type="tel"
                          placeholder="Telefonszám *"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                          }}
                          onBlur={() => validateContactInfo()}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.acceptedPrivacy}
                          onChange={(e) => setFormData({ ...formData, acceptedPrivacy: e.target.checked })}
                          className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700 text-sm">
                          A gombra kattintva elfogadja az{" "}
                          <a 
                            href="/adatkezelesi-tajekoztato" 
                            target="_blank" 
                            className="text-blue-600 hover:underline font-medium"
                          >
                            adatkezelési tájékoztatónkat
                          </a>.
                        </span>
                      </label>
                    </div>
                    
                    <button
                    onClick={() => {
                      if (validateContactInfo()) {
                        sendToGHL();
                      }
                    }}
                      disabled={!formData.name || !formData.email || !formData.phone || !formData.acceptedPrivacy}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        !formData.name || !formData.email || !formData.phone || !formData.acceptedPrivacy
                          ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      AJÁNLATOT KAPOK
                    </button>
                  </div>
                  
                ) : (
                  <>
                    {['timeline', 'budget'].includes(quizSteps[currentStep - 1]?.field as string) ? (
                      <div className="flex flex-col items-start gap-4 mb-8 max-w-md mx-auto">
                        {quizSteps[currentStep - 1]?.options?.map((option, i) => {
                          const currentQuestion = quizSteps[currentStep - 1];
                          const field = currentQuestion.field as keyof FormData;
                          const isSelected = formData[field] === option.value;

                          return (
                            <label key={i} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={field}
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
                      <div className="mb-8">
                        <div
                          className={`grid gap-3 max-w-fit mx-auto grid-cols-2 ${
                            quizSteps[currentStep - 1]?.options?.length === 6 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                          }`}
                        >
                          {quizSteps[currentStep - 1]?.options?.map((option, i) => {
                            const currentQuestion = quizSteps[currentStep - 1];
                            const field = currentQuestion.field as keyof FormData;
                            
                            const isSelected = currentQuestion.type === 'multiple'
                              ? formData.features.includes(option.value)
                              : formData[field] === option.value;

                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  handleAnswerSelect(option.value);
                                  if (currentQuestion.type === 'single') setTimeout(nextStep, 300);
                                }}
                                className={`group w-44 p-3 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-400/30'
                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                                }`}
                              >
                                <div className="h-32 flex flex-col items-center justify-between">
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

                        {/* TOVÁBB button for extra services step */}
                        {quizSteps[currentStep - 1]?.field === 'features' && (
                          <div className="flex justify-center mt-6">
                            <button
                              onClick={nextStep}
                              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow hover:bg-blue-500"
                            >
                              TOVÁBB
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {currentStep > 1 && quizSteps[currentStep - 1]?.type !== 'contact' && (
                  <div className="flex justify-center mt-4">
                    <button 
                      onClick={() => setCurrentStep(currentStep - 1)} 
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow"
                    >
                      VISSZA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="container mx-auto px-6 py-20">
           
          </section> 
        )}
      </div>
      <NegativeConsequences />
      <ReviewsGallery />
    </div>
  );
}