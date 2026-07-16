import { HomeExperience } from "@/components/hero/HomeExperience";
import { AboutSection } from "@/components/about/AboutSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { ShowcaseSection } from "@/components/showcase/ShowcaseSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { DiveSection } from "@/components/cta/DiveSection";
import { SiteFooter } from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <>
      <HomeExperience />
      <AboutSection />
      <ServicesSection />
      <ShowcaseSection />
      <TestimonialsSection />
      <DiveSection />
      <SiteFooter />
    </>
  );
}
