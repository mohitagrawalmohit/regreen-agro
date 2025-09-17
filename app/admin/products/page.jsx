'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [newFiles, setNewFiles] = useState({});
  const [removeFlags, setRemoveFlags] = useState({});

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${id}`
        );
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 🔧 Auto-calc price and amountSaved when mrp or discount changes
  useEffect(() => {
    if (!product) return;
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
  }, [product?.mrp, product?.discountPercent]);

  const handleFileChange = (e, mediaKey) => {
    const file = e.target.files[0];
    setNewFiles((prev) => ({ ...prev, [mediaKey]: file || null }));
    setRemoveFlags((prev) => ({ ...prev, [mediaKey]: false }));
  };

  const toggleRemove = (mediaKey) => {
    setRemoveFlags((prev) => ({ ...prev, [mediaKey]: !prev[mediaKey] }));
    setNewFiles((prev) => ({ ...prev, [mediaKey]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (product[key] !== null && product[key] !== undefined) {
        formData.append(key, product[key]);
      }
    });

    for (let i = 1; i <= 5; i++) {
      const key = `media${i}`;
      if (newFiles[key]) {
        formData.append(key, newFiles[key]);
      }
      if (removeFlags[key]) {
        formData.append(`removeMedia${i}`, 'true');
      }
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!res.ok) throw new Error('Failed to update product');

      alert('✅ Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update product');
    }
  };

  if (!product) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-white p-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push('/admin/products')}
      >
        ← Back to Products
      </Button>

      <h2 className="text-2xl font-bold mb-6 text-green-700">✏️ Edit Product</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-2xl">
        <input
          type="text"
          name="title"
          value={product.title || ''}
          onChange={handleChange}
          placeholder="Product Title"
          required
          className="border p-3 rounded"
        />
        <input
          type="text"
          name="cc"
          value={product.cc || ''}
          onChange={handleChange}
          placeholder="CC"
          className="border p-3 rounded"
        />
        <textarea
          name="description"
          value={product.description || ''}
          onChange={handleChange}
          placeholder="Product Description"
          rows={4}
          className="border p-3 rounded"
        />

        {/* Pricing Section */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="mrp"
            value={product.mrp || ''}
            onChange={handleChange}
            placeholder="MRP"
            className="border p-3 rounded"
          />
          <input
            type="number"
            name="discountPercent"
            value={product.discountPercent || ''}
            onChange={handleChange}
            placeholder="Discount %"
            className="border p-3 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            value={product.price || ''}
            placeholder="Final Price (auto)"
            className="border p-3 rounded bg-gray-100"
            readOnly
          />
          <input
            type="number"
            name="amountSaved"
            value={product.amountSaved || ''}
            placeholder="Amount Saved (auto)"
            className="border p-3 rounded bg-gray-100"
            readOnly
          />
        </div>

        {/* Media Section */}
        <h3 className="font-semibold mt-4">Media</h3>
        {[1, 2, 3, 4, 5].map((i) => {
          const key = `media${i}`;
          const currentUrl = product[key];
          const newFile = newFiles[key];
          const remove = removeFlags[key];

          return (
            <div key={i} className="flex items-center gap-4 border p-2 rounded">
              {currentUrl && !remove && !newFile && (
                currentUrl.endsWith('.mp4') ||
                currentUrl.endsWith('.mov') ||
                currentUrl.endsWith('.webm') ? (
                  <video
                    src={currentUrl}
                    className="w-20 h-20 object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={currentUrl}
                    alt={`Media ${i}`}
                    className="w-20 h-20 object-cover"
                  />
                )
              )}

              {newFile && (
                newFile.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(newFile)}
                    alt={`New Media ${i}`}
                    className="w-20 h-20 object-cover border"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(newFile)}
                    className="w-20 h-20 object-cover border"
                    controls
                  />
                )
              )}

              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(e, key)}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remove || false}
                  onChange={() => toggleRemove(key)}
                />
                Remove
              </label>
            </div>
          );
        })}

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
