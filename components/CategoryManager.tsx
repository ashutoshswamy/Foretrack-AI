"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tags,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  Loader2,
  Palette,
  Search,
  Smile,
} from "lucide-react";
import { supabase, type Category } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

type CategoryManagerProps = {
  onUpdate?: () => void;
};

// Organized emoji categories for the picker
const emojiCategories = {
  "💰 Finance": [
    "💰",
    "💵",
    "💴",
    "💶",
    "💷",
    "💳",
    "💸",
    "🏦",
    "📈",
    "📉",
    "💹",
    "🪙",
    "💎",
    "🏧",
    "💲",
  ],
  "🍔 Food & Drink": [
    "🍔",
    "🍕",
    "🍜",
    "🍱",
    "🍣",
    "🍪",
    "🍩",
    "🍦",
    "🍷",
    "🍺",
    "☕",
    "🧁",
    "🥗",
    "🌮",
    "🍝",
    "🥡",
    "🍳",
    "🥐",
    "🥪",
    "🍿",
  ],
  "🚗 Transport": [
    "🚗",
    "🚕",
    "🚌",
    "🚇",
    "🚲",
    "✈️",
    "🚀",
    "🛳️",
    "⛽",
    "🚁",
    "🛵",
    "🚃",
    "🚂",
    "🛴",
    "🚤",
  ],
  "🏠 Home": [
    "🏠",
    "🏡",
    "🏢",
    "🛋️",
    "🛏️",
    "🚿",
    "🪴",
    "🧹",
    "🔑",
    "🏗️",
    "🧺",
    "🛁",
    "🪑",
    "🚪",
    "💡",
  ],
  "🛍️ Shopping": [
    "🛍️",
    "🛒",
    "👗",
    "👟",
    "👜",
    "💍",
    "👕",
    "👖",
    "🧥",
    "👠",
    "🎒",
    "👔",
    "🧴",
    "💄",
    "🎀",
  ],
  "🎬 Entertainment": [
    "🎬",
    "🎮",
    "🎵",
    "🎤",
    "🎧",
    "📺",
    "🎭",
    "🎪",
    "🎨",
    "🎯",
    "🎲",
    "🎳",
    "🎰",
    "🎻",
    "🎹",
  ],
  "💼 Work": [
    "💼",
    "📊",
    "📁",
    "📋",
    "✏️",
    "📝",
    "💻",
    "🖥️",
    "📱",
    "⌨️",
    "🖨️",
    "📞",
    "📧",
    "🗂️",
    "📎",
  ],
  "📚 Education": [
    "📚",
    "🎓",
    "📖",
    "✏️",
    "🔬",
    "🔭",
    "🧪",
    "📐",
    "🎒",
    "🏫",
    "📝",
    "🧮",
    "🗃️",
    "📏",
    "🖊️",
  ],
  "🏥 Health": [
    "🏥",
    "💊",
    "💉",
    "🩺",
    "🩹",
    "🧘",
    "🏋️",
    "🚴",
    "🏃",
    "🧬",
    "❤️",
    "🦷",
    "👁️",
    "🩻",
    "🩼",
  ],
  "✈️ Travel": [
    "✈️",
    "🏝️",
    "🏔️",
    "🗺️",
    "🧳",
    "🏕️",
    "🎢",
    "🗼",
    "🗽",
    "🏰",
    "⛱️",
    "🌴",
    "🚢",
    "🎡",
    "⛺",
  ],
  "🐾 Pets": [
    "🐾",
    "🐕",
    "🐈",
    "🐦",
    "🐠",
    "🐹",
    "🐰",
    "🦜",
    "🐢",
    "🐍",
    "🦮",
    "🐩",
    "🦴",
    "🪺",
    "🦎",
  ],
  "🎁 Gifts": [
    "🎁",
    "💐",
    "🎂",
    "🎉",
    "🎊",
    "🎈",
    "💝",
    "🌹",
    "🧸",
    "🎀",
    "🍾",
    "🥳",
    "🎄",
    "🎃",
    "💒",
  ],
  "📦 Other": [
    "📦",
    "🔧",
    "🔨",
    "⚙️",
    "🧰",
    "🪛",
    "🔩",
    "⛏️",
    "🧲",
    "🔌",
    "📡",
    "🛠️",
    "⚡",
    "🔋",
    "💡",
  ],
};

