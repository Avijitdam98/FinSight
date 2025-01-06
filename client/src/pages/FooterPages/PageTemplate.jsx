import React from 'react';

const PageTemplate = ({ title, content }) => {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          {title}
        </h1>
        <div className="prose prose-lg mx-auto">
          {content}
        </div>
      </div>
    </div>
  );
};

export default PageTemplate;
