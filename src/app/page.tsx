import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import SchedulingSection from "@/components/SchedulingSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-brand-black w-full overflow-hidden">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <SchedulingSection />
      <Footer />
    </main>
  );
}
