import React, { useState, useEffect } from "react";
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
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { useSupabase } from "~/lib/supabase.client";
import { getWeddingByUserId } from "~/lib/wedding";
import type { Database } from "~/types/database.types";

type Wedding = Database["public"]["Tables"]["weddings"]["Row"];

interface BudgetCategory {
  id: string;
  category: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  venue: "bg-rose-500",
  photo_video: "bg-blue-500",
  music_dj: "bg-purple-500",
  sweets: "bg-pink-500",
  decorations: "bg-green-500",
  invitations: "bg-yellow-500",
  catering: "bg-orange-500",
  attire: "bg-indigo-500",
  other: "bg-gray-500",
};

const CATEGORY_LABELS: Record<string, string> = {
  venue: "Venue",
  photo_video: "Photo & Video",
  music_dj: "Music/DJ",
  sweets: "Sweets",
  decorations: "Decorations",
  invitations: "Invitations",
  catering: "Catering",
  attire: "Attire",
  other: "Other",
};

// Helper function to get category label (handles custom categories)
const getCategoryDisplayLabel = (category: string): string => {
  // If it's in the predefined list, return the label
  if (CATEGORY_LABELS[category]) {
    return CATEGORY_LABELS[category];
  }
  
  // Otherwise, format the custom category name (snake_case to Title Case)
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const BudgetDetailsPage = () => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const supabase = useSupabase();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{ allocated: number } | null>(null);
  const [newCategory, setNewCategory] = useState({ category: "other", allocated: "", useCustom: false, customCategory: "" });
  const [addingExpenseForCategory, setAddingExpenseForCategory] = useState<string | null>(null);
  const [expenseFormData, setExpenseFormData] = useState({
    name: "",
    amount: "",
    description: "",
    expense_date: "",
  });

  // Fetch all data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch wedding
        const { data: weddingData } = await getWeddingByUserId(supabase, user.id);
        if (weddingData) {
          setWedding(weddingData);
        }

        // Fetch bookings, expenses, and allocations in parallel
        const [bookingsRes, expensesRes, allocationsRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/budget-expenses"),
          fetch("/api/budget-allocations"),
        ]);

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.bookings || []);
        }

        if (expensesRes.ok) {
          const expensesData = await expensesRes.json();
          setExpenses(expensesData.expenses || []);
        }

        if (allocationsRes.ok) {
          const allocationsData = await allocationsRes.json();
          setAllocations(allocationsData.allocations || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, supabase]);

  // Calculate budget categories from allocations, bookings, and expenses
  useEffect(() => {
    if (!allocations.length && !bookings.length && !expenses.length) {
      setBudgetCategories([]);
      return;
    }

    // Create a map of all categories with their spent amounts
    const spentMap: Record<string, number> = {};
    const allocationMap: Record<string, { id: string; allocated: number }> = {};

    // Map allocations
    allocations.forEach((alloc) => {
      allocationMap[alloc.category] = {
        id: alloc.id,
        allocated: parseFloat(String(alloc.allocated_amount || 0)),
      };
    });

    // Calculate spent from bookings
    bookings.forEach((booking) => {
      if (booking.status === "confirmed" || booking.status === "pending") {
        const category = normalizeCategory(booking.vendorCategory);
        const price = parseFloat(String(booking.totalPrice || 0));
        if (!isNaN(price)) {
          spentMap[category] = (spentMap[category] || 0) + price;
        }
      }
    });

    // Calculate spent from expenses
    expenses.forEach((expense) => {
      const category = expense.category || "other";
      const amount = parseFloat(String(expense.amount || 0));
      if (!isNaN(amount)) {
        spentMap[category] = (spentMap[category] || 0) + amount;
      }
    });

    // Combine allocations and spent amounts
    const categories: BudgetCategory[] = [];
    
    // Add categories from allocations
    Object.entries(allocationMap).forEach(([category, alloc]) => {
        categories.push({
          id: alloc.id,
          category,
          name: getCategoryDisplayLabel(category),
          allocated: alloc.allocated,
          spent: spentMap[category] || 0,
          color: CATEGORY_COLORS[category] || CATEGORY_COLORS.other,
        });
    });

    // Add categories that have spending but no allocation
    Object.entries(spentMap).forEach(([category, spent]) => {
      if (!allocationMap[category] && spent > 0) {
        categories.push({
          id: `spent-${category}`,
          category,
          name: getCategoryDisplayLabel(category),
          allocated: 0,
          spent,
          color: CATEGORY_COLORS[category] || CATEGORY_COLORS.other,
        });
      }
    });

    setBudgetCategories(categories.sort((a, b) => b.spent - a.spent));
  }, [allocations, bookings, expenses]);

  const normalizeCategory = (category: string | undefined): string => {
    if (!category) return "other";
    const normalized = category.toLowerCase().replace(/\s+/g, "_").replace(/[&/]/g, "_");
    if (normalized === "photo_&_video" || normalized === "photo&video") return "photo_video";
    if (normalized === "music/dj" || normalized === "music_/dj") return "music_dj";
    return normalized;
  };

  const budgetTotal = wedding?.budget_max
    ? parseFloat(String(wedding.budget_max))
    : 35000;
  const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = budgetTotal - totalAllocated;
  const unspent = totalAllocated - totalSpent;

  const getStatusColor = (allocated: number, spent: number) => {
    if (allocated === 0) return "text-gray-600";
    const percentage = (spent / allocated) * 100;
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-blue-600";
  };

  const handleSaveAllocation = async (categoryId: string, allocated: number) => {
    try {
      const category = budgetCategories.find((c) => c.id === categoryId);
      if (!category) return;

      const isNew = categoryId.startsWith("spent-");
      const method = isNew ? "POST" : "PUT";
      const body = isNew
        ? {
            category: category.category,
            allocated_amount: allocated,
          }
        : {
            id: categoryId,
            allocated_amount: allocated,
          };

      const response = await fetch("/api/budget-allocations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save allocation");
      }

      // Refresh allocations
      const allocationsRes = await fetch("/api/budget-allocations");
      if (allocationsRes.ok) {
        const allocationsData = await allocationsRes.json();
        setAllocations(allocationsData.allocations || []);
      }

      setEditingId(null);
      setEditingData(null);
    } catch (error) {
      console.error("Error saving allocation:", error);
      alert("Failed to save allocation. Please try again.");
    }
  };

  const handleDeleteAllocation = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this allocation?")) {
      return;
    }

    try {
      const response = await fetch(`/api/budget-allocations?id=${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete allocation");
      }

      // Refresh allocations
      const allocationsRes = await fetch("/api/budget-allocations");
      if (allocationsRes.ok) {
        const allocationsData = await allocationsRes.json();
        setAllocations(allocationsData.allocations || []);
      }
    } catch (error) {
      console.error("Error deleting allocation:", error);
      alert("Failed to delete allocation. Please try again.");
    }
  };

  const handleAddExpense = async (category: string) => {
    if (!expenseFormData.name || !expenseFormData.amount) {
      alert("Please fill in expense name and amount");
      return;
    }

    try {
      const response = await fetch("/api/budget-expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: expenseFormData.name,
          category: category,
          amount: parseFloat(expenseFormData.amount),
          description: expenseFormData.description || null,
          expense_date: expenseFormData.expense_date || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      // Refresh expenses
      const expensesRes = await fetch("/api/budget-expenses");
      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        setExpenses(expensesData.expenses || []);
      }

      // Reset form
      setAddingExpenseForCategory(null);
      setExpenseFormData({
        name: "",
        amount: "",
        description: "",
        expense_date: "",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  const exportBudget = () => {
    // Create comprehensive budget report
    const reportDate = new Date().toISOString().split("T")[0];
    const weddingDate = wedding?.wedding_date || "N/A";
    const partnerNames = wedding 
      ? `${wedding.partner1_name} & ${wedding.partner2_name}`
      : "N/A";

    // Build CSV content
    const csvRows: string[] = [];

    // Header Section
    csvRows.push("WEDDING BUDGET REPORT");
    csvRows.push(`Generated: ${new Date().toLocaleString()}`);
    csvRows.push(`Wedding Date: ${weddingDate}`);
    csvRows.push(`Couple: ${partnerNames}`);
    csvRows.push("");

    // Summary Section
    csvRows.push("BUDGET SUMMARY");
    csvRows.push(`Total Budget,$${budgetTotal.toLocaleString()}`);
    csvRows.push(`Total Allocated,$${totalAllocated.toLocaleString()}`);
    csvRows.push(`Total Spent,$${totalSpent.toLocaleString()}`);
    csvRows.push(`Remaining,$${remaining.toLocaleString()}`);
    csvRows.push(`Unspent Allocation,$${unspent.toLocaleString()}`);
    csvRows.push(`Budget Used,${budgetTotal > 0 ? Math.round((totalSpent / budgetTotal) * 100) : 0}%`);
    csvRows.push("");

    // Category Breakdown
    csvRows.push("CATEGORY BREAKDOWN");
    csvRows.push("Category,Allocated,Spent,Remaining,Percentage Spent");
    budgetCategories.forEach((category) => {
      const remaining = category.allocated - category.spent;
      const percentage = category.allocated > 0 
        ? Math.round((category.spent / category.allocated) * 100)
        : 0;
      csvRows.push(
        `"${category.name}",$${category.allocated.toLocaleString()},$${category.spent.toLocaleString()},$${remaining.toLocaleString()},${percentage}%`
      );
    });
    csvRows.push("");

    // Bookings Section
    if (bookings.length > 0) {
      csvRows.push("BOOKINGS");
      csvRows.push("Vendor Name,Category,Status,Date,Price");
      bookings
        .filter((b) => b.status === "confirmed" || b.status === "pending")
        .forEach((booking) => {
          csvRows.push(
            `"${booking.vendorName}","${booking.vendorCategory}","${booking.status}","${booking.date}","${booking.price}"`
          );
        });
      csvRows.push("");
    }

    // Expenses Section
    if (expenses.length > 0) {
      csvRows.push("EXPENSES");
      csvRows.push("Name,Category,Amount,Date,Description");
      expenses.forEach((expense) => {
        const categoryLabel = getCategoryDisplayLabel(expense.category || "other");
        csvRows.push(
          `"${expense.name}","${categoryLabel}",$${parseFloat(String(expense.amount || 0)).toLocaleString()},"${expense.expense_date || "N/A"}","${expense.description || ""}"`
        );
      });
      csvRows.push("");
    }

    // Allocations Section
    if (allocations.length > 0) {
      csvRows.push("BUDGET ALLOCATIONS");
      csvRows.push("Category,Allocated Amount");
      allocations.forEach((allocation) => {
        const categoryLabel = getCategoryDisplayLabel(allocation.category);
        csvRows.push(
          `"${categoryLabel}",$${parseFloat(String(allocation.allocated_amount || 0)).toLocaleString()}`
        );
      });
    }

    // Convert to CSV format - rows are already properly formatted with quotes where needed
    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wedding-budget-${reportDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddCategory = async () => {
    const finalCategory = newCategory.useCustom 
      ? newCategory.customCategory.trim().toLowerCase().replace(/\s+/g, "_")
      : newCategory.category;
    
    if (!finalCategory || !newCategory.allocated) {
      alert("Please select a category and enter an allocated amount");
      return;
    }

    try {
      const response = await fetch("/api/budget-allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: finalCategory,
          allocated_amount: parseFloat(newCategory.allocated),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add allocation");
      }

      // Refresh allocations
      const allocationsRes = await fetch("/api/budget-allocations");
      if (allocationsRes.ok) {
        const allocationsData = await allocationsRes.json();
        setAllocations(allocationsData.allocations || []);
      }

      setShowAddCategory(false);
      setNewCategory({ category: "other", allocated: "", useCustom: false, customCategory: "" });
    } catch (error) {
      console.error("Error adding allocation:", error);
      alert("Failed to add allocation. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budget...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button onClick={() => navigate("/my-wedding")} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-2xl font-bold text-center flex-1 text-gray-900 pr-6">
          Budget Tracker
        </h1>
      </header>

      <main className="flex-1 px-4 lg:px-6 xl:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8 overflow-y-auto pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
        {/* Budget Summary Section - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Budget Summary Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
            <p className="text-sm lg:text-base font-medium mb-2 opacity-90">Total Budget</p>
            <p className="text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">${budgetTotal.toLocaleString()}</p>

            <div className="grid grid-cols-2 gap-4 lg:gap-6 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4">
                <p className="text-xs lg:text-sm opacity-90 mb-1">Allocated</p>
                <p className="text-xl lg:text-2xl font-bold">${totalAllocated.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4">
                <p className="text-xs lg:text-sm opacity-90 mb-1">Spent</p>
                <p className="text-xl lg:text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 lg:mt-6">
              <div className="flex items-center justify-between text-xs lg:text-sm mb-2">
                <span>Budget Used</span>
                <span>
                  {budgetTotal > 0
                    ? Math.round((totalSpent / budgetTotal) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full h-2 lg:h-3 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{
                    width: `${
                      budgetTotal > 0
                        ? Math.min((totalSpent / budgetTotal) * 100, 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Budget Status Cards - Sidebar on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
            <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" />
                <p className="text-xs lg:text-sm font-semibold text-gray-600 uppercase">
                  Remaining
                </p>
              </div>
              <p
                className={`text-2xl lg:text-3xl font-bold ${
                  remaining >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                ${Math.abs(remaining).toLocaleString()}
              </p>
              {remaining < 0 && (
                <p className="text-xs lg:text-sm text-red-600 mt-1">Over budget</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                <p className="text-xs lg:text-sm font-semibold text-gray-600 uppercase">
                  Unspent
                </p>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                ${unspent.toLocaleString()}
              </p>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                {totalAllocated > 0
                  ? Math.round((unspent / totalAllocated) * 100)
                  : 0}
                % of allocated
              </p>
            </div>
          </div>
        </div>

        {/* Budget Alert */}
        {remaining < 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 lg:p-6 flex items-start gap-3 lg:gap-4">
            <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm lg:text-base font-semibold text-red-900">
                Budget Exceeded
              </p>
              <p className="text-sm lg:text-base text-red-800 mt-1">
                You've allocated ${Math.abs(remaining).toLocaleString()} more
                than your total budget. Consider adjusting your allocations.
              </p>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 lg:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Budget Breakdown</h2>
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden lg:inline">Add Category</span>
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            {budgetCategories.length === 0 ? (
              <p className="text-sm lg:text-base text-gray-500 text-center py-8 lg:py-12">
                No budget categories yet. Add allocations to track your spending.
              </p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {budgetCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg p-4 lg:p-5 space-y-3 lg:space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${category.color}`}
                        />
                        <div>
                          <p className="text-sm lg:text-base font-semibold text-gray-900">
                            {category.name}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-500">
                            ${category.spent.toLocaleString()} of $
                            {category.allocated.toLocaleString() || "0"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setAddingExpenseForCategory(category.category);
                            setExpenseFormData({
                              name: "",
                              amount: "",
                              description: "",
                              expense_date: "",
                            });
                          }}
                          className="px-2 py-1 text-xs lg:text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-200 transition-colors"
                          title="Add Expense"
                        >
                          <Plus className="w-3 h-3 lg:w-4 lg:h-4 inline mr-1" />
                          <span className="hidden sm:inline">Add Expense</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(category.id);
                            setEditingData({ allocated: category.allocated });
                          }}
                          className="p-1.5 lg:p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Edit Allocation"
                        >
                          <Edit2 className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                        </button>
                        {!category.id.startsWith("spent-") && (
                          <button
                            onClick={() => handleDeleteAllocation(category.id)}
                            className="p-1.5 lg:p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete Allocation"
                          >
                            <Trash2 className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {category.allocated > 0 && (
                      <div>
                        <div className="w-full h-2 lg:h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${category.color} rounded-full transition-all`}
                            style={{
                              width: `${
                                Math.min(
                                  (category.spent / category.allocated) * 100,
                                  100
                                )
                              }%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1 lg:mt-2">
                          <span
                            className={`text-xs lg:text-sm font-medium ${getStatusColor(
                              category.allocated,
                              category.spent
                            )}`}
                          >
                            {Math.round(
                              (category.spent / category.allocated) * 100
                            )}
                            % spent
                          </span>
                          {category.spent >= category.allocated ? (
                            <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                          ) : (
                            <span className="text-xs lg:text-sm text-gray-500">
                              $
                              {(
                                category.allocated - category.spent
                              ).toLocaleString()}{" "}
                              left
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Add Expense Form */}
                    {addingExpenseForCategory === category.category && (
                      <div className="pt-3 lg:pt-4 border-t border-gray-200 space-y-3 lg:space-y-4 bg-emerald-50 rounded p-3 lg:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs lg:text-sm font-semibold text-gray-900">
                            Record Spending for {category.name}
                          </p>
                          <button
                            onClick={() => {
                              setAddingExpenseForCategory(null);
                              setExpenseFormData({
                                name: "",
                                amount: "",
                                description: "",
                                expense_date: "",
                              });
                            }}
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <X className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                          <div>
                            <label className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 block">
                              Expense Name *
                            </label>
                            <Input
                              type="text"
                              value={expenseFormData.name}
                              onChange={(e) =>
                                setExpenseFormData({
                                  ...expenseFormData,
                                  name: e.target.value,
                                })
                              }
                              className="w-full h-9 lg:h-10 text-sm bg-white"
                              placeholder="e.g., Hair & Makeup trial"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 block">
                              Amount ($) *
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={expenseFormData.amount}
                              onChange={(e) =>
                                setExpenseFormData({
                                  ...expenseFormData,
                                  amount: e.target.value,
                                })
                              }
                              className="w-full h-9 lg:h-10 text-sm bg-white"
                              placeholder="0.00"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 block">
                            Description (optional)
                          </label>
                          <Input
                            type="text"
                            value={expenseFormData.description}
                            onChange={(e) =>
                              setExpenseFormData({
                                ...expenseFormData,
                                description: e.target.value,
                              })
                            }
                            className="w-full h-9 lg:h-10 text-sm bg-white"
                            placeholder="Additional details..."
                          />
                        </div>
                        <div>
                          <label className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 block">
                            Date (optional)
                          </label>
                          <Input
                            type="date"
                            value={expenseFormData.expense_date}
                            onChange={(e) =>
                              setExpenseFormData({
                                ...expenseFormData,
                                expense_date: e.target.value,
                              })
                            }
                            className="w-full h-9 lg:h-10 text-sm bg-white"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddExpense(category.category)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 lg:h-10 text-sm"
                          >
                            Add Expense
                          </Button>
                          <Button
                            onClick={() => {
                              setAddingExpenseForCategory(null);
                              setExpenseFormData({
                                name: "",
                                amount: "",
                                description: "",
                                expense_date: "",
                              });
                            }}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 h-9 lg:h-10 text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Edit Form */}
                    {editingId === category.id && editingData && (
                      <div className="pt-3 lg:pt-4 border-t border-gray-200 space-y-3 lg:space-y-4">
                        <div>
                          <label className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 block">
                            Allocated Amount
                          </label>
                          <Input
                            type="number"
                            value={editingData.allocated}
                            onChange={(e) =>
                              setEditingData({
                                allocated: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full h-9 lg:h-10 text-sm"
                            placeholder="Amount"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleSaveAllocation(
                                category.id,
                                editingData.allocated
                              )
                            }
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 lg:h-10 text-sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingId(null);
                              setEditingData(null);
                            }}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 h-9 lg:h-10 text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-6 space-y-3 lg:space-y-4 mt-4 lg:mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm lg:text-base font-semibold text-gray-900">
                    Add New Category
                  </p>
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory({ category: "other", allocated: "", useCustom: false, customCategory: "" });
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  <div>
                    <label className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 block">
                      Category
                    </label>
                    <select
                      value={newCategory.useCustom ? "custom" : newCategory.category}
                      onChange={(e) => {
                        const isCustom = e.target.value === "custom";
                        setNewCategory({ 
                          ...newCategory, 
                          useCustom: isCustom,
                          category: isCustom ? newCategory.category : e.target.value
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-10 lg:h-11 text-sm"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                      <option value="custom">Custom Category...</option>
                    </select>
                    
                    {newCategory.useCustom && (
                      <div className="mt-2">
                        <Input
                          type="text"
                          value={newCategory.customCategory}
                          onChange={(e) =>
                            setNewCategory({ ...newCategory, customCategory: e.target.value })
                          }
                          placeholder="Enter custom category name (e.g., Transportation, Hair & Makeup)"
                          className="w-full h-10 lg:h-11"
                          required
                        />
                        <p className="text-xs lg:text-sm text-gray-500 mt-1">
                          Create a custom category for expenses made outside the app
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs lg:text-sm font-semibold text-gray-700 mb-1 block">
                      Allocated Amount
                    </label>
                    <Input
                      type="number"
                      value={newCategory.allocated}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, allocated: e.target.value })
                      }
                      placeholder="Amount"
                      className="w-full h-10 lg:h-11"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCategory}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-10 lg:h-11"
                  >
                    Add Category
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory({ category: "other", allocated: "", useCustom: false, customCategory: "" });
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 h-10 lg:h-11"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <button className="bg-white rounded-xl shadow-md p-4 lg:p-6 hover:shadow-lg transition-all text-left">
            <Calendar className="w-8 h-8 lg:w-10 lg:h-10 text-emerald-600 mb-2" />
            <p className="text-sm lg:text-base font-semibold text-gray-900">
              Payment Schedule
            </p>
          </button>
          <button
            onClick={exportBudget}
            className="bg-white rounded-xl shadow-md p-4 lg:p-6 hover:shadow-lg transition-all text-left"
          >
            <Download className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600 mb-2" />
            <p className="text-sm lg:text-base font-semibold text-gray-900">Export Report</p>
          </button>
        </div>
      </main>
    </div>
  );
};
