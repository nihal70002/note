import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 max-w-2xl text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-20 h-20 text-green-600" />
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-4">
        Thank you for your order!
      </h1>
      <p className="text-ink/70 text-lg mb-8">
        Your payment was successful and your order <span className="font-medium text-ink">#{orderId}</span> has been securely placed. We will email you an order confirmation shortly.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to="/profile" 
          className="btn-primary w-full sm:w-auto px-8 py-4 uppercase tracking-widest text-sm"
        >
          View My Orders
        </Link>
        <Link 
          to="/shop" 
          className="btn-secondary w-full sm:w-auto px-8 py-4 uppercase tracking-widest text-sm border-taupe/30 hover:border-taupe"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