// Expanded color gradient options
const colorOptions = [
  // Warm colors
  {
    name: "Sunset",
    from: "from-orange-400",
    to: "to-red-500",
    bg: "bg-orange-100",
  },
  { name: "Fire", from: "from-red-500", to: "to-orange-600", bg: "bg-red-100" },
  {
    name: "Peach",
    from: "from-orange-300",
    to: "to-pink-400",
    bg: "bg-orange-50",
  },
  { name: "Rose", from: "from-rose-400", to: "to-red-500", bg: "bg-rose-100" },

  // Pink & Purple
  { name: "Pink", from: "from-pink-400", to: "to-rose-500", bg: "bg-pink-100" },
  {
    name: "Fuchsia",
    from: "from-fuchsia-400",
    to: "to-pink-600",
    bg: "bg-fuchsia-100",
  },
  {
    name: "Purple",
    from: "from-purple-400",
    to: "to-pink-500",
    bg: "bg-purple-100",
  },
  {
    name: "Violet",
    from: "from-violet-500",
    to: "to-purple-600",
    bg: "bg-violet-100",
  },

  // Blue shades
  {
    name: "Ocean",
    from: "from-blue-400",
    to: "to-indigo-500",
    bg: "bg-blue-100",
  },
  { name: "Sky", from: "from-sky-400", to: "to-blue-500", bg: "bg-sky-100" },
  {
    name: "Indigo",
    from: "from-indigo-400",
    to: "to-purple-500",
    bg: "bg-indigo-100",
  },
  {
    name: "Navy",
    from: "from-blue-600",
    to: "to-indigo-700",
    bg: "bg-blue-100",
  },

  // Green & Teal
  {
    name: "Emerald",
    from: "from-green-400",
    to: "to-emerald-500",
    bg: "bg-green-100",
  },
  {
    name: "Mint",
    from: "from-emerald-300",
    to: "to-teal-400",
    bg: "bg-emerald-50",
  },
  {
    name: "Forest",
    from: "from-green-500",
    to: "to-emerald-600",
    bg: "bg-green-100",
  },
  { name: "Teal", from: "from-teal-400", to: "to-cyan-500", bg: "bg-teal-100" },

  // Cyan & Cool
  { name: "Cyan", from: "from-cyan-400", to: "to-teal-500", bg: "bg-cyan-100" },
  { name: "Aqua", from: "from-cyan-300", to: "to-blue-400", bg: "bg-cyan-50" },

  // Yellow & Warm
  {
    name: "Gold",
    from: "from-yellow-400",
    to: "to-orange-500",
    bg: "bg-yellow-100",
  },
  {
    name: "Amber",
    from: "from-amber-400",
    to: "to-orange-500",
    bg: "bg-amber-100",
  },
  {
    name: "Lemon",
    from: "from-yellow-300",
    to: "to-lime-400",
    bg: "bg-yellow-50",
  },
  {
    name: "Lime",
    from: "from-lime-400",
    to: "to-green-500",
    bg: "bg-lime-100",
  },

  // Neutral
  {
    name: "Slate",
    from: "from-slate-400",
    to: "to-gray-600",
    bg: "bg-slate-100",
  },
  {
    name: "Gray",
    from: "from-gray-400",
    to: "to-slate-500",
    bg: "bg-gray-100",
  },

  // Special gradients
  {
    name: "Rainbow",
    from: "from-pink-500",
    to: "to-violet-500",
    bg: "bg-gradient-to-r from-pink-50 to-violet-50",
  },
  {
    name: "Aurora",
    from: "from-green-400",
    to: "to-blue-500",
    bg: "bg-gradient-to-r from-green-50 to-blue-50",
  },
  {
    name: "Twilight",
    from: "from-purple-500",
    to: "to-indigo-600",
    bg: "bg-purple-100",
  },
  { name: "Coral", from: "from-red-400", to: "to-pink-500", bg: "bg-red-50" },
];

