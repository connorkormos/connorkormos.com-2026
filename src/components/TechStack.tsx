import { techStackSources } from "../lib/TechStackSources";

import "./TechStack.css";
import TechStackItem from "./TechStackItem";

export default function TechStack() {
  
  const isMobile = window.innerWidth <= 768;

  let additionalTechOrder: string[] = ["nextJs", "jQuery", "bootstrap", "vite", "socketIo", "php", "sql", "mySql", "docker", "postman", "aws", "vercel", "railway", "git", "npm", "linux"]
  
  if (isMobile) {
    additionalTechOrder.splice(additionalTechOrder.indexOf('npm'), 1);
  }

  const additionalTech: typeof techStackSources[keyof typeof techStackSources][] = [];

  additionalTechOrder.forEach((techName) => {
    const tech = techStackSources[techName as keyof typeof techStackSources];
    if (tech) {
      additionalTech.push(tech);
    }
  });

  return (
    <div className="techStackContainer">
      <h1 className="titleSecondary">Additional Technologies</h1>
      <div className="techStackItemsWrapper">
        {additionalTech.map((tech) => (
          <TechStackItem key={tech.name} tech={tech} />
        ))}
      </div>
    </div>
  );
}
