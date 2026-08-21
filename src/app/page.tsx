import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

const AboutSection = dynamic(() => import("@/components/AboutSection"), { loading: () => null });
const ServicesSection = dynamic(() => import("@/components/ServicesSection"), { loading: () => null });
const PlansSection = dynamic(() => import("@/components/PlansSection"), { loading: () => null });
const SchedulingSection = dynamic(() => import("@/components/SchedulingSection"), { loading: () => null });

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
