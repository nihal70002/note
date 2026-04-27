const Contact = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink mb-6">Get in Touch</h1>
          <p className="text-ink/70 mb-12 max-w-md">
            Whether you have a question about our journals, need help with an order, or just want to share your journaling journey, we'd love to hear from you.
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-taupe mb-2">Email</h3>
              <p className="text-ink font-serif text-lg">hello@aestheticdiaries.com</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-taupe mb-2">Studio</h3>
              <p className="text-ink font-serif text-lg">
                123 Minimalist Way<br />
                The Design District<br />
                NY 10001
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cream/20 p-5 sm:p-8 md:p-12">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-taupe">First Name</label>
                <input type="text" className="w-full border-b border-taupe/30 bg-transparent py-2 text-ink focus:outline-none focus:border-ink transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-taupe">Last Name</label>
                <input type="text" className="w-full border-b border-taupe/30 bg-transparent py-2 text-ink focus:outline-none focus:border-ink transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-taupe">Email Address</label>
              <input type="email" className="w-full border-b border-taupe/30 bg-transparent py-2 text-ink focus:outline-none focus:border-ink transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-taupe">Message</label>
              <textarea rows="4" className="w-full border-b border-taupe/30 bg-transparent py-2 text-ink focus:outline-none focus:border-ink transition-colors resize-none"></textarea>
            </div>
            <button type="button" className="btn-primary w-full py-4 text-sm uppercase tracking-widest mt-4">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
