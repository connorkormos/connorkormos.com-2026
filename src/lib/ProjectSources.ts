import resumeImage from "../assets/resumeBuilder/ResumeBuilderEditor.jpg";
import peakSyncImage from "../assets/peaksync/PeakSyncHomePage.png";
import iogearProductVideo from "../assets/iogear/iogear_product_pages.mp4";
import iogearCesVideo from "../assets/iogear/iogear_ces_2024.mp4";
import shadleImage from "../assets/shadle/ShadleGamePage.jpg";
import portfolioImage from "../assets/webPortfolio/WebPortfolio.jpg";

export type ProjectSource = {
   id: string;
   title: string;
   description: string;
   mediaType: "image" | "video";
   mediaSource: string;
   liveDemoUrl: string;
   githubUrl: string;
   techStack: string[];
};

export const ProjectsSources: ProjectSource[] = [
   {
      id: "resumeBuilder",
      title: "Resume Builder",
      description:
         "Notion style rich text editor, prioritizing customizability for building single page resumes.  Users can easily create, edit, save, and download their resumes.  This site is where my own personal resume was created!",
         mediaType: "image",
      mediaSource: resumeImage,
      liveDemoUrl: "https://free-resume-builder.up.railway.app/home",
      githubUrl: "https://github.com/connorkormos/Resume-Builder",
      techStack: ["React", "JavaScript", "HTML", "CSS", "Redux", "React Router", "Python", "Flask", "SQLAlchemy", "PostgreSQL", "Railway"],
   },
   {
      id: "peakSync",
      title: "PeakSync",
      description:
         "Inspired by my time working in the climbing industry, this application acts both as a climbing gym's main website, as well as a fully functional database management system.",
         mediaType: "image",
      mediaSource: peakSyncImage,
      liveDemoUrl: "https://peaksync.onrender.com/",
      githubUrl: "https://github.com/connorkormos/peaksync",
      techStack: ["React", "JavaScript", "HTML", "CSS", "Context API", "React Router", "Python", "Flask", "SQLAlchemy", "PostgreSQL", "Render", "AWS", "Railway"],
   },
   {
      id: "iogearProductPages",
      title: "IOGEAR Product Pages",
      description:
         "One example of the many product pages I worked on during my time at IOGEAR.  Built from the marketing team's markups, focusing on clean, modern, and responsive design.",
      mediaType: "video", 
      mediaSource: iogearProductVideo,
      liveDemoUrl: "https://support.iogear.com/product/ghdsw8k4",
      githubUrl: "N/A",
      techStack: ["JQuery", "JavaScript", "HTML", "CSS", 'BootStrap', "PHP", "MySQL"],
   },
   {
      id: "iogearCesLandingPage",
      title: "IOGEAR CES Landing Page",
      description:
         "IOGEAR's landing page for CES 2024, highlighting their latest products, event information, complete with RSVP functionality and automated emails for attendees.",
      mediaType: "video",
      mediaSource: iogearCesVideo,
      liveDemoUrl: "https://support.iogear.com/ces2024",
      githubUrl: "N/A",
      techStack: ["JQuery", "JavaScript", "HTML", "CSS", 'BootStrap', "PHP", "MySQL"],
   },
   {
      id: "shadle",
      title: "Shadle",
      description:
         "A mobile first, Wordle inspired RGB color guessing game, complete with stat tracking both individually and globally.",
      mediaType: "image",
      mediaSource: shadleImage,
      liveDemoUrl: "https://shadle.web.app",
      githubUrl: "https://github.com/connorkormos/shadle",
      techStack: ["React", "JavaScript", "HTML", "CSS", "Context API", "React Router", "Python", "Flask", "SQLAlchemy", "PostgreSQL", "Firebase", "Render", "AWS", "Railway"],
   },
   {
      id: "portfolio",
      title: "Portfolio Website",
      description:
         "This website you are on currently!  Built to showcase my projects, skills, and experience.  Enjoy!",
      mediaType: "image",
      mediaSource: portfolioImage,
      liveDemoUrl: "https://www.connorkormos.com",
      githubUrl: "https://github.com/connorkormos/connorkormos.com-2026",
      techStack: ["Next.js", "React", "TypeScript", "HTML", "CSS", "Context API", "React Router", "Vercel"],
   }
];
