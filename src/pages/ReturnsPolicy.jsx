import SEO from '../components/SEO';

const ReturnsPolicy = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12 lg:py-20 pb-32 md:pb-20">
      <SEO
        title="Returns Policy - Papercues"
        description="Learn about our no-return policy for premium journals and notebooks. Contact us for any concerns."
        path="/returns-policy"
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-8 text-center">
          Returns Policy
        </h1>

        <div className="prose prose-lg mx-auto text-ink/80 space-y-6">
          <div className="bg-cream/30 border border-taupe/10 p-6 rounded-sm mb-8">
            <h2 className="font-serif text-xl text-ink mb-4">No Returns or Exchanges</h2>
            <p className="text-sm leading-relaxed">
              Due to the premium, handmade nature of our journals and notebooks, we do not accept
              returns or exchanges. Each piece is carefully crafted and personalized.
            </p>
          </div>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">What This Means</h2>
            <ul className="space-y-2">
              <li>We do not accept returns for any reason</li>
              <li>Exchange requests cannot be accommodated</li>
              <li>Refunds are not available for completed orders</li>
              <li>This policy applies to all products in our collection</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Damaged Products</h2>
            <p>
              While we take great care in packaging and shipping our products, if you receive
              a damaged item, please contact us immediately with photos of the damage.
              We will work with you to resolve genuine manufacturing defects.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Wrong Item Received</h2>
            <p>
              If you receive an incorrect item due to our error, please contact us within
              48 hours of delivery with order details and photos. We will arrange for
              the correct item to be sent to you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Quality Guarantee</h2>
            <p>
              We stand behind the quality of our materials and craftsmanship. If you have
              concerns about product quality, please reach out to us directly so we can
              assist you appropriately.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Before You Order</h2>
            <p>
              We encourage you to review product descriptions, specifications, and photos
              carefully before placing your order. Our detailed product information helps
              ensure you receive exactly what you expect.
            </p>
          </section>

          <div className="bg-paper border border-taupe/20 p-6 rounded-sm mt-8">
            <h3 className="font-serif text-lg text-ink mb-3">Have Questions?</h3>
            <p className="text-sm">
              We're here to help! Contact us at{' '}
              <a href="mailto:papercues@gmail.com" className="text-ink underline underline-offset-4">
                papercues@gmail.com
              </a>{' '}
              or visit our{' '}
              <a href="/contact" className="text-ink underline underline-offset-4">
                contact page
              </a>
              {' '}for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;