"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Category } from "@/types/Product";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create category");
      }

      toast.success("Category created successfully");
      setIsAddDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?._id) return;

    try {
      const response = await fetch(
        `/api/admin/categories/${editingCategory._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update category");

      toast.success("Category updated successfully");
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!deleteCategoryId) return;

    try {
      const response = await fetch(
        `/api/admin/categories/${deleteCategoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete category");

      toast.success("Category deleted successfully");
      setDeleteCategoryId(null);
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--color-primaria)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primaria)]">
            Categories
          </h1>
          <p className="text-[var(--color-primaria)]/60">
            Organize your products into categories
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--color-secondaria)] text-[var(--color-primaria)] hover:bg-[var(--color-secondaria)]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[var(--color-primaria)]">
                Add New Category
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[var(--color-primaria)]">
                  Category Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="border-[var(--color-primaria)]/20"
                  placeholder="e.g., Electronics, Clothing"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-[var(--color-primaria)]"
                >
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="border-[var(--color-primaria)]/20"
                  placeholder="Brief description of this category"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-[var(--color-primaria)]/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[var(--color-secondaria)] text-[var(--color-primaria)] hover:bg-[var(--color-secondaria)]/90"
                >
                  Create Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card
            key={category._id}
            className="border-[var(--color-primaria)]/20 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-secondaria)]/10">
                    <Tag className="h-5 w-5 text-[var(--color-secondaria)]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[var(--color-primaria)]">
                      {category.name}
                    </CardTitle>
                    <p className="text-xs text-[var(--color-primaria)]/60 mt-1">
                      /{category.slug}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.description && (
                <p className="text-sm text-[var(--color-primaria)]/70 line-clamp-2">
                  {category.description}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(category)}
                  className="flex-1 border-[var(--color-primaria)]/20 hover:bg-[var(--color-primaria)]/5"
                >
                  <Pencil className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteCategoryId(category._id!)}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 mx-auto text-[var(--color-primaria)]/20 mb-4" />
          <p className="text-[var(--color-primaria)]/60">
            No categories yet. Create your first category to get started.
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[var(--color-primaria)]">
              Edit Category
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="edit-name"
                className="text-[var(--color-primaria)]"
              >
                Category Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="border-[var(--color-primaria)]/20"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-description"
                className="text-[var(--color-primaria)]"
              >
                Description (Optional)
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="border-[var(--color-primaria)]/20"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-[var(--color-primaria)]/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[var(--color-secondaria)] text-[var(--color-primaria)] hover:bg-[var(--color-secondaria)]/90"
              >
                Update Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteCategoryId}
        onOpenChange={() => setDeleteCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--color-primaria)]">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category. Products in this category will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--color-primaria)]/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
