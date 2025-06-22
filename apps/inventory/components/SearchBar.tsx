'use client';

import React from 'react';
import { TouchInput } from '@itemseek2/ui-mobile';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="px-4 pb-3">
      <TouchInput
        type="search"
        placeholder="Search items, SKU, location..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<span className="text-gray-400">🔍</span>}
      />
    </div>
  );
}