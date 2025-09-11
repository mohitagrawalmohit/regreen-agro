'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';  
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SpecificationsPage() {
  const router = useRouter(); // ✅ define router inside component
  const { id: productId } = useParams();
  const [specs, setSpecs] = useState([]);
  const [newSpec, setNewSpec] = useState({ specName: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({ specName: '', description: '' });

  // Fetch all specs
  const fetchSpecs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/specifications/${productId}`);
      setSpecs(res.data);
    } catch (err) {
      console.error('Failed to fetch specs:', err);
      toast.error('Failed to load specifications.');
    }
  };

  useEffect(() => {
    if (productId) fetchSpecs();
  }, [productId]);

  // Add
  const handleAdd = async () => {
    if (!newSpec.specName.trim()) return;
    try {
      await axios.post(`${BASE_URL}api/specifications/${productId}`, {
        specName: newSpec.specName.trim(),
        description: newSpec.description?.trim() || null,
      });
      setNewSpec({ specName: '', description: '' });
      await fetchSpecs();
      toast.success('Specification added successfully!');
    } catch (err) {
      console.error('Failed to add spec:', err);
      toast.error('Failed to add specification.');
    }
  };

  // Update
  const handleSave = async (specId) => {
    try {
      await axios.put(`${BASE_URL}api/specifications/${productId}/${specId}`, {
        specName: editingValues.specName.trim(),
        description: editingValues.description?.trim() || null,
      });
      setEditingId(null);
      await fetchSpecs();
      toast.success('Specification updated successfully!');
    } catch (err) {
      console.error('Failed to update spec:', err);
      toast.error('Failed to update specification.');
    }
  };

  // Delete
  const handleDelete = async (specId) => {
    const confirm = window.confirm('Are you sure you want to delete this specification?');
    if (!confirm) return;
    try {
      await axios.delete(`${BASE_URL}api/specifications/${productId}/${specId}`);
      await fetchSpecs();
      toast.success('Specification deleted successfully!');
    } catch (err) {
      console.error('Failed to delete spec:', err);
      toast.error('Failed to delete specification.');
    }
  };

  return (
    <div className="p-4">
       
     {/* Back button */}
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push('/admin/dashboard')}
      >
        ← Back to Dashboard
      </Button>
      {/* Sonner toaster */}
      <Toaster richColors position="top-right" />

      <h1 className="text-xl font-semibold mb-4">Specifications for Product {productId}</h1>

      {/* Add new spec */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Specification Name"
          value={newSpec.specName}
          onChange={(e) => setNewSpec({ ...newSpec, specName: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={newSpec.description}
          onChange={(e) => setNewSpec({ ...newSpec, description: e.target.value })}
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>

      {/* Specs table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specs.map((spec) => (
            <TableRow key={spec.specId}>
              <TableCell>{spec.specId}</TableCell>
              <TableCell>
                {editingId === spec.specId ? (
                  <Input
                    value={editingValues.specName}
                    onChange={(e) =>
                      setEditingValues({ ...editingValues, specName: e.target.value })
                    }
                  />
                ) : (
                  spec.specName
                )}
              </TableCell>
              <TableCell>
                {editingId === spec.specId ? (
                  <Input
                    value={editingValues.description || ''}
                    onChange={(e) =>
                      setEditingValues({ ...editingValues, description: e.target.value })
                    }
                  />
                ) : (
                  spec.description
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                {editingId === spec.specId ? (
                  <>
                    <Button size="icon" onClick={() => handleSave(spec.specId)}>
                      <Save size={16} />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => setEditingId(null)}>
                      <X size={16} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setEditingId(spec.specId);
                        setEditingValues({
                          specName: spec.specName,
                          description: spec.description,
                        });
                      }}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(spec.specId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
