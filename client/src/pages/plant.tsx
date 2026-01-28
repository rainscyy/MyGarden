import { useState, useMemo } from "react";
import { useData } from "@/hooks/use-data";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Plus, Trash2, Clock, CheckCircle, XCircle, Filter } from "lucide-react";
import type { Session } from "@shared/schema";

export default function Plant() {
  const { categories, sessions, addSession, deleteSession, loading } = useData();
  const { toast } = useToast();
  const [location] = useLocation();
  
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialCategory = searchParams.get("category") || "all";
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterStatus, setFilterStatus] = useState<"all" | "done" | "failed">("all");
  
  const [formTitle, setFormTitle] = useState("");
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || "");
  const [formMinutes, setFormMinutes] = useState("30");
  const [formStatus, setFormStatus] = useState<"done" | "failed">("done");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => filterCategory === "all" || s.categoryId === filterCategory)
      .filter((s) => filterStatus === "all" || s.status === filterStatus)
      .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
  }, [sessions, filterCategory, filterStatus]);

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  const handleAddSession = () => {
    if (!formTitle.trim()) {
      toast({ title: "Error", description: "Session title is required", variant: "destructive" });
      return;
    }
    if (!formCategoryId) {
      toast({ title: "Error", description: "Please select a category", variant: "destructive" });
      return;
    }
    const minutes = parseInt(formMinutes, 10);
    if (isNaN(minutes) || minutes <= 0) {
      toast({ title: "Error", description: "Please enter valid minutes", variant: "destructive" });
      return;
    }

    addSession(formCategoryId, formTitle.trim(), minutes, formStatus, formDate);
    toast({
      title: "Session Added",
      description: `"${formTitle}" has been recorded`,
    });
    
    setFormTitle("");
    setFormMinutes("30");
    setFormStatus("done");
    setFormDate(new Date().toISOString().split("T")[0]);
    setIsAddOpen(false);
  };

  const handleDeleteSession = (session: Session) => {
    deleteSession(session.id);
    toast({ title: "Deleted", description: "Session has been removed" });
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
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Plant</h1>
            <p className="text-muted-foreground">Tasks & Focus Sessions</p>
          </div>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-session" disabled={categories.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Focus Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What did you work on?"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  data-testid="input-session-title"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} data-testid={`category-option-${cat.id}`}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes Focused</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="1"
                    value={formMinutes}
                    onChange={(e) => setFormMinutes(e.target.value)}
                    data-testid="input-minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formStatus} onValueChange={(v) => setFormStatus(v as "done" | "failed")}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  data-testid="input-date"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAddSession}
                data-testid="button-save-session"
              >
                Save Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Leaf className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-4 text-muted-foreground">
              You need to create categories first before adding sessions.
            </p>
            <Button asChild>
              <a href="/garden" data-testid="link-go-to-garden">Go to Garden</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-48 space-y-2">
                  <Label>Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger data-testid="filter-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-48 space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as "all" | "done" | "failed")}>
                    <SelectTrigger data-testid="filter-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions ({filteredSessions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Leaf className="mb-4 h-10 w-10 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No sessions found with the current filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session) => {
                    const category = getCategoryById(session.categoryId);
                    return (
                      <div
                        key={session.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                        data-testid={`session-row-${session.id}`}
                      >
                        <div
                          className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category?.color || "#ccc" }}
                        >
                          {session.status === "done" ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <XCircle className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium truncate">{session.title}</span>
                            <Badge variant={session.status === "done" ? "default" : "destructive"}>
                              {session.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: category?.color }}
                              />
                              {category?.name || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.minutesFocused} min
                            </span>
                            <span>{new Date(session.dateISO).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSession(session)}
                          data-testid={`button-delete-session-${session.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
