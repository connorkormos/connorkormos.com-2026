import { useState } from "react";

import "./TechStack.css";

export default function TechStackItem({ tech }: { tech: any }) {
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="techStackItem"
      key={tech.name}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img className="techStackItemImage" src={tech.src} alt={tech.name} />
      {isHovered && (
        <div className="techStackInfoHoverElement">
          <p className="techStackName">{tech.name}</p>
          <p className="techStackExperience">
            {tech.yearsExperience} Years Experience
          </p>
        </div>
      )}
      {/* <p>{tech.name}</p> */}
    </div>
  );
}
