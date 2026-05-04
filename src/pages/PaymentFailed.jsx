import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailed = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 max-w-2xl text-center">
      <div className="flex justify-center mb-6">
        <XCircle className="w-20 h-20 text-red-600" />
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-4">
        Payment Failed or Cancelled
      </h1>
      <p className="text-ink/70 text-lg mb-8">
        We were unable to process your payment. Don't worry, your order has been saved as <span className="font-medium text-ink">Pending</span> in your account. You can view your pending orders or contact support for help.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to="/profile" 
          className="btn-primary w-full sm:w-auto px-8 py-4 uppercase tracking-widest text-sm bg-ink text-paper"
        >
          View Pending Orders
        </Link>
        <Link 
          to="/contact" 
          className="btn-secondary w-full sm:w-auto px-8 py-4 uppercase tracking-widest text-sm border-taupe/30 hover:border-taupe"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;
