import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../api/products';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export function ProductModal({
  isOpen,
  onClose,
  product = null,
}) {
  const isEditing = Boolean(product && product._id);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    coverImageName: '',
    otherImageNames: '',
    quantityAvailable: 10,
    availabilityStatus: 'available',
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price !== undefined ? product.price : '',
        category: product.category || '',
        description: product.description || '',
        coverImageName: product.coverImageName || '',
        otherImageNames: Array.isArray(product.otherImageNames) ? product.otherImageNames.join(', ') : '',
        quantityAvailable: product.quantityAvailable !== undefined ? product.quantityAvailable : 0,
        availabilityStatus: product.availabilityStatus || 'available',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: 'Audio',
        description: '',
        coverImageName: '',
        otherImageNames: '',
        quantityAvailable: 10,
        availabilityStatus: 'available',
      });
    }
    setValidationError('');
  }, [product, isOpen]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditing) {
        return productsApi.updateProduct(product._id, payload);
      }
      return productsApi.createProduct(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productStats'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
      if (isEditing && product?._id) {
        queryClient.invalidateQueries({ queryKey: ['product', product._id] });
      }

      showToast(isEditing ? 'Product updated successfully.' : 'Product created successfully.');
      onClose();
    },
    onError: (err) => {
      setValidationError(err.message || 'Operation failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setValidationError('Product name must be at least 3 characters.');
      return;
    }
    if (formData.price === '' || Number(formData.price) < 0) {
      setValidationError('Price must be a valid non-negative number.');
      return;
    }
    if (!formData.category.trim()) {
      setValidationError('Category is required.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setValidationError('Description must be at least 10 characters.');
      return;
    }

    const otherImages = formData.otherImageNames
      ? formData.otherImageNames
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    mutation.mutate({
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
      description: formData.description.trim(),
      coverImageName: formData.coverImageName.trim(),
      otherImageNames: otherImages,
      quantityAvailable: Number(formData.quantityAvailable),
      availabilityStatus: formData.availabilityStatus,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Hardware Entry' : 'Add New Hardware'}
      subtitle="Fill in the technical specifications and inventory status"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Product Name"
          required
          placeholder="e.g. Acoustic Labs Apex Pro"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Price ($ USD)"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="399"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />

          <Input
            label="Category"
            required
            placeholder="e.g. Audio, Displays, Computing"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <Textarea
          label="Description"
          required
          rows={3}
          placeholder="Technical overview, materials, acoustic properties, engineering details..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Input
          label="Cover Image URL"
          placeholder="https://images.unsplash.com/..."
          value={formData.coverImageName}
          onChange={(e) => setFormData({ ...formData, coverImageName: e.target.value })}
        />

        <Input
          label="Gallery Images (Comma-separated URLs)"
          placeholder="https://image1.jpg, https://image2.jpg"
          value={formData.otherImageNames}
          onChange={(e) => setFormData({ ...formData, otherImageNames: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Quantity Available"
            type="number"
            min="0"
            required
            value={formData.quantityAvailable}
            onChange={(e) => setFormData({ ...formData, quantityAvailable: e.target.value })}
          />

          <Select
            label="Availability Status"
            value={formData.availabilityStatus}
            onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
            options={[
              { label: 'Available (In Stock)', value: 'available' },
              { label: 'Out of Stock', value: 'out-of-stock' },
              { label: 'Discontinued', value: 'discontinued' },
            ]}
          />
        </div>

        {validationError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
            {validationError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
