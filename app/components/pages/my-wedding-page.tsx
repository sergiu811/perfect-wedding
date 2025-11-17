import {
  Calendar,
  Camera,
  CheckCircle,
  ChevronRight,
  Circle,
  Clock,
  DollarSign,
  Download,
  Edit2,
  FileText,
  Heart,
  MapPin,
  MessageCircle,
  Palette,
  Plus,
  QrCode,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/contexts/auth-context";
import { usePlanning } from "~/contexts/planning-context";
import { useRouter } from "~/contexts/router-context";
import { useSupabase } from "~/lib/supabase.client";
import { getWeddingByUserId } from "~/lib/wedding";
import type { Database } from "~/types/database.types";

type Wedding = Database["public"]["Tables"]["weddings"]["Row"];

export const MyWeddingPage = () => {
  const { navigate } = useRouter();
  const { formData, loadFormData } = usePlanning();
  const { user } = useAuth();
  const supabase = useSupabase();
  const [showAIChat, setShowAIChat] = useState(false);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  // Fetch wedding data from Supabase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchWedding = async () => {
      const { data, error } = await getWeddingByUserId(supabase, user.id);
      if (data) {
        setWedding(data);
      } else if (error) {
        console.error("Error fetching wedding:", error);
      }
      setLoading(false);
    };

    fetchWedding();
  }, [user, supabase]);

  useEffect(() => {
    if (wedding) {
      setDaysLeft(getDaysUntilWedding(wedding.wedding_date));
    }
  }, [wedding]);

  // Fetch bookings, conversations, expenses, and tasks
  useEffect(() => {
    if (!user || !wedding) {
      setLoadingBookings(false);
      setLoadingTasks(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingBookings(true);
        setLoadingTasks(true);
        const [bookingsRes, conversationsRes, expensesRes, tasksRes] =
          await Promise.all([
            fetch("/api/bookings"),
            fetch("/api/conversations"),
            fetch("/api/budget-expenses"),
            fetch("/api/planning-tasks"),
          ]);

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.bookings || []);
        }

        if (conversationsRes.ok) {
          const conversationsData = await conversationsRes.json();
          setConversations(conversationsData.conversations || []);
        }

        if (expensesRes.ok) {
          const expensesData = await expensesRes.json();
          setExpenses(expensesData.expenses || []);
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingBookings(false);
        setLoadingTasks(false);
      }
    };

    fetchData();
  }, [user, wedding]);

  // Use wedding data from database if available, otherwise fall back to context
  const displayData = wedding
    ? {
        partner1Name: wedding.partner1_name,
        partner2Name: wedding.partner2_name,
        weddingDate: wedding.wedding_date,
        location: wedding.location,
        guestCount: wedding.guest_count.toString(),
        budgetMin: wedding.budget_min?.toString(),
        budgetMax: wedding.budget_max?.toString(),
        themes: wedding.themes || [],
        colorPalette: wedding.color_palette || [],
      }
    : formData;

  // Calculate days until wedding
  const getDaysUntilWedding = (date: string) => {
    const weddingDate = wedding?.wedding_date || displayData.weddingDate;
    if (!weddingDate) return null;
    const weddingDay = new Date(weddingDate);
    const today = new Date();
    const diff = Math.ceil(
      (weddingDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  // Expense Form Component
  const ExpenseForm = ({
    expense,
    onSave,
    onCancel,
  }: {
    expense: any | null;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    // Check if existing expense has a custom category (not in predefined list)
    const predefinedCategories = [
      "venue",
      "photo_video",
      "music_dj",
      "sweets",
      "decorations",
      "invitations",
      "other",
    ];
    const isExistingCustom =
      expense?.category && !predefinedCategories.includes(expense.category);

    const [useCustomCategory, setUseCustomCategory] = useState(
      isExistingCustom || false
    );
    const [formData, setFormData] = useState({
      name: expense?.name || "",
      category: expense?.category || "other",
      customCategory: isExistingCustom ? expense.category : "",
      amount: expense?.amount || "",
      description: expense?.description || "",
      expense_date: expense?.expense_date || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const finalCategory = useCustomCategory
        ? formData.customCategory.trim().toLowerCase().replace(/\s+/g, "_")
        : formData.category;

      if (!formData.name || !finalCategory || !formData.amount) {
        alert("Please fill in all required fields");
        return;
      }

      onSave({
        ...formData,
        category: finalCategory,
      });
    };

    const categories = [
      { value: "venue", label: "Venue" },
      { value: "photo_video", label: "Photo & Video" },
      { value: "music_dj", label: "Music/DJ" },
      { value: "sweets", label: "Sweets" },
      { value: "decorations", label: "Decorations" },
      { value: "invitations", label: "Invitations" },
      { value: "other", label: "Other" },
      { value: "custom", label: "Custom Category..." },
    ];

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Expense Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Custom decorations"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Category *
          </label>
          <select
            value={useCustomCategory ? "custom" : formData.category}
            onChange={(e) => {
              const isCustom = e.target.value === "custom";
              setUseCustomCategory(isCustom);
              if (!isCustom) {
                setFormData({ ...formData, category: e.target.value });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {useCustomCategory && (
            <div className="mt-2">
              <input
                type="text"
                value={formData.customCategory}
                onChange={(e) =>
                  setFormData({ ...formData, customCategory: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter custom category name (e.g., Transportation, Hair & Makeup)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Create a custom category for expenses made outside the app
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Amount ($) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={2}
            placeholder="Optional description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.expense_date}
            onChange={(e) =>
              setFormData({ ...formData, expense_date: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {expense ? "Update" : "Add"} Expense
          </Button>
        </div>
      </form>
    );
  };

  // Handle expense operations
  const handleSaveExpense = async (expenseData: any) => {
    try {
      const method = editingExpense ? "PUT" : "POST";
      const url = "/api/budget-expenses";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingExpense
            ? { ...expenseData, id: editingExpense.id }
            : expenseData
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save expense");
      }

      // Refresh expenses
      const expensesRes = await fetch("/api/budget-expenses");
      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        setExpenses(expensesData.expenses || []);
      }

      setShowAddExpense(false);
      setEditingExpense(null);
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Please try again.");
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      const response = await fetch(`/api/budget-expenses?id=${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      // Refresh expenses
      const expensesRes = await fetch("/api/budget-expenses");
      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        setExpenses(expensesData.expenses || []);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  // Task Form Component
  const TaskForm = ({
    task,
    onSave,
    onCancel,
  }: {
    task: any | null;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    // Check if existing task has a custom category (not in predefined list)
    const predefinedCategories = [
      "Venue",
      "Photo & Video",
      "Music",
      "Guests",
      "Sweets",
      "Decorations",
      "Invitations",
      "Other",
    ];
    const isExistingCustom =
      task?.category && !predefinedCategories.includes(task.category);

    const [useCustomCategory, setUseCustomCategory] = useState(
      isExistingCustom || false
    );
    const [formData, setFormData] = useState({
      title: task?.title || "",
      category: task?.category || "Other",
      customCategory: isExistingCustom ? task.category : "",
      due_date: task?.due_date || "",
      priority: task?.priority || "medium",
      notes: task?.notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const finalCategory = useCustomCategory
        ? formData.customCategory.trim()
        : formData.category;

      if (!formData.title || !finalCategory) {
        alert("Please fill in all required fields");
        return;
      }

      onSave({
        ...formData,
        category: finalCategory,
      });
    };

    const categories = [
      "Venue",
      "Photo & Video",
      "Music",
      "Guests",
      "Sweets",
      "Decorations",
      "Invitations",
      "Other",
      "Custom Category...",
    ];

    const priorities = [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "urgent", label: "Urgent" },
    ];

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Book Venue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Category *
          </label>
          <select
            value={useCustomCategory ? "Custom Category..." : formData.category}
            onChange={(e) => {
              const isCustom = e.target.value === "Custom Category...";
              setUseCustomCategory(isCustom);
              if (!isCustom) {
                setFormData({ ...formData, category: e.target.value });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {useCustomCategory && (
            <div className="mt-2">
              <input
                type="text"
                value={formData.customCategory}
                onChange={(e) =>
                  setFormData({ ...formData, customCategory: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter custom category name (e.g., Transportation, Hair & Makeup)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Create a custom category for your task
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={2}
            placeholder="Optional notes..."
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {task ? "Update" : "Add"} Task
          </Button>
        </div>
      </form>
    );
  };

  // Handle task operations
  const handleSaveTask = async (taskData: any) => {
    try {
      const method = editingTask ? "PUT" : "POST";
      const url = "/api/planning-tasks";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingTask ? { ...taskData, id: editingTask.id } : taskData
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      // Refresh tasks
      const tasksRes = await fetch("/api/planning-tasks");
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }

      setShowAddTask(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task. Please try again.");
    }
  };

  const handleToggleTask = async (task: any) => {
    try {
      const response = await fetch("/api/planning-tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Refresh tasks
      const tasksRes = await fetch("/api/planning-tasks");
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowAddTask(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`/api/planning-tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Refresh tasks
      const tasksRes = await fetch("/api/planning-tasks");
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  // Export budget function
  const handleExportBudget = () => {
    // Create comprehensive budget report
    const reportDate = new Date().toISOString().split("T")[0];
    const weddingDate =
      wedding?.wedding_date || displayData.weddingDate || "N/A";
    const partnerNames =
      displayData.partner1Name && displayData.partner2Name
        ? `${displayData.partner1Name} & ${displayData.partner2Name}`
        : displayData.partner1Name || "N/A";

    // Build CSV content
    const csvRows: string[] = [];

    // Header Section
    csvRows.push("WEDDING BUDGET REPORT");
    csvRows.push(`Generated: ${new Date().toLocaleString()}`);
    csvRows.push(`Wedding Date: ${weddingDate}`);
    csvRows.push(`Couple: ${partnerNames}`);
    csvRows.push(`Location: ${displayData.location || "N/A"}`);
    csvRows.push("");

    // Summary Section
    csvRows.push("BUDGET SUMMARY");
    csvRows.push(`Total Budget,$${budgetTotal.toLocaleString()}`);
    csvRows.push(`Total Allocated,$${budgetAllocated.toLocaleString()}`);
    csvRows.push(
      `Budget Remaining,$${(budgetTotal - budgetAllocated).toLocaleString()}`
    );
    csvRows.push(`Budget Used,${budgetPercent}%`);
    csvRows.push("");

    // Category Breakdown
    if (budgetBreakdown.length > 0) {
      csvRows.push("CATEGORY BREAKDOWN");
      csvRows.push("Category,Amount");
      budgetBreakdown.forEach((item) => {
        csvRows.push(
          `"${item.label}",$${item.amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
        );
      });
      csvRows.push("");
    }

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
      csvRows.push("EXTRA EXPENSES");
      csvRows.push("Name,Category,Amount,Date,Description");
      expenses.forEach((expense) => {
        const categoryLabel = getCategoryLabel(expense.category || "other");
        csvRows.push(
          `"${expense.name}","${categoryLabel}",$${parseFloat(String(expense.amount || 0)).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })},"${expense.expense_date || "N/A"}","${expense.description || ""}"`
        );
      });
      csvRows.push("");
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

  // Function to load wedding data into planning form and navigate to edit
  const handleEditWedding = () => {
    if (wedding) {
      loadFormData({
        partner1Name: wedding.partner1_name,
        partner2Name: wedding.partner2_name,
        weddingDate: wedding.wedding_date,
        guestCount: wedding.guest_count.toString(),
        budgetMin: wedding.budget_min?.toString() || "",
        budgetMax: wedding.budget_max?.toString() || "",
        location: wedding.location,
        weddingType: wedding.wedding_type || "",
        language: wedding.language || "",
        referralSource: wedding.referral_source || "",
        themes: wedding.themes || [],
        colorPalette: wedding.color_palette || [],
        venuePreference: wedding.venue_preference || "",
        formalityLevel: wedding.formality_level || "",
        venueTypes: wedding.venue_types || [],
        musicStyles: wedding.music_styles || [],
        vendorCategories: wedding.vendor_categories || [],
        preferredContactMethod: wedding.preferred_contact_method || "",
        currentStage: wedding.current_stage || "",
        helpTasks: wedding.help_tasks || [],
        notifications: wedding.notifications || [],
      });
    }
    navigate("/planning/step-1");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wedding...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <Heart className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please Log In
          </h2>
          <p className="text-gray-600 mb-4">
            Sign in to view your wedding details
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!wedding && !displayData.weddingDate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Heart className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Start Planning Your Wedding
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't created a wedding plan yet. Let's get started!
          </p>
          <Button
            onClick={() => navigate("/planning/step-1")}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Start Planning
          </Button>
        </div>
      </div>
    );
  }

  // Calculate task progress
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Booked vendors - from actual bookings
  const bookedVendors = bookings.map((booking) => {
    // Find conversation for this booking by matching serviceId
    const conversation = booking.serviceId
      ? conversations.find((c) => c.serviceId === booking.serviceId)
      : null;

    return {
      id: booking.id,
      bookingId: booking.id,
      serviceId: booking.serviceId,
      vendorId: booking.vendorId,
      name: booking.vendorName,
      category: booking.vendorCategory,
      status:
        booking.status === "confirmed"
          ? "Confirmed"
          : booking.status === "pending"
            ? "Pending"
            : booking.status === "completed"
              ? "Completed"
              : "Cancelled",
      image: booking.vendorImage,
      conversationId: conversation?.id || null,
    };
  });

  // Suggested vendors
  const suggestedVendors = [
    {
      id: 1,
      name: "DJ SoundWave",
      category: "Music & DJ",
      rating: 4.8,
      price: "$800-1200",
      match: 95,
    },
    {
      id: 2,
      name: "Sweet Dreams Bakery",
      category: "Sweets",
      rating: 4.9,
      price: "$500-800",
      match: 92,
    },
    {
      id: 3,
      name: "Bloom & Petal Florist",
      category: "Decorations",
      rating: 4.7,
      price: "$600-1000",
      match: 88,
    },
  ];

  // Calculate budget from bookings and expenses
  const bookingsTotal = bookings.reduce((sum, booking) => {
    // Only count confirmed or pending bookings (not cancelled)
    if (booking.status === "confirmed" || booking.status === "pending") {
      const price = parseFloat(String(booking.totalPrice || 0));
      return sum + (isNaN(price) ? 0 : price);
    }
    return sum;
  }, 0);

  const expensesTotal = expenses.reduce((sum, expense) => {
    const amount = parseFloat(String(expense.amount || 0));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const budgetAllocated = bookingsTotal + expensesTotal;
  const budgetTotal = displayData.budgetMax
    ? parseFloat(displayData.budgetMax)
    : 35000;
  const budgetPercent =
    budgetTotal > 0 ? Math.round((budgetAllocated / budgetTotal) * 100) : 0;

  // Calculate breakdown by category
  const categoryMap: Record<string, { amount: number; color: string }> = {
    venue: { amount: 0, color: "bg-rose-500" },
    photo_video: { amount: 0, color: "bg-blue-500" },
    music_dj: { amount: 0, color: "bg-purple-500" },
    sweets: { amount: 0, color: "bg-pink-500" },
    decorations: { amount: 0, color: "bg-green-500" },
    invitations: { amount: 0, color: "bg-yellow-500" },
    other: { amount: 0, color: "bg-gray-500" },
  };

  // Add booking amounts by category
  bookings.forEach((booking) => {
    if (booking.status === "confirmed" || booking.status === "pending") {
      const category =
        booking.vendorCategory?.toLowerCase().replace(/\s+/g, "_") || "other";
      const normalizedCategory =
        category === "photo_&_video" || category === "photo&video"
          ? "photo_video"
          : category === "music/dj" || category === "music_/dj"
            ? "music_dj"
            : category;

      const key = categoryMap[normalizedCategory]
        ? normalizedCategory
        : "other";
      const price = parseFloat(String(booking.totalPrice || 0));
      if (!isNaN(price)) {
        categoryMap[key].amount += price;
      }
    }
  });

  // Add expense amounts by category
  expenses.forEach((expense) => {
    const category = expense.category || "other";
    const key = categoryMap[category] ? category : "other";
    const amount = parseFloat(String(expense.amount || 0));
    if (!isNaN(amount)) {
      categoryMap[key].amount += amount;
    }
  });

  // Get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      venue: "Venue",
      photo_video: "Photo & Video",
      music_dj: "Music/DJ",
      sweets: "Sweets",
      decorations: "Decorations",
      invitations: "Invitations",
      other: "Other",
    };

    // If not in predefined labels, format the custom category name
    if (!labels[category]) {
      // Convert snake_case or lowercase to Title Case
      return category
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return labels[category] || category;
  };

  // Filter out categories with 0 amount and sort by amount
  const budgetBreakdown = Object.entries(categoryMap)
    .filter(([_, data]) => data.amount > 0)
    .map(([category, data]) => ({
      category,
      label: getCategoryLabel(category),
      amount: data.amount,
      color: data.color,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 lg:pb-8">
      {/* Header & Summary Banner */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 lg:p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-1">
                Welcome back, {displayData.partner1Name || "Sarah"} 💍
              </h1>
              <p className="text-white/90 text-sm lg:text-base">
                {wedding?.wedding_type &&
                  `${wedding.wedding_type.charAt(0).toUpperCase() + wedding.wedding_type.slice(1)} Wedding • `}
                {daysLeft !== null
                  ? `${daysLeft} days left until your big day!`
                  : "Set your wedding date to see countdown"}
              </p>
            </div>
            <button
              onClick={handleEditWedding}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Ring */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 mt-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm lg:text-base mb-1">
                  Planning Progress
                </p>
                <p className="text-2xl lg:text-3xl font-bold">
                  {progressPercent}%
                </p>
              </div>
              <div className="relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="white"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${progressPercent * 1.76} 176`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Desktop: 2-column layout, Mobile: 1-column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Wedding Overview Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 lg:p-5 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" />
                  Wedding Overview
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-rose-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        {displayData.weddingDate
                          ? new Date(
                              displayData.weddingDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Location
                    </p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        {displayData.location || "TBD"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Guests
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-rose-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        {displayData.guestCount || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Budget
                    </p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-rose-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        {displayData.budgetMin && displayData.budgetMax
                          ? `$${parseInt(
                              displayData.budgetMin
                            ).toLocaleString()}-${parseInt(
                              displayData.budgetMax
                            ).toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Type
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {wedding?.wedding_type
                        ? wedding.wedding_type.charAt(0).toUpperCase() +
                          wedding.wedding_type.slice(1)
                        : "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Formality
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {wedding?.formality_level
                        ? wedding.formality_level.charAt(0).toUpperCase() +
                          wedding.formality_level.slice(1)
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Theme & Colors */}
                {displayData.themes && displayData.themes.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                      Theme
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {displayData.themes.map((theme: string) => (
                        <span
                          key={theme}
                          className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-full"
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleEditWedding}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full h-10 text-sm"
                  >
                    Edit Details
                  </Button>
                  <Button className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 rounded-full h-10 text-sm">
                    View Moodboard
                  </Button>
                </div>
              </div>
            </div>

            {/* Style & Preferences */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 lg:p-5 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Style & Preferences
                </h2>
              </div>
              <div className="p-4 lg:p-5 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                    Venue Preference
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {wedding?.venue_preference
                      ? wedding.venue_preference.charAt(0).toUpperCase() +
                        wedding.venue_preference.slice(1)
                      : "Indoor"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                    Preferred Venue Types
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(wedding?.venue_types && wedding.venue_types.length > 0
                      ? wedding.venue_types
                      : ["Ballroom", "Garden", "Hotel"]
                    ).map((type: string) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                    Music Styles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(wedding?.music_styles && wedding.music_styles.length > 0
                      ? wedding.music_styles
                      : ["Pop", "Jazz", "Classical"]
                    ).map((style: string) => (
                      <span
                        key={style}
                        className="px-2 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Priorities */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 lg:p-5 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Vendor Priorities
                </h2>
              </div>
              <div className="p-4 lg:p-5 space-y-3">
                {(
                  wedding?.vendor_categories || [
                    "venue",
                    "photo-video",
                    "music-dj",
                    "decorations",
                    "sweets",
                  ]
                )
                  .sort((a: string, b: string) => {
                    const defaultPriorities: Record<string, number> = {
                      venue: 5,
                      "photo-video": 4,
                      "music-dj": 3,
                      decorations: 4,
                      sweets: 3,
                    };
                    const priorityA = defaultPriorities[a] || 3;
                    const priorityB = defaultPriorities[b] || 3;
                    return priorityB - priorityA;
                  })
                  .map((category: string) => {
                    const defaultPriorities: Record<string, number> = {
                      venue: 5,
                      "photo-video": 4,
                      "music-dj": 3,
                      decorations: 4,
                      sweets: 3,
                    };
                    const priority = defaultPriorities[category] || 3;

                    const getPriorityLabel = (p: number) => {
                      if (p === 5)
                        return {
                          label: "Critical",
                          color: "bg-red-100 text-red-700 border-red-200",
                        };
                      if (p === 4)
                        return {
                          label: "High",
                          color:
                            "bg-orange-100 text-orange-700 border-orange-200",
                        };
                      if (p === 3)
                        return {
                          label: "Medium",
                          color:
                            "bg-yellow-100 text-yellow-700 border-yellow-200",
                        };
                      if (p === 2)
                        return {
                          label: "Low",
                          color: "bg-blue-100 text-blue-700 border-blue-200",
                        };
                      return {
                        label: "Optional",
                        color: "bg-gray-100 text-gray-700 border-gray-200",
                      };
                    };

                    const priorityInfo = getPriorityLabel(priority);

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {category
                            .split("-")
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityInfo.color}`}
                        >
                          {priorityInfo.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* What We're Helping With */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 lg:p-5 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  We're Helping You With
                </h2>
              </div>
              <div className="p-4 lg:p-5">
                <div className="grid grid-cols-2 gap-2">
                  {(
                    wedding?.help_tasks || [
                      "Budget Management",
                      "Vendor Booking",
                      "Guest List Management",
                      "Timeline Creation",
                    ]
                  ).map((task: string) => (
                    <div
                      key={task}
                      className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-900">
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Planning Progress & Tasks */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    Planning Tasks
                  </h2>
                  <span className="text-sm font-medium text-blue-600">
                    {completedTasks}/{tasks.length}
                  </span>
                </div>
              </div>
              <div className="p-4 lg:p-5 space-y-3">
                {/* AI Suggestion */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium">
                        AI Suggestion
                      </p>
                      <p className="text-sm text-blue-800 mt-1">
                        Book your DJ/Band this month to secure your date!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Task List */}
                {loadingTasks ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No tasks yet. Add your first task to get started!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed || false}
                          onChange={() => handleToggleTask(task)}
                          className="w-5 h-5 rounded text-rose-600 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              task.completed
                                ? "line-through text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-gray-500">
                              {task.category}
                            </p>
                            {task.due_date && (
                              <>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <p className="text-xs text-gray-500">
                                    {new Date(task.due_date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-1 hover:bg-gray-200 rounded text-gray-600"
                            title="Edit task"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                            title="Delete task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowAddTask(true);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 mt-3"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Task
                </button>
              </div>
            </div>

            {/* Booked Vendors */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 lg:p-5 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Booked Vendors
                </h2>
              </div>
              <div className="p-4 lg:p-5 space-y-3">
                {bookedVendors.length === 0 && !loadingBookings ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No booked vendors yet. Start booking vendors to see them
                    here.
                  </p>
                ) : (
                  bookedVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0"
                        style={{ backgroundImage: `url(${vendor.image})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {vendor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {vendor.category}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            vendor.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {vendor.status}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (vendor.conversationId) {
                            navigate(`/chat/${vendor.conversationId}`);
                          } else if (vendor.serviceId) {
                            // Try to find conversation by serviceId
                            const conv = conversations.find(
                              (c) => c.serviceId === vendor.serviceId
                            );
                            if (conv?.id) {
                              navigate(`/chat/${conv.id}`);
                            }
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded-full"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  ))
                )}

                <button
                  onClick={() => navigate("/vendors")}
                  className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-rose-400 hover:text-rose-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Vendor</span>
                </button>
              </div>
            </div>

            {/* Suggested Vendors */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 lg:p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Recommended For You
                  </h2>
                  <button
                    onClick={() => navigate("/vendors")}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-4 lg:p-5 space-y-3">
                {suggestedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-rose-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {vendor.name}
                          </p>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                            {vendor.match}% match
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {vendor.category}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium">{vendor.rating}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{vendor.price}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (vendor.category === "Music & DJ")
                          navigate("/music-dj");
                        else if (vendor.category === "Sweets")
                          navigate("/sweets");
                        else if (vendor.category === "Decorations")
                          navigate("/decorations");
                      }}
                      className="flex items-center justify-center gap-1 w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full h-9 text-sm font-medium mt-2"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages & Inquiries */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1 xl:col-span-2">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    Messages
                  </h2>
                  <button
                    onClick={() => navigate("/messages")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-4 lg:p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Recent Messages */}
                  {conversations.length === 0 && !loadingBookings ? (
                    <p className="text-sm text-gray-500 text-center py-4 col-span-2">
                      No messages yet. Contact vendors to start conversations.
                    </p>
                  ) : (
                    conversations.slice(0, 4).map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => navigate(`/chat/${conv.id}`)}
                        className="w-full flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                      >
                        <div
                          className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                          style={{
                            backgroundImage: `url(${conv.vendorAvatar})`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {conv.vendorName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {conv.vendorCategory || "Service"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <p className="text-xs text-gray-500">
                                {conv.timestamp}
                              </p>
                              {conv.unread && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                              )}
                              {conv.hasPendingOffer && (
                                <div
                                  className="w-2 h-2 bg-yellow-500 rounded-full"
                                  title="Pending Offer"
                                />
                              )}
                            </div>
                          </div>
                          <p
                            className={`text-xs ${conv.unread ? "text-gray-900 font-medium" : "text-gray-600"} truncate`}
                          >
                            {conv.hasPendingOffer
                              ? `💰 Offer: ${conv.pendingOffer?.price || "View offer"}`
                              : conv.lastMessage || "No messages yet"}
                          </p>
                        </div>
                      </button>
                    ))
                  )}

                  {/* View All Button */}
                  <button
                    onClick={() => navigate("/messages")}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2 py-2"
                  >
                    View All Messages
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* My Bookings */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 lg:p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    My Bookings
                  </h2>
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-4 lg:p-5 space-y-3">
                {/* Confirmed Bookings */}
                {bookings.length === 0 && !loadingBookings ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No bookings yet. Start booking vendors to see them here.
                  </p>
                ) : (
                  bookings.slice(0, 2).map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => navigate("/my-bookings")}
                      className="w-full flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors text-left border border-purple-100"
                    >
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `url(${booking.vendorImage})`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {booking.vendorName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.vendorCategory}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : booking.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {booking.status === "confirmed"
                              ? "Confirmed"
                              : booking.status === "pending"
                                ? "Pending"
                                : booking.status === "completed"
                                  ? "Completed"
                                  : "Cancelled"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-purple-600">
                            <DollarSign className="w-3 h-3" />
                            {booking.price}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}

                {/* View All Button */}
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 mt-2 py-2"
                >
                  View All Bookings
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 lg:p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Budget Tracker
                  </h2>
                  <button
                    onClick={() => navigate("/budget-details")}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className="p-4 lg:p-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Allocated</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${budgetAllocated.toLocaleString()} of $
                      {budgetTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all"
                      style={{ width: `${budgetPercent}%` }}
                    />
                  </div>
                </div>

                {/* Expense Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900">
                      Breakdown
                    </p>
                    <button
                      onClick={() => {
                        setEditingExpense(null);
                        setShowAddExpense(true);
                      }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add Expense
                    </button>
                  </div>
                  {budgetBreakdown.length === 0 ? (
                    <p className="text-xs text-gray-500 py-2">
                      No expenses yet. Add bookings or expenses to see
                      breakdown.
                    </p>
                  ) : (
                    budgetBreakdown.map((item) => (
                      <div
                        key={item.category}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${item.color}`}
                          />
                          <span className="text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          $
                          {item.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Extra Expenses List */}
                {expenses.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-900">
                      Extra Expenses
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1.5"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {expense.name}
                            </p>
                            {expense.category && (
                              <p className="text-gray-500 text-[10px]">
                                {getCategoryLabel(expense.category)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              $
                              {parseFloat(
                                String(expense.amount)
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </span>
                            <button
                              onClick={() => handleEditExpense(expense)}
                              className="p-1 hover:bg-gray-200 rounded text-gray-600"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="p-1 hover:bg-red-100 rounded text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleExportBudget}
                  className="flex items-center justify-center gap-2 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg h-10 text-sm font-medium mt-3"
                >
                  <FileText className="w-4 h-4" />
                  Export Budget Report
                </button>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 lg:p-5 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Timeline Milestones
                </h2>
              </div>
              <div className="p-4 lg:p-5">
                <div className="relative space-y-4">
                  {[
                    { month: "Dec 2024", task: "Book Venue", done: true },
                    {
                      month: "Jan 2025",
                      task: "Book Photographer",
                      done: true,
                    },
                    { month: "Feb 2025", task: "Book DJ/Band", done: false },
                    {
                      month: "Mar 2025",
                      task: "Send Invitations",
                      done: false,
                    },
                    {
                      month: "May 2025",
                      task: "Final Vendor Meetings",
                      done: false,
                    },
                  ].map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.done
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {milestone.done ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </div>
                        {idx < 4 && (
                          <div className="w-0.5 h-8 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {milestone.task}
                        </p>
                        <p className="text-xs text-gray-500">
                          {milestone.month}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guest QR & Gallery */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden lg:col-span-1">
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 lg:p-5 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-pink-600" />
                  Guest Gallery
                </h2>
              </div>
              <div className="p-4 lg:p-5 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <QrCode className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Guest Upload QR
                      </p>
                      <p className="text-xs text-gray-500">
                        Let guests share photos
                      </p>
                    </div>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-2 text-sm font-medium">
                    Generate
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                  ))}
                </div>

                <button className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg h-10 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download All Photos
                </button>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-rose-200 lg:col-span-2 xl:col-span-3">
              <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-4 lg:p-5 border-b border-rose-200">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-600" />
                  AI Wedding Assistant
                </h2>
              </div>
              <div className="p-4 lg:p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 lg:p-4">
                    <p className="text-sm text-rose-900 font-medium mb-2">
                      💡 Weekly Insight
                    </p>
                    <p className="text-sm text-rose-800">
                      3 new vendors matching your style added near Los Angeles
                      this week!
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 lg:p-4">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      ⏰ Timeline Alert
                    </p>
                    <p className="text-sm text-blue-800">
                      It's time to finalize your guest list and start sending
                      Save-the-Dates.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 lg:p-4">
                    <p className="text-sm text-purple-900 font-medium mb-2">
                      ✨ Smart Recommendation
                    </p>
                    <p className="text-sm text-purple-800">
                      Based on your romantic theme, we found 5 florists
                      specializing in rose arrangements.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
                  <button
                    onClick={() => setShowAIChat(!showAIChat)}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-full h-10 text-sm font-medium"
                  >
                    Ask AI
                  </button>
                  <button className="bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 rounded-full h-10 text-sm font-medium">
                    Optimize Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:col-span-2 xl:col-span-3">
              <button
                onClick={() => navigate("/vendors")}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
              >
                <Users className="w-8 h-8 text-rose-600 mb-2" />
                <p className="text-sm font-semibold text-gray-900">
                  Find Vendors
                </p>
              </button>
              <button className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
                <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-gray-900">Timeline</p>
              </button>
              <button
                onClick={() => navigate("/guest-list")}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
              >
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-sm font-semibold text-gray-900">
                  Guest List
                </p>
              </button>
              <button className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <p className="text-sm font-semibold text-gray-900">Analytics</p>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingExpense ? "Edit Expense" : "Add Extra Expense"}
              </h3>
              <button
                onClick={() => {
                  setShowAddExpense(false);
                  setEditingExpense(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <ExpenseForm
              expense={editingExpense}
              onSave={handleSaveExpense}
              onCancel={() => {
                setShowAddExpense(false);
                setEditingExpense(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h3>
              <button
                onClick={() => {
                  setShowAddTask(false);
                  setEditingTask(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <TaskForm
              task={editingTask}
              onSave={handleSaveTask}
              onCancel={() => {
                setShowAddTask(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}

      {/* AI Chat Bubble (Floating) */}
      {showAIChat && (
        <div className="fixed bottom-24 lg:bottom-8 right-4 left-4 lg:left-auto lg:right-8 max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 lg:p-5 z-40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900">AI Assistant</p>
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-800">
                Hi! I can help you with vendor recommendations, budget planning,
                or timeline suggestions. What would you like to know?
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full h-10 px-4 text-sm"
            />
            <button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full w-10 h-10 flex items-center justify-center">
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
