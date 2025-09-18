'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/products/`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // Utility to render media (image or video)
  const renderMedia = (mediaUrl, index) => {
    if (!mediaUrl) return null;
    const isVideo = mediaUrl.match(/\.(mp4|mov|webm)(\?.*)?$/i);
    if (isVideo) {
      return (
        <video
          key={index}
          src={mediaUrl}
          controls
          className="w-20 h-20 rounded object-cover"
        />
      );
    }
    return (
      <img
        key={index}
        src={mediaUrl}
        alt={`Media ${index + 1}`}
        className="w-20 h-20 rounded object-cover"
      />
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">All Products</h1>

        <div className="flex gap-2">
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <Button
            variant="green"
            onClick={() => router.push('/admin/products/add')}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> New Product
          </Button>
        </div>
      </div>

      <Table  className="min-w-[1000px]">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>MRP</TableHead>
            <TableHead>CC</TableHead>
            <TableHead>Media</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>₹{product.price}</TableCell>
              <TableCell>₹{product.mrp}</TableCell>
              <TableCell>{product.cc}</TableCell>

              {/* Show up to 5 media slots */}
              <TableCell className="flex gap-2 flex-wrap">
                {renderMedia(product.media1, 1)}
                {renderMedia(product.media2, 2)}
                {renderMedia(product.media3, 3)}
                {renderMedia(product.media4, 4)}
                {renderMedia(product.media5, 5)}
              </TableCell>

              <TableCell className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 size={16} />
                </Button>

                {/* Add Specification button */}
                <Button
                  variant="secondary"
                  onClick={() =>
                    router.push(`/admin/products/${product.id}/specifications`)
                  }
                >
                  + Specs
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
