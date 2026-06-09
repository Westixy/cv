import type { Translations } from "../i18n";
import type { CVData, Experience, Training, TechCategory, Project, Reference, Language } from "../types/cv";

export function buildCvData(t: Translations): CVData {
  const experiences: Experience[] = [
    {
      id: "elca",
      period: t.experience.elca_period,
      title: t.experience.elca_title,
      company: t.experience.elca_company,
      date: t.experience.elca_date,
      bullets: t.experience.elca_bullets,
    },
    {
      id: "nexthink",
      period: t.experience.nexthink_period,
      title: t.experience.nexthink_title,
      company: t.experience.nexthink_company,
      date: t.experience.nexthink_date,
      bullets: t.experience.nexthink_bullets,
    },
    {
      id: "olympe",
      period: t.experience.olympe_period,
      title: t.experience.olympe_title,
      company: t.experience.olympe_company,
      date: t.experience.olympe_date,
      bullets: t.experience.olympe_bullets,
    },
    {
      id: "infomaniak",
      period: t.experience.infomaniak_period,
      title: t.experience.infomaniak_title,
      company: t.experience.infomaniak_company,
      date: t.experience.infomaniak_date,
      bullets: t.experience.infomaniak_bullets,
    },
    {
      id: "fivb",
      period: t.experience.fivb_period,
      title: t.experience.fivb_title,
      company: t.experience.fivb_company,
      date: t.experience.fivb_date,
      bullets: t.experience.fivb_bullets,
    },
  ];

  const trainings: Training[] = [
    {
      id: "technician",
      period: t.training.technician_period,
      title: t.training.technician_title,
      school: t.training.technician_school,
      bullets: t.training.technician_bullets,
    },
    {
      id: "cfc",
      period: t.training.cfc_period,
      title: t.training.cfc_title,
      school: t.training.cfc_school,
      bullets: t.training.cfc_bullets,
    },
  ];

  const techCategories: TechCategory[] = [
    {
      name: t.tech_categories.devops,
      items: t.tech.devops,
    },
    {
      name: t.tech_categories.devstack,
      items: t.tech.devstack,
    },
  ];

  const projects: Project[] = [
    {
      id: "gallyt",
      title: t.projects.gallyt_title,
      context: t.projects.gallyt_context,
      desc: t.projects.gallyt_desc,
      detail: t.projects.gallyt_detail,
      link: t.projects.gallyt_link,
    },
    {
      id: "westixy",
      title: t.projects.westixy_title,
      context: t.projects.westixy_context,
      desc: t.projects.westixy_desc,
      detail: t.projects.westixy_detail,
      link: t.projects.westixy_link,
    },
  ];

  const references: Reference[] = [
    {
      id: "ecs",
      name: t.references.ecs_name,
      context: t.references.ecs_context,
      title: t.references.ecs_title,
      phone: t.references.ecs_phone,
      email: t.references.ecs_email,
    },
    {
      id: "olympe",
      name: t.references.olympe_name,
      context: t.references.olympe_context,
      title: t.references.olympe_title,
      phone: t.references.olympe_phone,
      email: t.references.olympe_email,
    },
  ];

  const languages: Language[] = t.languages.map((l) => ({ name: l.name, level: l.level }));

  return {
    experiences,
    trainings,
    techCategories,
    projects,
    references,
    languages,
  };
}