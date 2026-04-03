import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { SupportSection } from "@/components/home/SupportSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <SocialProofSection />
      <SupportSection />
      <CtaSection />
    </>
  );
}
