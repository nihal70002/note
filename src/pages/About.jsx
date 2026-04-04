const About = () => {
  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
        <span className="text-sm font-bold uppercase tracking-widest text-taupe block">Our Story</span>
        <h1 className="font-serif text-5xl md:text-6xl text-ink">A Canvas for Your Mind</h1>
        <div className="h-[1px] w-24 bg-taupe/30 mx-auto mt-8"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
        <div className="aspect-[4/5] bg-cream/50 overflow-hidden rounded-sm">
          <img src="/hero.png" alt="Craftsmanship" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
        <div className="space-y-6">
          <h2 className="font-serif text-3xl text-ink">The Craftsmanship</h2>
          <p className="text-ink/80 leading-relaxed">
            Founded in a small artist's studio, Aesthetic Diaries was born from a simple belief: the tools we use to capture our thoughts should be as beautiful as the thoughts themselves. 
          </p>
          <p className="text-ink/80 leading-relaxed">
            In an increasingly digital world, the tactile experience of putting pen to paper remains unmatched. We meticulously source our materials—from thick, 120gsm acid-free paper to sustainable linen covers—to ensure every interaction feels premium.
          </p>
          <p className="text-ink/80 leading-relaxed">
            Our minimalist design approach strips away the unnecessary, leaving only a canvas. Whether you are sketching, planning, or journaling, our books are designed to get out of your way and let your true work shine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
