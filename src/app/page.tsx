import { getProjects, getSite } from "@/lib/content";
import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Engineering } from "@/components/sections/engineering";
import { Timeline } from "@/components/sections/timeline";
import { Toolbox } from "@/components/sections/toolbox";
import { Philosophy } from "@/components/sections/philosophy";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  const site = getSite();
  const projects = getProjects();

  return (
    <>
      <Nav site={site} />
      <main id="main">
        <Hero
          site={site}
          projectSlugs={projects.map((p) => p.slug)}
        />
        <FeaturedWork projects={projects} />
        <Engineering site={site} projects={projects} />
        <Timeline site={site} />
        <Toolbox site={site} />
        <Philosophy site={site} />
        <Contact site={site} />
      </main>
      <Footer site={site} />
    </>
  );
}
