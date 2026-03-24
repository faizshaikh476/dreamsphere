"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { AddDreamModal } from "@/components/dreams/add-dream-modal";

export function AddDreamButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="button-primary hidden gap-2 sm:inline-flex" onClick={() => setOpen(true)}>
        <PlusIcon className="h-4 w-4" />
        Add
      </button>
      <button
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-slate-900 shadow-glow sm:hidden"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      <AddDreamModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
