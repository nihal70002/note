import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="container mx-auto px-6 md:px-12 py-12 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 drop-shadow-md">Summon Us</h1>
          <p className="text-ink/80 mb-12 max-w-md font-medium">
            Whether you seek an ancient tome, require help with a spell gone wrong, or just wish to whisper a secret, our owls are ready.
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-taupe mb-2 shadow-sm drop-shadow-sm">Owl Post</h3>
              <p className="text-ink font-serif text-lg">whispers@avonleadiaries.magic</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-taupe mb-2 drop-shadow-sm">The Tower</h3>
              <p className="text-ink font-serif text-lg">
                123 Enchanted Woods<br />
                The Artisan District<br />
                Realm of Avonlea
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-ink/10 p-8 md:p-12 shadow-[0_0_30px_rgba(255,244,210,0.05)] rounded-lg border border-taupe/20 backdrop-blur-sm"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-taupe font-bold">First Name</label>
                <input type="text" className="w-full border-b border-taupe/40 bg-transparent py-2 text-ink focus:outline-none focus:border-taupe transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-taupe font-bold">Last Name</label>
                <input type="text" className="w-full border-b border-taupe/40 bg-transparent py-2 text-ink focus:outline-none focus:border-taupe transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-taupe font-bold">Magic Sigil (Email)</label>
              <input type="email" className="w-full border-b border-taupe/40 bg-transparent py-2 text-ink focus:outline-none focus:border-taupe transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-taupe font-bold">Incantation (Message)</label>
              <textarea rows="4" className="w-full border-b border-taupe/40 bg-transparent py-2 text-ink focus:outline-none focus:border-taupe transition-colors resize-none"></textarea>
            </div>
            <button type="button" className="btn-primary w-full py-4 text-sm uppercase tracking-widest mt-4 bg-taupe text-paper hover:bg-white hover:text-taupe shadow-[0_0_15px_rgba(140,175,130,0.4)]">
              Send Scroll
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
