import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash2 } from 'lucide-react';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;

  const fetchProducts = () => {
    fetch('http://localhost:5009/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5009/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">Products</h1>
        <Link to="/admin/products/add" className="btn-primary text-sm px-6 py-2 text-center">
          Add New Product
        </Link>
      </div>

      <div className="bg-paper rounded-sm shadow-sm border border-taupe/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="bg-cream/30 border-b border-taupe/20">
                <th className="py-4 px-6 font-medium text-sm uppercase tracking-wider text-ink">Image</th>
                <th className="py-4 px-6 font-medium text-sm uppercase tracking-wider text-ink">Name</th>
                <th className="py-4 px-6 font-medium text-sm uppercase tracking-wider text-ink">Category</th>
                <th className="py-4 px-6 font-medium text-sm uppercase tracking-wider text-ink">Stock</th>
                <th className="py-4 px-6 font-medium text-sm uppercase tracking-wider text-ink">Price</th>
                <th className="py-4 px-6 font-medium text-sm uppercase tracking-wider text-ink text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-taupe/10 hover:bg-cream/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-16 bg-cream/50 rounded-sm overflow-hidden">
                      <img src={product.image || "/product.png"} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-ink">{product.name}</td>
                  <td className="py-4 px-6 text-taupe">{product.category}</td>
                  <td className={`py-4 px-6 ${product.stock <= 5 ? 'text-red-600 font-medium' : 'text-taupe'}`}>{product.stock}</td>
                  <td className="py-4 px-6 text-taupe">{formatINR(product.price)}</td>
                  <td className="py-4 px-6 text-right space-x-4">
                    <Link to={`/admin/products/edit/${product.id}`} className="text-ink hover:text-ink/70 inline-block">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
