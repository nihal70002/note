import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import axiosInstance from '../../api/axios';

const ShippingSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    standardShippingFee: 5,
    freeShippingThreshold: 3,
    freeShippingType: 'quantity', // 'quantity' or 'amount'
    freeShippingAmount: 500,
    enabled: true
  });

  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const fetchShippingSettings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/shipping-settings');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch shipping settings:', error);
      // Use defaults if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axiosInstance.post('/admin/shipping-settings', settings);
      showToast('success', 'Shipping settings saved successfully!');
    } catch (error) {
      console.error('Failed to save shipping settings:', error);
      showToast('error', 'Failed to save shipping settings.');
    } finally {
      setSaving(false);
    }
  };

  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-taupe">Loading shipping settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-paper rounded-lg shadow-sm border border-taupe/20 p-6">
        <h1 className="font-serif text-2xl text-ink mb-6">Shipping Settings</h1>
        
        <form onSubmit={handleSave} className="space-y-6">
          {/* Enable/Disable Shipping */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="shippingEnabled"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="w-4 h-4 text-ink border-taupe/30 rounded focus:ring-ink"
            />
            <label htmlFor="shippingEnabled" className="text-sm font-medium text-ink">
              Enable shipping charges
            </label>
          </div>

          {settings.enabled && (
            <>
              {/* Standard Shipping Fee */}
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">
                  Standard Shipping Fee
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-taupe">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.standardShippingFee}
                    onChange={(e) => setSettings({ ...settings, standardShippingFee: parseFloat(e.target.value) || 0 })}
                    className="w-32 px-3 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                  />
                </div>
                <p className="text-xs text-taupe mt-1">Amount charged for standard shipping</p>
              </div>

              {/* Free Shipping Type */}
              <div>
                <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">
                  Free Shipping Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="freeShippingType"
                      value="quantity"
                      checked={settings.freeShippingType === 'quantity'}
                      onChange={(e) => setSettings({ ...settings, freeShippingType: 'quantity' })}
                      className="w-4 h-4 text-ink border-taupe/30 focus:ring-ink"
                    />
                    <span className="text-sm text-ink">Based on quantity (number of items)</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="freeShippingType"
                      value="amount"
                      checked={settings.freeShippingType === 'amount'}
                      onChange={(e) => setSettings({ ...settings, freeShippingType: 'amount' })}
                      className="w-4 h-4 text-ink border-taupe/30 focus:ring-ink"
                    />
                    <span className="text-sm text-ink">Based on order amount</span>
                  </label>
                </div>
              </div>

              {/* Free Shipping Threshold */}
              {settings.freeShippingType === 'quantity' ? (
                <div>
                  <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">
                    Free Shipping Threshold (Items)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseInt(e.target.value) || 1 })}
                    className="w-32 px-3 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                  />
                  <p className="text-xs text-taupe mt-1">
                    Minimum number of items for free shipping (current: {settings.freeShippingThreshold}+ items)
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">
                    Free Shipping Threshold (Amount)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-taupe">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.freeShippingAmount}
                      onChange={(e) => setSettings({ ...settings, freeShippingAmount: parseFloat(e.target.value) || 0 })}
                      className="w-32 px-3 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                    />
                  </div>
                  <p className="text-xs text-taupe mt-1">
                    Minimum order amount for free shipping (current: {formatINR(settings.freeShippingAmount)}+)
                  </p>
                </div>
              )}
            </>
          )}

          {/* Preview Section */}
          <div className="bg-cream/30 border border-taupe/20 rounded-sm p-4">
            <h3 className="font-serif text-lg text-ink mb-3">Preview</h3>
            <div className="space-y-2 text-sm">
              <p className="text-ink/70">
                <span className="font-medium">Shipping Fee:</span> 
                {settings.enabled ? ` ${formatINR(settings.standardShippingFee)}` : ' Disabled'}
              </p>
              {settings.enabled && (
                <p className="text-ink/70">
                  <span className="font-medium">Free Shipping:</span> 
                  {settings.freeShippingType === 'quantity' 
                    ? ` ${settings.freeShippingThreshold}+ items`
                    : ` Orders ${formatINR(settings.freeShippingAmount)}+`
                  }
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={fetchShippingSettings}
              className="px-6 py-2 border border-taupe/30 rounded-sm text-sm uppercase tracking-wider hover:bg-cream/30 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-6 py-2 text-sm uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingSettings;
