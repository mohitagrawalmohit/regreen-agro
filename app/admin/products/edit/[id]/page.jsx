'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [files, setFiles] = useState([null, null, null, null, null]);
  const [removeFlags, setRemoveFlags] = useState([false, false, false, false, false]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();

        // Ensure features array is joined for textarea/input usage
        if (Array.isArray(data.features)) {
          data.features = data.features.join(', ');
        }

        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('Failed to load product');
      }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (index, e) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);

    // If user selects a new file, cancel remove flag
    const newRemoveFlags = [...removeFlags];
    newRemoveFlags[index] = false;
    setRemoveFlags(newRemoveFlags);
  };

  const handleRemoveMedia = (index) => {
    const newFiles = [...files];
    newFiles[index] = null;
    setFiles(newFiles);

    const newRemoveFlags = [...removeFlags];
    newRemoveFlags[index] = true;
    setRemoveFlags(newRemoveFlags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append text fields
    Object.keys(product).forEach(key => {
      formData.append(key, product[key]);
    });

    // Append media files or removal flags
    for (let i = 0; i < 5; i++) {
      if (removeFlags[i]) formData.append(`removeMedia${i + 1}`, 'true');
      else if (files[i]) formData.append(`media${i + 1}`, files[i]);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update product');

      alert('✅ Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('❌ Failed to update product');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <Button variant="outline" className="mb-6" onClick={() => router.push('/admin/products')}>
        ← Back to Products
      </Button>

      <h2 className="text-2xl font-bold mb-6 text-green-700">✏️ Edit Product</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-2xl">
        <input type="text" name="title" value={product.title} onChange={handleChange} placeholder="Product Title" required className="border p-3 rounded" />
        <input type="text" name="cc" value={product.cc} onChange={handleChange} placeholder="CC" required className="border p-3 rounded" />
        <textarea name="description" value={product.description} onChange={handleChange} placeholder="Product Description" rows={4} className="border p-3 rounded" />
        <select name="category" value={product.category} onChange={handleChange} className="border p-3 rounded" required>
          <option value="">-- Select Category --</option>
          <option value="Power & Engines">Power & Engines</option>
          <option value="Lawn Mower & Gardening Tools">Lawn Mower & Gardening Tools</option>
          <option value="Post Harvesting">Post Harvesting</option>
          <option value="Harvesting Machinery">Harvesting Machinery</option>
          <option value="Sprayers & Crop Protection">Sprayers & Crop Protection</option>
          <option value="Pumps & Irrigation">Pumps & Irrigation</option>
          <option value="Earth Auger">Earth Auger</option>
          <option value="Power Weeder & Tiller">Power Weeder & Tiller</option>
        </select>
        <textarea name="idealFor" value={product.idealfor} onChange={handleChange} placeholder="Ideal For (e.g., small farms, tractors, etc.)" rows={2} className="border p-3 rounded" />
        <input type="hidden" name="features" value={product.features} onChange={handleChange} placeholder="Features (comma separated)" className="border p-3 rounded" />

        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="mrp" value={product.mrp} onChange={handleChange} placeholder="MRP" className="border p-3 rounded" />
          <input type="number" name="discountPercent" value={product.discountPercent} onChange={handleChange} placeholder="Discount %" className="border p-3 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="price" value={product.price} readOnly placeholder="Final Price (auto)" className="border p-3 rounded bg-gray-100" />
          <input type="number" name="amountSaved" value={product.amountSaved} readOnly placeholder="Amount Saved (auto)" className="border p-3 rounded bg-gray-100" />
        </div>

        <label className="font-semibold">Media (Images/Videos)</label>
        <div className="grid grid-cols-1 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              {product[`media${i + 1}`] && !removeFlags[i] && !files[i] && (
                <img src={`http://localhost:5000/${product[`media${i + 1}`]}`} alt={`media-${i}`} className="h-20 w-20 object-cover rounded" />
              )}
              {files[i] && (
                files[i].type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(files[i])} className="h-20 w-20 object-cover rounded" alt="new media" />
                ) : (
                  <video src={URL.createObjectURL(files[i])} className="h-20 w-20 object-cover rounded" controls />
                )
              )}
              <input type="file" accept="image/*,video/*" onChange={(e) => handleFileChange(i, e)} />
              {(product[`media${i + 1}`] || files[i]) && (
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveMedia(i)}>Remove</Button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
}
