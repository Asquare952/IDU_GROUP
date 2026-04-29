"use client";

import { useState } from "react";
import { rentalApi } from "@/app/api/features/rental";

export default function TestUpload() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert("Please select at least one image");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await rentalApi.createRental({
        title: "Test House",
        description: "Testing image upload",
        propertyType: "apartment",
        location: "Lagos",
        price: 500000,
        priceType: "yearly",
        status: "available",
        images: Array.from(files),
      });

      console.log("Upload response:", response);
      setResult(response);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setResult({ error: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Image Upload</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Images:
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded-full
            hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload Test"}
        </button>
      </form>

      {result && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Response:</h2>
          <pre className="p-4 bg-gray-100 rounded-lg overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}