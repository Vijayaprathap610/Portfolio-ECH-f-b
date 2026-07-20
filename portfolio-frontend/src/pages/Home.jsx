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
import { recordVisit } from "../api/analyticsApi";

function Home() {
  const { data } = useFetch(getProfile);
  const profile = data?.data || null;

  // Record page visit
  useEffect(() => {
    recordVisit("home").catch(() => {});
  }, []);
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero profile={profile} />
        <About profile={profile} />
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
