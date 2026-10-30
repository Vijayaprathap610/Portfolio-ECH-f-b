import { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import Navbar from "../components/common/Navbar";
import Hero from "../components/Sections/Hero";
import About from "../components/Sections/About";
import Skills from "../components/Sections/Skills";
import Projects from "../components/Sections/Projects";
import Experience from "../components/Sections/Experience";
import Certifications from "../components/Sections/Certifications";
import Testimonials from "../components/Sections/Testimonials";
import Contact from "../components/Sections/Contact";
import Footer from "../components/common/Footer";
import { getProfile } from "../api/profileApi";
import { getSkills } from "../api/skillsApi";
import { getProjects } from "../api/projectsApi";
import { getExperience } from "../api/experienceApi";
import { recordVisit } from "../api/analyticsApi";

function Home() {
  const { data: profileData, loading, error } = useFetch(getProfile);
  const { data: skillsData } = useFetch(getSkills);
  const { data: projectsData } = useFetch(getProjects);
  const { data: experienceData } = useFetch(getExperience);

  const profile = profileData?.data || null;
  const skillsCount = skillsData?.data?.skills?.length || 0;
  const projectsCount = projectsData?.meta?.total ?? projectsData?.data?.length ?? 0;
  const experienceCount = experienceData?.data?.length || 1;

  // Record visitor analytics silently on mount
  useEffect(() => {
    recordVisit("home").catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero
          profile={profile}
          projectsCount={projectsCount}
          skillsCount={skillsCount}
          experienceCount={experienceCount}
        />
        <About profile={profile} loading={loading} error={error} />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Testimonials />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}

export default Home;
