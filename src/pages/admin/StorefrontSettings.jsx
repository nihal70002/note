import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { Save, Image as ImageIcon, Loader2 } from 'lucide-react';

const StorefrontSettings = () => {
  const [config, setConfig] = useState({
    heroImageUrl: '',
    heroTitle: '',
    heroSubtitle: '',
    heroLink: '',
    category1ImageUrl: '',
    category1Title: '',
    category1Link: '',
    category2ImageUrl: '',
    category2Title: '',
    category2Link: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null); // track which field is uploading
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/storefront');
      if (res.data) {
        setConfig(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch storefront config', err);
      setMessage({ text: 'Failed to load settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(fieldName);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'note/storefront');

    try {
      const res = await axiosInstance.post('/uploads/cloudinary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setConfig(prev => ({ ...prev, [fieldName]: res.data.url }));
      setMessage({ text: 'Image uploaded successfully!', type: 'success' });
    } catch (err) {
      console.error('Upload failed', err);
      setMessage({ text: 'Failed to upload image', type: 'error' });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await axiosInstance.put('/storefront', config);
      setMessage({ text: 'Storefront settings saved successfully!', type: 'success' });
    } catch (err) {
      console.error('Save failed', err);
      setMessage({ text: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-taupe" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Storefront Settings</h1>
        <p className="text-taupe mt-2">Manage the home page hero section and featured categories.</p>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* HERO SECTION */}
        <div className="bg-paper p-6 sm:p-8 rounded-sm shadow-sm border border-taupe/10">
          <h2 className="font-serif text-xl text-ink mb-6 pb-2 border-b border-taupe/10">Hero Section</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Hero Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-32 w-32 bg-cream/50 border border-taupe/20 rounded overflow-hidden flex items-center justify-center relative">
                    {config.heroImageUrl ? (
                      <img src={config.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-taupe/50 w-8 h-8" />
                    )}
                    {uploadingImage === 'heroImageUrl' && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="animate-spin text-ink" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="btn-secondary cursor-pointer block text-center px-4 py-2 text-sm">
                      Upload New
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImageUrl')} disabled={uploadingImage !== null} />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Title (e.g., The Art of Logging)</label>
                <input type="text" name="heroTitle" value={config.heroTitle || ''} onChange={handleChange} className="w-full bg-cream/30 border border-taupe/20 rounded-sm px-4 py-3 focus:outline-none focus:border-ink" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Subtitle (HTML allowed, e.g., Capture&lt;br/&gt;Every Moment)</label>
                <input type="text" name="heroSubtitle" value={config.heroSubtitle || ''} onChange={handleChange} className="w-full bg-cream/30 border border-taupe/20 rounded-sm px-4 py-3 focus:outline-none focus:border-ink" />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Button Link URL</label>
                <input type="text" name="heroLink" value={config.heroLink || ''} onChange={handleChange} className="w-full bg-cream/30 border border-taupe/20 rounded-sm px-4 py-3 focus:outline-none focus:border-ink" />
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED CATEGORY 1 */}
        <div className="bg-paper p-6 sm:p-8 rounded-sm shadow-sm border border-taupe/10">
          <h2 className="font-serif text-xl text-ink mb-6 pb-2 border-b border-taupe/10">Featured Category 1 (Left)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Category Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-32 bg-cream/50 border border-taupe/20 rounded overflow-hidden flex items-center justify-center relative">
                    {config.category1ImageUrl ? (
                      <img src={config.category1ImageUrl} alt="Category 1" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-taupe/50 w-8 h-8" />
                    )}
                    {uploadingImage === 'category1ImageUrl' && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="animate-spin text-ink" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="btn-secondary cursor-pointer block text-center px-4 py-2 text-sm">
                      Upload New
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'category1ImageUrl')} disabled={uploadingImage !== null} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Title</label>
                <input type="text" name="category1Title" value={config.category1Title || ''} onChange={handleChange} className="w-full bg-cream/30 border border-taupe/20 rounded-sm px-4 py-3 focus:outline-none focus:border-ink" />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Link URL</label>
                <input type="text" name="category1Link" value={config.category1Link || ''} onChange={handleChange} className="w-full bg-cream/30 border border-taupe/20 rounded-sm px-4 py-3 focus:outline-none focus:border-ink" />
              </div>
            </div>
          </div>
        </div>

        {/* FEATURED CATEGORY 2 */}
        <div className="bg-paper p-6 sm:p-8 rounded-sm shadow-sm border border-taupe/10">
          <h2 className="font-serif text-xl text-ink mb-6 pb-2 border-b border-taupe/10">Featured Category 2 (Right)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Category Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-32 bg-cream/50 border border-taupe/20 rounded overflow-hidden flex items-center justify-center relative">
                    {config.category2ImageUrl ? (
                      <img src={config.category2ImageUrl} alt="Category 2" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-taupe/50 w-8 h-8" />
                    )}
                    {uploadingImage === 'category2ImageUrl' && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="animate-spin text-ink" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="btn-secondary cursor-pointer block text-center px-4 py-2 text-sm">
                      Upload New
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'category2ImageUrl')} disabled={uploadingImage !== null} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Title</label>
                <input type="text" name="category2Title" value={config.category2Title || ''} onChange={handleChange} className="w-full bg-cream/30 border border-taupe/20 rounded-sm px-4 py-3 focus:outline-none focus:border-ink" />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest text-ink mb-2">Link URL</label>
                <input type="text" name="category2Link" value={config.category2Link || ''} onChange={handleChange} className="w-full bg-cream/30 border border-taupe/20 rounded-sm px-4 py-3 focus:outline-none focus:border-ink" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8 py-3 bg-ink text-paper hover:bg-ink/90">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StorefrontSettings;
