import type { TechStackSource } from "./TechStackSources";
import { techStackSources } from "./TechStackSources";

const baseConnor = {
  firstName: "Connor",
  lastName: "Kormos",
  age: 29,
  sex: "Male",
  roles: [
    "Web Developer",
    "Software Developer",
    "Software Engineer",
    "Full Stack Developer",
    "Front End Developer",
    "Back End Developer",
    "Front End Engineer",
    "Back End Engineer",
    "Full Stack Engineer",
  ],
  yearsExperience: 3,
  education: [
    { institution: "UCLA", degree: "B.A.", fieldOfStudy: "History" },
    {
      institution: "Flatiron School",
      degree: "Certificate",
      fieldOfStudy: "Software Engineering",
    },
  ],
  workHistory: [
    { company: "IOGEAR", role: "Software Engineer", years: 2 },
    { company: "Self Employed", role: "Freelance Web Developer", years: 1 },
  ],
  skills: Object.values(techStackSources).map((source: TechStackSource) => source.name),
  location: "Orange County, CA",
  phone: "(714)795-9351",
  email: "connorkormos@gmail.com",
  gitHub: "https://github.com/connorkormos",
  linkedIn: "https://www.linkedin.com/in/connorkormos/",
};

export const Connor = Object.assign(baseConnor, {
  name: baseConnor.firstName + " " + baseConnor.lastName,
  fullName: baseConnor.firstName + " " + baseConnor.lastName,
  gender: baseConnor.sex,
  role: baseConnor.roles[0],
  job: baseConnor.roles[0],
  jobs: baseConnor.roles,
  experience: baseConnor.yearsExperience,
  work: baseConnor.workHistory,
  workExperience: baseConnor.workHistory,
  school: baseConnor.education,
  schools: baseConnor.education,
  schooling: baseConnor.education,
});