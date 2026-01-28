import { useState } from "react";
import { useData } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Flower2, Plus, Pencil, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import type { Category } from "@shared/schema";
import gardenImage from "@assets/image_1769584073562.png";

const PRESET_COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

export default function Garden() {
  const { categories, getCategoryStats, addCategory, updateCategory, deleteCategory, loading } = useData();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);

  const categoryStats = getCategoryStats();

  const handleAddCategory = () => {
    if (!formName.trim()) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }
    addCategory(formName.trim(), formColor);
    toast({ title: "Success", description: "Category created successfully" });
    setFormName("");
    setFormColor(PRESET_COLORS[0]);
    setIsAddOpen(false);
  };

  const handleEditCategory = () => {
    if (!editingCategory || !formName.trim()) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }
    updateCategory(editingCategory.id, formName.trim(), formColor);
    toast({ title: "Success", description: "Category updated successfully" });
    setEditingCategory(null);
    setFormName("");
    setFormColor(PRESET_COLORS[0]);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    deleteCategory(id);
    toast({ title: "Deleted", description: `Category "${name}" has been deleted` });
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormColor(category.color);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Flower2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Garden</h1>
            <p className="text-muted-foreground">Manage your categories</p>
          </div>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-category">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Health, Work, Learning"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  data-testid="input-category-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-md border-2 transition-all ${
                        formColor === color ? "border-foreground scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormColor(color)}
                      type="button"
                      data-testid={`color-${color.replace("#", "")}`}
                    />
                  ))}
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleAddCategory}
                data-testid="button-save-category"
              >
                Create Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="flex justify-center p-4">
          <img
            src={gardenImage}
            alt="Academic Garden illustration"
            className="w-full max-w-sm h-auto rounded-lg"
            data-testid="img-garden-hero"
          />
        </CardContent>
      </Card>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Flower2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-4 text-muted-foreground">
              No categories yet. Create your first category to start tracking!
            </p>
            <Button onClick={() => setIsAddOpen(true)} data-testid="button-create-first-category">
              <Plus className="mr-2 h-4 w-4" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryStats.map((stat) => (
            <Card key={stat.category.id} className="overflow-visible" data-testid={`category-card-${stat.category.id}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-10 w-10 shrink-0 rounded-lg"
                    style={{ backgroundColor: stat.category.color }}
                  />
                  <div className="min-w-0">
                    <CardTitle className="text-lg truncate">{stat.category.name}</CardTitle>
                    <Badge
                      variant={stat.status === "healthy" ? "default" : "secondary"}
                      className="mt-1 text-xs"
                    >
                      {stat.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(stat.category)}
                    data-testid={`button-edit-${stat.category.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(stat.category.id, stat.category.name)}
                    data-testid={`button-delete-${stat.category.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">Last 7 days stats:</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-muted p-2">
                    <Clock className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                    <div className="text-lg font-semibold">{stat.totalMinutes}</div>
                    <div className="text-xs text-muted-foreground">min</div>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <CheckCircle className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <div className="text-lg font-semibold">{stat.doneCount}</div>
                    <div className="text-xs text-muted-foreground">done</div>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <XCircle className="mx-auto mb-1 h-4 w-4 text-destructive" />
                    <div className="text-lg font-semibold">{stat.failedCount}</div>
                    <div className="text-xs text-muted-foreground">failed</div>
                  </div>
                </div>
                <Link href={`/plant?category=${stat.category.id}`}>
                  <Button variant="outline" className="w-full" data-testid={`button-view-sessions-${stat.category.id}`}>
                    View Sessions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                data-testid="input-edit-category-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-md border-2 transition-all ${
                      formColor === color ? "border-foreground scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormColor(color)}
                    type="button"
                  />
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleEditCategory}
              data-testid="button-update-category"
            >
              Update Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
