import { X, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FreeShippingBanner = ({ onClose, compact = false }) => {
  const { totalPrice, totalItems, shippingSettings } = useCart();
  const freeShippingAmount = Math.min(Number(shippingSettings?.freeShippingAmount ?? 500), 650);
  const freeShippingThreshold = shippingSettings?.freeShippingThreshold ?? (compact ? 2 : 3);
  const usesQuantityRule = shippingSettings?.freeShippingType === 'quantity';

  if (compact) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-sm p-3 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-green-800" />
          <div>
            <p className="font-medium text-green-900">FREE Shipping!</p>
            <p className="text-sm text-green-700">
              {usesQuantityRule
                ? `On orders of ${freeShippingThreshold}+ items or above Rs ${freeShippingAmount}`
                : `On orders above Rs ${freeShippingAmount}`}
            </p>
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
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-green-900 mb-2">
              Free Shipping on {usesQuantityRule ? `${freeShippingThreshold}+ Items` : `Orders Above Rs ${freeShippingAmount}`}
            </h3>
            <p className="text-green-700 mb-3">
              {usesQuantityRule
                ? `Add ${Math.max(0, freeShippingThreshold - totalItems)} more ${freeShippingThreshold - totalItems === 1 ? 'item' : 'items'} or shop above Rs ${freeShippingAmount} to qualify`
                : `Add Rs ${Math.max(0, freeShippingAmount - totalPrice).toFixed(2)} more to qualify for free shipping`}
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600">
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
