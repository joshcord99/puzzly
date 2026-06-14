'use client';

import { FormEvent, useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

interface AddUserModalProps {
  onAdd: (name: string) => void;
}

export default function AddUserModal({ onAdd }: AddUserModalProps) {
  const [name, setName] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd(name);
    setName('');
  };

  return (
    <form className="invite-form" onSubmit={submit}>
      <Input
        aria-label="Collaborator name"
        placeholder="Invite a collaborator"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button type="submit" size="sm">Add</Button>
    </form>
  );
}
