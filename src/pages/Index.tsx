import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CtaBanner from "@/components/CtaBanner";
import Services from "@/components/Services";
import Products from "@/components/Products";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Elite Forums | Best IT Company in Vasai, Nallasopara, Virar & Mumbai | AI & Software Development</title>
        <meta
          name="description"
          content="Elite Forums - Leading IT company in Vasai, Nallasopara, Virar, Mumbai & Maharashtra. Expert AI automation, web development, app development, custom software solutions & professional IT training. 3500+ clients trained."
        />
        <meta
          name="keywords"
          content="IT company Vasai, IT company Nallasopara, IT company Virar, IT company Mumbai, IT company Maharashtra, software company Vasai, web development Vasai, app development Mumbai, AI company Virar, best IT company near me, IT services Mumbai, software development Maharashtra, Elite Forums, web development company, app development company, IT training Vasai, IT training Mumbai"
        />
        <link rel="canonical" href="https://eliteforums.in" />
      </Helmet>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <CtaBanner />
          <Services />
          <Products />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
