import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12">
      <SEO
        title="About Papercues | Our Story"
        description="Learn about Papercues, our stationery craftsmanship, and our passion for premium journals and notebooks."
        path="/about"
        image="/logo.png"
      />

      <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <span className="text-sm font-bold uppercase tracking-widest text-taupe block">Our Story</span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink leading-tight">Crafting Your Beautiful<br/>Paper Journey</h1>
        <div className="h-[1px] w-24 bg-taupe/30 mx-auto mt-8"></div>
      </div>

      {/* Section 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center mb-24 sm:mb-32">
        <div className="aspect-[4/5] bg-cream/50 overflow-hidden rounded-sm">
          <img src="https://res.cloudinary.com/diybhyxwi/image/upload/v1777885120/note/products/yzampb5as7ttgnoxab7z.png" alt="Papercues Journal" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
        </div>
        <div className="space-y-6">
          <h2 className="font-serif text-3xl text-ink">Welcome to Papercues</h2>
          <p className="text-ink/80 leading-relaxed text-lg">
            Papercues was born from a simple yet profound belief: the tools we use to capture our thoughts, dreams, and plans should be as vibrant and beautiful as the thoughts themselves. 
          </p>
          <p className="text-ink/80 leading-relaxed text-lg">
            In an increasingly fast-paced, digital world, the tactile experience of putting pen to paper remains unmatched. It grounds us. It gives us a moment to breathe, reflect, and create something uniquely ours.
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center mb-16 sm:mb-24">
        <div className="space-y-6 order-2 md:order-1">
          <h2 className="font-serif text-3xl text-ink">The Craftsmanship</h2>
          <p className="text-ink/80 leading-relaxed text-lg">
            We don't just sell notebooks; we curate companions for your daily life. We meticulously source our materials—from thick, luxurious acid-free paper to aesthetic, durable covers—to ensure every page turn feels like a premium experience.
          </p>
          <p className="text-ink/80 leading-relaxed text-lg">
            Whether you are bullet journaling, sketching, or noting down your wildest ideas, our design approach gets out of the way to let your true work shine. Your story starts here.
          </p>
        </div>
        <div className="aspect-[4/5] bg-cream/50 overflow-hidden rounded-sm order-1 md:order-2">
          <img src="https://res.cloudinary.com/diybhyxwi/image/upload/v1777885096/note/products/h19khprlqchicwvzw729.png" alt="Craftsmanship Details" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};

export default About;
