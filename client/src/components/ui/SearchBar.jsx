import React, { useEffect, useState } from "react";

export default function SearchBar({ initial = "", onSearch }) {
  const [text, setText] = useState(initial);

  useEffect(() => setText(initial), [initial]);

  // simple debounce without lodash
  useEffect(() => {
    const id = setTimeout(() => {
      onSearch(text?.trim() || "");
    }, 350);
    return () => clearTimeout(id);
  }, [text, onSearch]);

  return (
    <div className="mb-3">
      <input className="form-control" placeholder="Search products..." value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}

