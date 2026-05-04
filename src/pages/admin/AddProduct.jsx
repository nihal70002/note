import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';

const AddProduct = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '/product.png',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
    videoUrl: '',
    category: 'Journals',
    stock: 25,
    isNew: false,
    description: ''
  });
  const [uploadingField, setUploadingField] = useState('');

  useEffect(() => {
    if (isEdit) {
      axiosInstance.get(`/products/${id}`)
        .then(res => {
          setFormData({
            ...res.data,
            id: res.data.id // Ensure ID is preserved for PUT
          });
        })
        .catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (fieldName, file) => {
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const payload = new FormData();
      payload.append('file', file);
      payload.append('folder', 'note/products');

      const response = await axiosInstance.post('/uploads/cloudinary', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData((prev) => ({
        ...prev,
        [fieldName]: response.data.url
      }));
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please verify Cloudinary config and try again.');
    } finally {
      setUploadingField('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `/products/${id}` : '/products';

    try {
      if (isEdit) {
        await axiosInstance.put(url, {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10)
        });
      } else {
        await axiosInstance.post(url, {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10)
        });
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl sm:text-3xl text-ink mb-6 sm:mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <div className="bg-paper p-5 sm:p-8 rounded-sm shadow-sm border border-taupe/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Price (INR)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent">
                <option value="Journals">Journals</option>
                <option value="Planners">Planners</option>
                <option value="Pocket">Pocket</option>
                <option value="Creative">Creative</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Stock</label>
              <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} required className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Main Image</label>
              {formData.image && (
                <div className="mb-2 h-24 w-24 relative border border-taupe/30 rounded-sm overflow-hidden bg-cream/30">
                  <img src={formData.image} alt="Main Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input type="text" name="image" value={formData.image} onChange={handleChange} required className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload('image', e.target.files?.[0])} className="mt-2 w-full text-sm text-taupe" />
              {uploadingField === 'image' && <p className="mt-1 text-xs text-taupe">Uploading...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Image 2 (Optional)</label>
              {formData.image2 && (
                <div className="mb-2 h-24 w-24 relative border border-taupe/30 rounded-sm overflow-hidden bg-cream/30">
                  <img src={formData.image2} alt="Preview 2" className="w-full h-full object-cover" />
                </div>
              )}
              <input type="text" name="image2" value={formData.image2 || ''} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload('image2', e.target.files?.[0])} className="mt-2 w-full text-sm text-taupe" />
              {uploadingField === 'image2' && <p className="mt-1 text-xs text-taupe">Uploading...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Image 3 (Optional)</label>
              {formData.image3 && (
                <div className="mb-2 h-24 w-24 relative border border-taupe/30 rounded-sm overflow-hidden bg-cream/30">
                  <img src={formData.image3} alt="Preview 3" className="w-full h-full object-cover" />
                </div>
              )}
              <input type="text" name="image3" value={formData.image3 || ''} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload('image3', e.target.files?.[0])} className="mt-2 w-full text-sm text-taupe" />
              {uploadingField === 'image3' && <p className="mt-1 text-xs text-taupe">Uploading...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Image 4 (Optional)</label>
              {formData.image4 && (
                <div className="mb-2 h-24 w-24 relative border border-taupe/30 rounded-sm overflow-hidden bg-cream/30">
                  <img src={formData.image4} alt="Preview 4" className="w-full h-full object-cover" />
                </div>
              )}
              <input type="text" name="image4" value={formData.image4 || ''} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload('image4', e.target.files?.[0])} className="mt-2 w-full text-sm text-taupe" />
              {uploadingField === 'image4' && <p className="mt-1 text-xs text-taupe">Uploading...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Image 5 (Optional)</label>
              {formData.image5 && (
                <div className="mb-2 h-24 w-24 relative border border-taupe/30 rounded-sm overflow-hidden bg-cream/30">
                  <img src={formData.image5} alt="Preview 5" className="w-full h-full object-cover" />
                </div>
              )}
              <input type="text" name="image5" value={formData.image5 || ''} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload('image5', e.target.files?.[0])} className="mt-2 w-full text-sm text-taupe" />
              {uploadingField === 'image5' && <p className="mt-1 text-xs text-taupe">Uploading...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Product Video (Optional)</label>
              {formData.videoUrl && (
                <div className="mb-2 h-24 w-32 relative border border-taupe/30 rounded-sm overflow-hidden bg-cream/30">
                  <video src={formData.videoUrl} className="w-full h-full object-cover" controls muted />
                </div>
              )}
              <input type="text" name="videoUrl" value={formData.videoUrl || ''} onChange={handleChange} placeholder="Cloudinary video URL" className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
              <input type="file" accept="video/*" onChange={(e) => handleFileUpload('videoUrl', e.target.files?.[0])} className="mt-2 w-full text-sm text-taupe" />
              {uploadingField === 'videoUrl' && <p className="mt-1 text-xs text-taupe">Uploading video...</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isNew" name="isNew" checked={formData.isNew} onChange={handleChange} className="w-4 h-4 text-ink border-taupe/30 rounded focus:ring-ink" />
            <label htmlFor="isNew" className="text-sm font-medium text-ink uppercase tracking-wider">Mark as New Arrival</label>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button type="submit" className="btn-primary flex-1 py-3 text-sm tracking-widest">
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary flex-1 py-3 text-sm tracking-widest">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
