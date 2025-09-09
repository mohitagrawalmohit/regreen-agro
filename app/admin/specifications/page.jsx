'use client';

import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SpecificationsOverview() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
        
      <h1 className="text-2xl font-semibold mb-4">Specifications Overview</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>View Specifications</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/admin/products/${product.id}/specifications`)}
                  className="flex items-center gap-2"
                >
                  <Eye size={16} /> View Specs
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
