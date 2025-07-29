import React from 'react';

const Hero = () => {
  return (
    <section className="text-center pt-32 text-gray-900 font-inter">
      <h1 className="text-4xl md:text-6xl font-semibold text-gray-800 max-w-5xl mx-auto leading-tight">
        <span className="block">🏡 Új házat szeretne?</span>
        <span className="block">Most azonnal el tudjuk kezdeni, de csak az első 2 jelentkezőnek.</span>
      </h1>
      <p className="mt-6 text-sm md:text-lg font-light text-gray-700 max-w-2xl mx-auto leading-relaxed">
        Ez nem marketing duma, bővült a csapat, de csak 2 házra van kapacitás. Töltse ki a lenti űrlapot és még ma egyeztetünk!
      </p>
    </section>
  );
};

export default Hero;
