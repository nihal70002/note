import SEO from '../components/SEO';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12 lg:py-20 pb-32 md:pb-20">
      <SEO
        title="Shipping Policy - Papercues"
        description="Learn about our shipping policies, prepaid orders, and delivery timelines for premium journals and notebooks."
        path="/shipping-policy"
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-8 text-center">
          Shipping Policy
        </h1>

        <div className="prose prose-lg mx-auto text-ink/80 space-y-6">
          <div className="bg-cream/30 border border-taupe/10 p-6 rounded-sm mb-8">
            <h2 className="font-serif text-xl text-ink mb-4">Important Notice</h2>
            <p className="text-sm leading-relaxed">
              Papercues accepts <strong>prepaid orders only</strong>. We do not offer Cash on Delivery (COD) service.
              All orders must be paid in full at the time of purchase.
            </p>
          </div>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Shipping Methods</h2>
            <p>
              We partner with reliable courier services to ensure your premium journals and notebooks reach you safely.
              Shipping charges are calculated based on your location and order weight.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Delivery Timelines</h2>
            <ul className="space-y-2">
              <li><strong>Metro Cities:</strong> 3-5 business days</li>
              <li><strong>Other Cities:</strong> 5-7 business days</li>
              <li><strong>Remote Areas:</strong> 7-10 business days</li>
            </ul>
            <p className="mt-4">
              Delivery timelines may vary during peak seasons or due to unforeseen circumstances.
              You will receive tracking information once your order ships.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Free Shipping</h2>
            <p>
              Enjoy free shipping on orders over ₹450. For orders below this amount,
              standard shipping charges apply based on your delivery location.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">Order Processing</h2>
            <p>
              Orders are typically processed within 1-2 business days. You will receive
              an email confirmation with tracking details once your order ships.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-4">International Shipping</h2>
            <p>
              Currently, we ship within India only. International orders are not available at this time.
            </p>
          </section>

          <div className="bg-paper border border-taupe/20 p-6 rounded-sm mt-8">
            <h3 className="font-serif text-lg text-ink mb-3">Need Help?</h3>
            <p className="text-sm">
              If you have questions about your order or shipping, please contact us at{' '}
              <a href="mailto:papercues@gmail.com" className="text-ink underline underline-offset-4">
                papercues@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;