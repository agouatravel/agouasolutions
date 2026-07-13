import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VideoSection from "./components/VideoSection";
import LogosSection from "./components/LogosSection";
import DeliverySection from "./components/DeliverySection";
import StudioTeamSection from "./components/StudioTeamSection";
import CaseStudiesSection from "./components/CaseStudiesSection";
import ServicesShowcaseSection from "./components/ServicesShowcaseSection";
import ProcessSection from "./components/ProcessSection";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <Hero />
        <VideoSection />
        <LogosSection />
        <DeliverySection />
        <StudioTeamSection />
        <CaseStudiesSection />
        <ServicesShowcaseSection />
        <ProcessSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
