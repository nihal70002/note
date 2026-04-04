import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto text-center mb-20 space-y-6"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-taupe block drop-shadow-sm">The Legend</span>
        <h1 className="font-serif text-5xl md:text-6xl text-ink drop-shadow-md">A Canvas for Spells & Thoughts</h1>
        <div className="h-[1px] w-32 bg-taupe/50 mx-auto mt-8 shadow-[0_0_10px_#8caf82]"></div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="aspect-[4/5] bg-ink/50 overflow-hidden rounded-md border border-taupe/20 shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-taupe/10 mix-blend-multiply z-10" />
          <img src="/fantasy-butterfly.png" alt="Craftsmanship" className="w-full h-full object-cover" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="font-serif text-3xl text-ink drop-shadow-sm">Ancient Craftsmanship</h2>
          <p className="text-ink/80 leading-relaxed font-medium">
            Founded in a forgotten realm, Aesthetic Diaries was born from a simple belief: the tools we use to capture our magic should be as beautiful as the spells themselves. 
          </p>
          <p className="text-ink/80 leading-relaxed font-medium">
            In a digital world, the tactile experience of a quill on enchanted parchment remains unmatched. We meticulously source our materials—from twilight-infused 120gsm paper to our signature enchanted linen covers—to ensure every interaction feels otherworldly.
          </p>
          <p className="text-ink/80 leading-relaxed font-medium">
            Our minimalist design approach strips away the unnecessary, leaving only a pure, powerful canvas. Whether you are sketching a masterpiece, planning your alchemy, or journaling your dreams, our books let your absolute true magic shine.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
