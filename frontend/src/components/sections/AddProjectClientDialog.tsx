"use client";

import useBouncer from "@/hooks/useBouncer";
import useQuery from "@/hooks/useQuery";
import { getClients } from "@/services/api/user.api.service";
import { IResponse } from "@/types/response.type";
import { Client } from "@/types/user.type";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constant";
import { useState, useEffect } from "react";

interface AddProjectClientDialogProps {
  selectedClientId?: Client | null;
  onClose: (client?: Client) => void;
}

function AddProjectClientDialog({ selectedClientId, onClose }: AddProjectClientDialogProps) {
  const [value, setValue] = useState("");
  const [searchTerm] = useBouncer(value, 600);
  const [selected, setSelected] = useState<Client | null>(null);

  const params = {
    searchTerm,
    limit: 20,
    notIn: selectedClientId?._id ?? "",
  };

  const { data, isLoading, refetch } = useQuery<IResponse<Client[]>>("clients", () =>
    getClients(params),
  );

  const clients = data?.data ?? [];
  const meta = data?.meta;

  useEffect(() => {
    refetch();
  }, [searchTerm]);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Client</h2>

        {/* Search input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder="Search clients..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Loading */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        )}

        {/* No clients */}
        {!isLoading && meta?.totalResults === 0 && (
          <p className="text-center text-gray-400">No clients found.</p>
        )}

        {/* Clients List */}
        {!isLoading && (meta?.totalResults ?? 0) > 0 && (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {clients.map((client) => (
              <button
                key={client._id}
                onClick={() => setSelected(client)}
                className={`w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center gap-3 ${
                  selected?._id === client._id ? "bg-indigo-100 font-semibold" : ""
                }`}
              >
                <img
                  src={DEFAULT_PROFILE_PICTURE}
                  alt=""
                  className="size-10 rounded-full object-cover  outline-2 outline-offset-1 outline-secondary"
                />
                <div>
                  <span>{client.name}</span>
                  <br />
                  <span>{client.user?.email}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-end items-center gap-4 mt-4">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            disabled={!selected}
            onClick={() => onClose(selected!)}
            className="px-4 py-2 rounded-lg disabled:bg-gray-400 bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProjectClientDialog;
