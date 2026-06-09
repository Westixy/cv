export interface Language {
  name: string;
  level: string;
}

export interface Experience {
  id: string;
  period: string;
  title: string;
  company: string;
  date: string;
  bullets: string[];
}

export interface Training {
  id: string;
  period: string;
  title: string;
  school: string;
  bullets: string[];
}

export interface TechCategory {
  name: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  context: string;
  desc: string;
  detail: string;
  link: string;
}

export interface Reference {
  id: string;
  name: string;
  context: string;
  title: string;
  phone: string;
  email: string;
}

export interface CVData {
  experiences: Experience[];
  trainings: Training[];
  techCategories: TechCategory[];
  projects: Project[];
  references: Reference[];
  languages: Language[];
}