export default function CategoryManager({ onUpdate }: CategoryManagerProps) {
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "📦",
    color: "Gray",
  });

  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<string>(
    Object.keys(emojiCategories)[0],
  );
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Color picker state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get all emojis for search
  const getAllEmojis = () => {
    return Object.values(emojiCategories).flat();
  };

  // Filter emojis based on search
  const getFilteredEmojis = () => {
    if (!emojiSearch.trim()) {
      return (
        emojiCategories[activeEmojiCategory as keyof typeof emojiCategories] ||
        []
      );
    }
    // When searching, search across all categories
    return getAllEmojis();
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name.trim()) return;

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name.trim(),
            icon: formData.icon,
            color: formData.color,
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([
          {
            user_id: user.id,
            name: formData.name.trim(),
            icon: formData.icon,
            color: formData.color,
          },
        ]);

        if (error) throw error;
      }

      setFormData({ name: "", icon: "📦", color: "Gray" });
      setShowForm(false);
      setEditingId(null);
      fetchCategories();
      onUpdate?.();
    } catch (error: unknown) {
      console.error("Error saving category:", error);
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        alert("A category with this name already exists");
      } else {
        alert("Failed to save category");
      }
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
    setShowForm(true);
  };

  const deleteCategory = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? Expenses using this category won't be affected.",
      )
    )
      return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      fetchCategories();
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", icon: "📦", color: "Gray" });
    setShowEmojiPicker(false);
    setShowColorPicker(false);
    setEmojiSearch("");
  };

  const getColorConfig = (colorName: string) => {
    return (
      colorOptions.find((c) => c.name === colorName) ||
      colorOptions.find((c) => c.name === "Gray")!
    );
  };

  const selectEmoji = (emoji: string) => {
    setFormData({ ...formData, icon: emoji });
    setShowEmojiPicker(false);
    setEmojiSearch("");
  };

  const selectColor = (colorName: string) => {
    setFormData({ ...formData, color: colorName });
    setShowColorPicker(false);
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg"
          >
            <Tags className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
            <p className="text-xs text-gray-500">
              Manage your expense categories
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="p-2 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 p-4 bg-white rounded-xl border border-gray-100 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                <Smile className="w-3 h-3" /> Icon
              </label>
              <div className="relative" ref={emojiPickerRef}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowColorPicker(false);
                  }}
                  className="w-full px-3 py-2 text-left border border-gray-200 rounded-lg hover:border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">{formData.icon}</span>
                  <span className="text-sm text-gray-500">
                    Click to change emoji
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 top-full left-0 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
                    >
                      {/* Search bar */}
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={emojiSearch}
                            onChange={(e) => setEmojiSearch(e.target.value)}
                            placeholder="Search emojis..."
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Category tabs */}
                      {!emojiSearch && (
                        <div className="flex overflow-x-auto p-1.5 gap-1 border-b border-gray-100 scrollbar-hide">
                          {Object.keys(emojiCategories).map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => setActiveEmojiCategory(category)}
                              className={`px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                                activeEmojiCategory === category
                                  ? "bg-amber-100 text-amber-700"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Emoji grid */}
                      <div className="p-2 max-h-48 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-1">
                          {getFilteredEmojis().map((emoji, idx) => (
                            <motion.button
                              key={`${emoji}-${idx}`}
                              type="button"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => selectEmoji(emoji)}
                              className={`w-8 h-8 flex items-center justify-center text-lg rounded-lg transition-colors ${
                                formData.icon === emoji
                                  ? "bg-amber-100 ring-2 ring-amber-500"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                        {getFilteredEmojis().length === 0 && (
                          <p className="text-center text-sm text-gray-400 py-4">
                            No emojis found
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                <Palette className="w-3 h-3" /> Color Gradient
              </label>
              <div className="relative" ref={colorPickerRef}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setShowEmojiPicker(false);
                  }}
                  className="w-full px-3 py-2 text-left border border-gray-200 rounded-lg hover:border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all flex items-center gap-3"
                >
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getColorConfig(formData.color).from} ${getColorConfig(formData.color).to}`}
                  />
                  <span className="text-sm text-gray-700">
                    {formData.color}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 top-full left-0 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
                    >
                      <div className="p-3 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-2">
                          {colorOptions.map((color) => (
                            <motion.button
                              key={color.name}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => selectColor(color.name)}
                              className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                                formData.color === color.name
                                  ? "bg-amber-50 ring-2 ring-amber-500"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.from} ${color.to} shadow-sm group-hover:shadow-md transition-shadow`}
                              />
                              <span className="text-xs text-gray-600 font-medium">
                                {color.name}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelForm}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={saving || !formData.name.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingId ? (
                  <>
                    <Check className="w-4 h-4" /> Update
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {categories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center"
          >
            <Tags className="w-8 h-8 text-amber-400" />
          </motion.div>
          <p className="text-gray-500 font-medium">No custom categories</p>
          <p className="text-sm text-gray-400 mt-1">
            Create categories to organize your expenses
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {categories.map((category, index) => {
              const colorConfig = getColorConfig(category.color);
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${colorConfig.bg} flex items-center justify-center`}
                  >
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {category.name}
                    </p>
                    <div
                      className={`w-12 h-1.5 rounded-full bg-gradient-to-r ${colorConfig.from} ${colorConfig.to}`}
                    />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEditing(category)}
                      className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
