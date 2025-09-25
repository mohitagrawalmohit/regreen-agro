'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import ProtectedRoute from "@/components/ProtectedRoute";
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

// 🔄 added: category list
const categories = [
  "All",
  "Power Weeder & Tiller",
  "Earth Auger",
  "Pumps & Irrigation",
  "Sprayers & Crop Protection",
  "Harvesting Machinery",
  "Post Harvesting",
  "Lawn Mower & Gardening Tools",
  "Power Reaper",
  "Miscellaneous",
  "Power & Engines",
  "Accessories & Attachment"
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // 🔄 added
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

  // 🔄 changed: filter by both search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
    <ProtectedRoute>
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <h1 className="text-2xl font-semibold">All Products</h1>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-1/3"
            />

            {/* 🔄 added: Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <Button
              variant="green"
              onClick={() => router.push('/admin/products/add')}
              className="flex items-center gap-2"
            >
              <Plus size={16} /> New Product
            </Button>
          </div>
        </div>

        <Table>
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
                <TableCell className="max-w-[400px] truncate">{product.title}</TableCell>
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
    </ProtectedRoute>
  );
}
