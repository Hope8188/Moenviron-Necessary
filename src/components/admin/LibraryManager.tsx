import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LibraryItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
}

const EMPTY_ITEM: Omit<LibraryItem, "id" | "created_at"> = {
  title: "",
  description: "",
  file_url: "",
  thumbnail_url: "",
  category: "Resource",
  is_active: true,
};

export function LibraryManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [formData, setFormData] = useState<Omit<LibraryItem, "id" | "created_at">>(EMPTY_ITEM);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ["digital-library"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_library")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as LibraryItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<LibraryItem, "id" | "created_at">) => {
      const { error } = await supabase.from("digital_library").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-library"] });
      toast.success("Library item created successfully");
      resetForm();
    },
    onError: (error) => toast.error("Failed to create: " + error.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<LibraryItem, "id" | "created_at"> }) => {
      const { error } = await supabase.from("digital_library").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-library"] });
      toast.success("Library item updated successfully");
      resetForm();
    },
    onError: (error) => toast.error("Failed to update: " + error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("digital_library").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-library"] });
      toast.success("Library item deleted successfully");
    },
    onError: (error) => toast.error("Failed to delete: " + error.message),
  });

  const resetForm = () => {
    setFormData(EMPTY_ITEM);
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: LibraryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      file_url: item.file_url || "",
      thumbnail_url: item.thumbnail_url || "",
      category: item.category || "Resource",
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Digital Library
          </CardTitle>
          <CardDescription>Manage educational resources and documentation</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sustainable Fashion Guide"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={formData.category || ""}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Guide, Whitepaper"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_active">Active / Visible</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this resource about?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>File URL</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] text-primary"
                    onClick={async () => {
                      if (!formData.file_url) {
                        toast.error("Please enter a URL first");
                        return;
                      }
                      setIsLoadingMetadata(true);
                      try {
                        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(formData.file_url)}`);
                        const data = await response.json();
                        if (data.status === "success") {
                          setFormData({
                            ...formData,
                            title: data.data.title || formData.title,
                            description: data.data.description || formData.description,
                            thumbnail_url: data.data.image?.url || formData.thumbnail_url,
                          });
                          toast.success("Metadata fetched successfully");
                        }
                      } catch (err) {
                        toast.error("Failed to fetch metadata");
                      } finally {
                        setIsLoadingMetadata(false);
                      }
                    }}
                    disabled={isLoadingMetadata}
                  >
                    {isLoadingMetadata ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ExternalLink className="h-3 w-3 mr-1" />}
                    Auto-Fetch
                  </Button>
                </div>
                <Input
                  value={formData.file_url || ""}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="Link to PDF or document"
                />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input
                  value={formData.thumbnail_url || ""}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="Link to cover image"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingItem ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {items && items.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.category || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? "default" : "secondary"}>
                      {item.is_active ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.file_url ? (
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Link
                      </a>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-8">No library items yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
