"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-white/30" />
        <input
          type="text"
          placeholder="Search tokens..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/[0.06] border-0 text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-apple"
        />
      </div>
    </form>
  );
}

