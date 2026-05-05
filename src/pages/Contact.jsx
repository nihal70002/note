import { useState } from 'react';
import SEO from '../components/SEO';

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.target);
    
    // Web3Forms access key
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        setStatus('success');
        e.target.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12">
      <SEO
        title="Contact Papercues | Customer Support"
        description="Contact Papercues for journal orders, stationery questions, support, and collaborations."
        path="/contact"
        image="/logo.png"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink mb-6">Get in Touch</h1>
          <p className="text-ink/70 mb-12 max-w-md">
            Whether you have a question about our journals, need help with an order, or just want to share your journaling journey, we'd love to hear from you.
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-taupe mb-2">Phone & WhatsApp</h3>
              <p className="text-ink font-serif text-lg mb-2">+91 7591907000</p>
              <a 
                href="https://wa.me/917591907000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-taupe hover:text-ink transition-colors"
              >
                Message on WhatsApp &rarr;
              </a>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-taupe mb-2">Studio</h3>
              <p className="text-ink font-serif text-lg">
                Papercues Headquarters<br />
                Kerala, India
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cream/20 p-5 sm:p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="subject" value="New Contact Form Message from Papercues!" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-taupe">First Name</label>
                <input type="text" name="First Name" required className="w-full border-b border-taupe/30 bg-transparent py-2 text-ink focus:outline-none focus:border-ink transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-taupe">Last Name</label>
                <input type="text" name="Last Name" required className="w-full border-b border-taupe/30 bg-transparent py-2 text-ink focus:outline-none focus:border-ink transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-taupe">Email Address</label>
              <input type="email" name="Email" required className="w-full border-b border-taupe/30 bg-transparent py-2 text-ink focus:outline-none focus:border-ink transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-taupe">Message</label>
              <textarea name="Message" rows="4" required className="w-full border-b border-taupe/30 bg-transparent py-2 text-ink focus:outline-none focus:border-ink transition-colors resize-none"></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="btn-primary w-full py-4 text-sm uppercase tracking-widest mt-4 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            
            {status === 'success' && (
              <p className="text-green-700 text-sm mt-4 text-center">Thank you! Your message has been sent successfully.</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-sm mt-4 text-center">Oops! Something went wrong. Please check your Access Key in the Vercel variables.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
