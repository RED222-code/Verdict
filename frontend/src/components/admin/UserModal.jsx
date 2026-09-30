import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export function UserModal({ isOpen, onClose, user = null }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || 'user');
    }
    setErrorMsg('');
  }, [user, isOpen]);

  const mutation = useMutation({
    mutationFn: (payload) => usersApi.updateUser(user._id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      showToast('User privileges updated.');
      onClose();
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to update user');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name is required');
      return;
    }
    mutation.mutate({ name: name.trim(), role });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Privileges"
      subtitle={`Managing profile for ${user?.email}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Email Address"
          disabled
          value={email}
          helperText="Email cannot be changed directly"
        />

        <Select
          label="System Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { label: 'Standard Reviewer (user)', value: 'user' },
            { label: 'System Administrator (admin)', value: 'admin' },
          ]}
        />

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={mutation.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
