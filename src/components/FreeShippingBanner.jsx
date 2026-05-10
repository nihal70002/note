import { X } from 'lucide-react';

const FreeShippingBanner = ({ onClose, compact = false }) => {
  if (compact) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-sm p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-green-600 hover:text-green-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-green-800">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 01-1.5-1.5h6a1.5 1.5 0 011.5 1.5v-6a1.5 1.5 0 00-3 0v6zM2.5 8a2.5 2.5 0 00-2.5 2.5H3a2.5 2.5 0 00-2.5-2.5V7a2.5 2.5 0 012.5-2.5h6A2.5 2.5 0 0110.5 7v.5a2.5 2.5 0 01-2.5 2.5z"/>
              <path d="M16 1.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z"/>
              <path d="M4.5 10.5a.75.75 0 01-.75.75v3a.75.75 0 001.5 0v-3z"/>
            </svg>
          </div>
          <div>
            <p className="font-medium text-green-900">🎉 FREE Shipping!</p>
            <p className="text-sm text-green-700">Add 3+ books to your cart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-800 p-3 rounded-full">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 01-1.5-1.5h6a1.5 1.5 0 011.5 1.5v-6a1.5 1.5 0 00-3 0v6zM2.5 8a2.5 2.5 0 00-2.5 2.5H3a2.5 2.5 0 00-2.5-2.5V7a2.5 2.5 0 012.5-2.5h6A2.5 2.5 0 0110.5 7v.5a2.5 2.5 0 01-2.5 2.5z"/>
              <path d="M16 1.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z"/>
              <path d="M4.5 10.5a.75.75 0 01-.75.75v3a.75.75 0 001.5 0v-3z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-serif text-green-900 mb-2">🚚 Free Shipping on 3+ Books!</h3>
            <p className="text-green-700 mb-3">Add just 2 more books to qualify for free shipping</p>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm-3.5-9a.5.5 0 00-.5.5v4a.5.5 0 001 0v-4a.5.5 0 00-.5-.5z" clipRule="evenodd"/>
                <path fillRule="evenodd" d="M5.5 7a.5.5 0 00-.5.5v4a.5.5 0 001 0v-4a.5.5 0 00-.5-.5z" clipRule="evenodd"/>
                <path d="M16 7.5a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6z"/>
                <path d="M4.5 13.5a.75.75 0 01-.75.75v3a.75.75 0 001.5 0v-3z"/>
              </svg>
              <span>Limited time offer</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FreeShippingBanner;
