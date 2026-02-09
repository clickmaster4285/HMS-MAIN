import React from "react";
import Img1 from "../../assets/hospital-logos/uae-hospital-1.png";
import Img2 from "../../assets/hospital-logos/uae-hospital-4.png";
import Img3 from "../../assets/hospital-logos/uae-hospital-3.png"; 
import Img4 from "../../assets/hospital-logos/usa-hospital-1.png";
import Img5 from "../../assets/hospital-logos/usa-hospital-4.png";
import Img6 from "../../assets/hospital-logos/usa-hospital-3.png";

const ClientsSection = () => {
  const hospitalLogos = [
    { id: 1, image: Img1, alt: "DEPARTMENT OF HEALTH", name: "DEPARTMENT OF HEALTH" },
    { id: 2, image: Img2, alt: "Ahalia Hospitals", name: "Ahalia Hospitals" },
    { id: 3, image: Img3, alt: "Burjeel hospital", name: "Burjeel hospital" },
    { id: 4, image: Img4, alt: "ST. John The Baptiste", name: "ST. John The Baptiste" },
    { id: 5, image: Img5, alt: "American Hospital", name: "American Hospital" },
    { id: 6, image: Img6, alt: "Apollo Hospitals", name: "Apollo Hospitals" }
  ];

  return (
    <section className="py-20 bg-linear-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-4">
          Trusted by Leading Healthcare Institutions
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our solutions are implemented in top medical centers worldwide, helping to improve patient outcomes and streamline operations.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {hospitalLogos.map((hospital) => (
            <div 
              key={hospital.id} 
              className="group relative flex justify-center items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-full aspect-square"> {/* Maintain 1:1 aspect ratio */}
                {/* Inner shadow container */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.08)]"></div>
                {/* Logo image container with padding and flex centering */}
                <div className="absolute inset-0 flex items-center justify-center p-4 rounded-full overflow-hidden">
                  <img 
                    src={hospital.image} 
                    alt={hospital.alt}
                    className="max-h-full max-w-full object-contain" 
                    loading="lazy"
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                </div>
              </div>
              {/* Tooltip */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
                {hospital.name}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;