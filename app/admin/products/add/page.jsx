'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // optional if you want styled button

export default function AddProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    mrp: '',
    discountPercent: '',
    amountSaved: '',
    cc: '',
    specifications: 'Specification', // default value
    idealFor: '',
    rating: '4.9',
    features: 'features',
  });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files).slice(0, 5)); // max 5
  };

  // Auto-calculate price and amountSaved
  useEffect(() => {
    const { mrp, discountPercent } = product;

    if (mrp && discountPercent) {
      const price = (mrp - (mrp * discountPercent) / 100).toFixed(2);
      const amountSaved = (mrp - price).toFixed(2);

      setProduct((prev) => ({
        ...prev,
        price,
        amountSaved,
      }));
    }
  }, [product.mrp, product.discountPercent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // append text fields
    Object.keys(product).forEach((key) => {
      if (product[key] !== null) {
        formData.append(key, product[key]);
      }
    });

    // append media1..media5
    formData.append('media1', files[0] || '');
    formData.append('media2', files[1] || '');
    formData.append('media3', files[2] || '');
    formData.append('media4', files[3] || '');
    formData.append('media5', files[4] || '');

    try {
      const res = await fetch('https://regreen-agro.onrender.com/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save product');

      alert('✅ Product added successfully');
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Back button */}
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push('/admin/dashboard')}
      >
        ← Back to Dashboard
      </Button>
      
      <h2 className="text-2xl font-bold mb-6 text-green-700">➕ Add New Product</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-2xl">
        <input type="text" name="title" value={product.title} onChange={handleChange} placeholder="Product Title" required className="border p-3 rounded" />
        <input type="text" name="cc" value={product.cc} onChange={handleChange} placeholder="CC" required className="border p-3 rounded" />
        <textarea name="description" value={product.description} onChange={handleChange} placeholder="Product Description" rows={4} className="border p-3 rounded" />
        <select
  name="category"
  value={product.category}
  onChange={handleChange}
  className="border p-3 rounded"
  required
>
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
        <input
  type="hidden"
  name="specifications"
  value={product.specifications || 'Specification'}
/>
        <textarea name="idealFor" value={product.idealFor} onChange={handleChange} placeholder="Ideal For (e.g., small farms, tractors, etc.)" rows={2} className="border p-3 rounded" />
        <input
  type="hidden"
  name="features"
  value={product.rating || '4.9'}
/>
        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="mrp" value={product.mrp} onChange={handleChange} placeholder="MRP" className="border p-3 rounded" />
          <input type="number" name="discountPercent" value={product.discountPercent} onChange={handleChange} placeholder="Discount %" className="border p-3 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Final Price (auto)" className="border p-3 rounded bg-gray-100" readOnly />
          <input type="number" name="amountSaved" value={product.amountSaved} onChange={handleChange} placeholder="Amount Saved (auto)" className="border p-3 rounded bg-gray-100" readOnly />
        </div>

        <input
  type="hidden"
  name="features"
  value={product.features || 'features'}
/>
        {/* Media Uploads */}
        <label className="font-semibold">Upload Media (up to 5 Images/Videos)</label>
        <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="border p-3 rounded" />

        {/* Preview */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {files.map((file, idx) => (
              <div key={idx} className="border rounded p-2 text-sm text-center">
                {file.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(file)} alt={`media-${idx}`} className="h-20 w-full object-cover rounded" />
                ) : (
                  <video src={URL.createObjectURL(file)} className="h-20 w-full object-cover rounded" controls />
                )}
                <p className="truncate mt-1">{file.name}</p>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-4">
          Save Product
        </button>
      </form>
    </div>
  );
}
