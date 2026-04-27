import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    category: 'Journals',
    isNew: false,
    description: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:5009/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            ...data,
            id: data.id // Ensure ID is preserved for PUT
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `http://localhost:5009/api/products/${id}` : 'http://localhost:5009/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        navigate('/admin/products');
      } else {
        console.error('Failed to save product');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl text-ink mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <div className="bg-paper p-8 rounded-sm shadow-sm border border-taupe/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Price ($)</label>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Main Image</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} required className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Image 2 (Optional)</label>
              <input type="text" name="image2" value={formData.image2 || ''} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Image 3 (Optional)</label>
              <input type="text" name="image3" value={formData.image3 || ''} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Image 4 (Optional)</label>
              <input type="text" name="image4" value={formData.image4 || ''} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Image 5 (Optional)</label>
              <input type="text" name="image5" value={formData.image5 || ''} onChange={handleChange} className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent" />
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

          <div className="pt-4 flex gap-4">
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
