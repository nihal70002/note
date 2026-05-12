import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import axiosInstance from '../../api/axios';

const ShippingSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    standardShippingFee: 5,
    freeShippingAmount: 500,
    enabled: true
  });

  useEffect(() => {
    fetchShippingSettings();
  }, []);

  const fetchShippingSettings = async () => {
    setLoading(true);
    try {
      console.log('[Frontend] Fetching shipping settings...');
      const response = await axiosInstance.get('/admin/shipping-settings');
      console.log('[Frontend] Response:', response.data);
      
      if (response.data?.success && response.data?.data) {
        setSettings(response.data.data);
      } else if (response.data) {
        // Fallback for old response format
        setSettings(response.data);
      }
    } catch (error) {
      console.error('[Frontend] Failed to fetch shipping settings:', error);
      console.error('[Frontend] Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch shipping settings';
      showToast('error', errorMessage);
      
      // Use defaults if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      console.log('[Frontend] Saving shipping settings:', settings);
      const response = await axiosInstance.post('/admin/shipping-settings', settings);
      console.log('[Frontend] Save response:', response.data);
      
      if (response.data?.success) {
        showToast('success', response.data.message || 'Shipping settings saved successfully!');
        // Refresh settings to ensure we have the latest data
        await fetchShippingSettings();
      } else {
        showToast('error', response.data?.message || 'Failed to save shipping settings');
      }
    } catch (error) {
      console.error('[Frontend] Failed to save shipping settings:', error);
      console.error('[Frontend] Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to save shipping settings';
      
      showToast('error', errorMessage);
      
      // If it's a validation error, show the details
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors.join(', ');
        showToast('error', `Validation errors: ${validationErrors}`);
      }
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
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 0 : parseFloat(value) || 0;
                      setSettings({ ...settings, standardShippingFee: numValue });
                    }}
                    onBlur={(e) => {
                      // Remove leading zeros when focus leaves the input
                      const numValue = parseFloat(settings.standardShippingFee) || 0;
                      setSettings({ ...settings, standardShippingFee: numValue });
                    }}
                    className="w-32 px-3 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                  />
                </div>
                <p className="text-xs text-taupe mt-1">Amount charged for standard shipping</p>
              </div>

              {/* Free Shipping Threshold (Amount) */}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 0 : parseFloat(value) || 0;
                      setSettings({ ...settings, freeShippingAmount: numValue });
                    }}
                    onBlur={(e) => {
                      // Remove leading zeros when focus leaves the input
                      const numValue = parseFloat(settings.freeShippingAmount) || 0;
                      setSettings({ ...settings, freeShippingAmount: numValue });
                    }}
                    className="w-32 px-3 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                  />
                </div>
                <p className="text-xs text-taupe mt-1">
                  Minimum order amount for free shipping (current: {formatINR(settings.freeShippingAmount)}+)
                </p>
              </div>
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
                  Orders {formatINR(settings.freeShippingAmount)}+
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
