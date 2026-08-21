import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PlansSection from "@/components/PlansSection";
import SchedulingSection from "@/components/SchedulingSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-brand-black w-full">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PlansSection />
      <SchedulingSection />
      <Footer />
    </main>
  );
}
