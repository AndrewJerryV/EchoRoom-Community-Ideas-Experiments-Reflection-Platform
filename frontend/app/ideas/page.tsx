"use client";

import { PageLayout } from "../community/PageLayout";
import { useState } from "react";
import { useIdeas } from "../context/IdeasContext";
import { Plus, Search, Filter } from "lucide-react";

export default function IdeasPage() {
  const { ideas, addIdea } = useIdeas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || idea.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title || !newIdea.description) return;

    addIdea({
      title: newIdea.title,
      description: newIdea.description,
    });

    setNewIdea({ title: "", description: "" });
    setIsModalOpen(false);
  };

  return (
    <PageLayout>
      <div className="section">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Ideas in EchoRoom
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Ideas are the starting point of learning. Communities can share ideas,
              explore them through experiments, and reflect on outcomes.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Create Idea
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search ideas..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <select
                className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Implemented">Implemented</option>
                <option value="Discarded">Discarded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {/* Content */}
        {ideas.length === 0 ? (
          /* Empty State - No ideas at all */
          <div className="card text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              No ideas yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Ideas shared by the community will appear here. Be the first to
              create one.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              Create Idea
            </button>
          </div>
        ) : filteredIdeas.length === 0 ? (
          /* Empty State - No matches */
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              No matching ideas found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
              className="mt-4 text-blue-600 hover:underline dark:text-blue-400"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Ideas Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <div key={idea.id} className="card hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {idea.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {idea.description}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${idea.status === "New"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : idea.status === "In Progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                  >
                    {idea.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">New Idea</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">Title</label>
                  <input
                    type="text"
                    required
                    value={newIdea.title}
                    onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter idea title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={newIdea.description}
                    onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your idea..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Idea
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
