import React from 'react';

const ReviewsGallery = () => {
  const reviewImages = [
    'review1.png',
    'review2.png',
    'review3.png',
    'review4.png',
    'review5.png',
    'review6.png',
    'review7.png',
    'review8.png',
    'review9.png',
    'review10.png'
  ];

  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
  Egy pár munkánk...
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {reviewImages.map((img, idx) => (
          <div key={idx} className="overflow-hidden rounded-xl shadow-lg bg-white">
            <img
              src={`/uploads/reviews/${img}`}
              alt={`Vásárlói vélemény ${idx + 1}`}
              className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsGallery;
