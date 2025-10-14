import React, { useState } from "react";
import {
  ArrowLeft,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

export const BudgetDetailsPage = () => {
  const { navigate } = useRouter();
  const { formData } = usePlanning();

  // Sample budget data - this would come from context/state in production
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    { id: "1", name: "Venue", allocated: 12000, spent: 12000, color: "bg-rose-500" },
    { id: "2", name: "Photo & Video", allocated: 5000, spent: 2500, color: "bg-blue-500" },
    { id: "3", name: "Catering", allocated: 8000, spent: 0, color: "bg-green-500" },
    { id: "4", name: "Music/DJ", allocated: 2000, spent: 0, color: "bg-purple-500" },
    { id: "5", name: "Decorations", allocated: 3000, spent: 0, color: "bg-pink-500" },
    { id: "6", name: "Attire", allocated: 4000, spent: 1200, color: "bg-indigo-500" },
    { id: "7", name: "Invitations", allocated: 800, spent: 800, color: "bg-yellow-500" },
    { id: "8", name: "Other", allocated: 1500, spent: 500, color: "bg-gray-500" },
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const budgetTotal = formData.budgetMax ? parseInt(formData.budgetMax) : 35000;
  const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = budgetTotal - totalAllocated;
  const unspent = totalAllocated - totalSpent;

  const getStatusColor = (allocated: number, spent: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-blue-600";
  };

  const deleteCategory = (id: string) => {
    setBudgetCategories(budgetCategories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button onClick={() => navigate("/my-wedding")} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-center flex-1 text-gray-900 pr-6">
          Budget Tracker
        </h1>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto pb-24">
        {/* Budget Summary Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <p className="text-sm font-medium mb-2 opacity-90">Total Budget</p>
          <p className="text-4xl font-bold mb-4">${budgetTotal.toLocaleString()}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs opacity-90 mb-1">Allocated</p>
              <p className="text-xl font-bold">${totalAllocated.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs opacity-90 mb-1">Spent</p>
              <p className="text-xl font-bold">${totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span>Budget Used</span>
              <span>{Math.round((totalAllocated / budgetTotal) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min((totalAllocated / budgetTotal) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Budget Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              <p className="text-xs font-semibold text-gray-600 uppercase">Remaining</p>
            </div>
            <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toLocaleString()}
            </p>
            {remaining < 0 && (
              <p className="text-xs text-red-600 mt-1">Over budget</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <p className="text-xs font-semibold text-gray-600 uppercase">Unspent</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ${unspent.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((unspent / totalAllocated) * 100)}% of allocated
            </p>
          </div>
        </div>

        {/* Budget Alert */}
        {remaining < 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">Budget Exceeded</p>
              <p className="text-sm text-red-800 mt-1">
                You've allocated ${Math.abs(remaining).toLocaleString()} more than your total budget. Consider adjusting your allocations.
              </p>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Budget Breakdown</h2>
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {budgetCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">
                        ${category.spent.toLocaleString()} of ${category.allocated.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(editingId === category.id ? null : category.id)}
                      className="p-1.5 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-1.5 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} rounded-full transition-all`}
                      style={{ width: `${Math.min((category.spent / category.allocated) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs font-medium ${getStatusColor(category.allocated, category.spent)}`}>
                      {Math.round((category.spent / category.allocated) * 100)}% spent
                    </span>
                    {category.spent >= category.allocated ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <span className="text-xs text-gray-500">
                        ${(category.allocated - category.spent).toLocaleString()} left
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                {editingId === category.id && (
                  <div className="pt-3 border-t border-gray-200 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">
                        Allocated Amount
                      </label>
                      <Input
                        type="number"
                        defaultValue={category.allocated}
                        className="w-full h-9 text-sm"
                        placeholder="Amount"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">
                        Spent Amount
                      </label>
                      <Input
                        type="number"
                        defaultValue={category.spent}
                        className="w-full h-9 text-sm"
                        placeholder="Amount"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm">
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 h-9 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                <p className="text-sm font-semibold text-gray-900">Add New Category</p>
                <Input
                  placeholder="Category name"
                  className="w-full h-10"
                />
                <Input
                  type="number"
                  placeholder="Allocated amount"
                  className="w-full h-10"
                />
                <div className="flex gap-2">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-10">
                    Add Category
                  </Button>
                  <Button
                    onClick={() => setShowAddCategory(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 h-10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
            <Calendar className="w-8 h-8 text-emerald-600 mb-2" />
            <p className="text-sm font-semibold text-gray-900">Payment Schedule</p>
          </button>
          <button className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
            <Download className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm font-semibold text-gray-900">Export Report</p>
          </button>
        </div>
      </main>
    </div>
  );
};
