import React from 'react';

const CodornaDashboardPreview = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="cosmic-glow relative rounded-xl overflow-hidden border border-gray-200 backdrop-blur-sm bg-white shadow-[0_0_15px_rgba(0,0,0,0.15)]">
        <div className="w-full">
          <img 
            src="/dashboardPreview.png" 
            alt="Preview do Dashboard Codorna" 
            className="w-full h-auto rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default CodornaDashboardPreview;
