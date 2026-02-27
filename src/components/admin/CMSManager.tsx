import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, FileJson, Image, Type, Code, Plus, Trash2, Search, Settings, Globe } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentField {
  key: string;
  type: "text" | "textarea" | "image" | "array" | "number" | "boolean";
  label: string;
}

const KNOWN_SECTIONS: Record<string, ContentField[]> = {
  "home/hero": [
    { key: "badge", type: "text", label: "Hero Badge" },
    { key: "headline", type: "textarea", label: "Headline (HTML supported)" },
    { key: "subheadline", type: "textarea", label: "Subheadline" },
    { key: "cta_primary_text", type: "text", label: "Primary CTA Text" },
    { key: "cta_primary_link", type: "text", label: "Primary CTA Link" },
    { key: "cta_secondary_text", type: "text", label: "Secondary CTA Text" },
    { key: "cta_secondary_link", type: "text", label: "Secondary CTA Link" },
    { key: "video_url", type: "text", label: "Background Video URL" },
    { key: "poster_url", type: "image", label: "Video Poster Image" },
  ],
  "home/impact-counter": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "subtitle", type: "textarea", label: "Section Subtitle" },
    { key: "stats", type: "array", label: "Stats (JSON array of {value, label, icon})" },
  ],
  "home/how-it-works": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "subtitle", type: "textarea", label: "Section Subtitle" },
    { key: "steps", type: "array", label: "Steps (JSON array of {icon, title, description})" },
  ],
  "home/impact-collage": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "subtitle", type: "textarea", label: "Section Subtitle" },
    { key: "images", type: "array", label: "Images (JSON array of {url, title, subtitle, size})" },
  ],
  "home/sdg-badges": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "subtitle", type: "textarea", label: "Section Subtitle" },
    { key: "badges", type: "array", label: "Badges (JSON array of {number, title, color, description, icon})" },
  ],
  "home/partner-cta": [
    { key: "title", type: "text", label: "Title" },
    { key: "description", type: "textarea", label: "Description" },
    { key: "cta_text", type: "text", label: "Button Text" },
    { key: "cta_link", type: "text", label: "Button Link" },
    { key: "image", type: "image", label: "Background Image" },
  ],
  "home/featured-products": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "subtitle", type: "text", label: "Section Subtitle" },
  ],
  "home/features": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "subtitle", type: "textarea", label: "Section Subtitle" },
    { key: "features", type: "array", label: "Features (JSON array of {icon, title, description})" },
  ],
  "home/about": [
    { key: "title", type: "text", label: "Title" },
    { key: "description", type: "textarea", label: "Description" },
    { key: "image", type: "image", label: "About Image" },
  ],
  "global/footer": [
    { key: "tagline", type: "textarea", label: "Footer Tagline" },
    { key: "address", type: "textarea", label: "Office Address" },
    { key: "email", type: "text", label: "Contact Email" },
    { key: "phone", type: "text", label: "Contact Phone" },
    { key: "social_links", type: "array", label: "Social Links (JSON array of {platform, url})" },
    { key: "copyright", type: "text", label: "Copyright Text" },
  ],
  "global/settings": [
    { key: "siteName", type: "text", label: "Site Name" },
    { key: "logoUrl", type: "image", label: "Logo URL" },
    { key: "contactEmail", type: "text", label: "Contact Email" },
    { key: "contactPhone", type: "text", label: "Contact Phone" },
    { key: "address", type: "textarea", label: "Address" },
    { key: "footerText", type: "textarea", label: "Footer Tagline" },
  ],
  "global/navigation": [
    { key: "links", type: "array", label: "Navigation Links (JSON array of {label, href})" },
  ],
  "global/social": [
    { key: "facebook", type: "text", label: "Facebook URL" },
    { key: "instagram", type: "text", label: "Instagram URL" },
    { key: "twitter", type: "text", label: "Twitter/X URL" },
    { key: "linkedin", type: "text", label: "LinkedIn URL" },
    { key: "tiktok", type: "text", label: "TikTok URL" },
  ],
  "global/seo": [
    { key: "title", type: "text", label: "Default Page Title" },
    { key: "description", type: "textarea", label: "Meta Description" },
    { key: "keywords", type: "text", label: "Keywords (comma separated)" },
  ],
  "global/newsletter": [
    { key: "title", type: "text", label: "Newsletter Title" },
    { key: "subtitle", type: "textarea", label: "Newsletter Subtitle" },
    { key: "cta_text", type: "text", label: "Button Text" },
    { key: "discount_text", type: "text", label: "Discount/Incentive Text" },
  ],
  "global/email-templates": [
    { key: "order_confirmation", type: "array", label: "Order Confirmation (JSON {subject, greeting})" },
    { key: "order_shipped", type: "array", label: "Order Shipped (JSON {subject, greeting})" },
    { key: "order_delivered", type: "array", label: "Order Delivered (JSON {subject, greeting})" },
    { key: "welcome", type: "array", label: "Welcome Email (JSON {subject, greeting})" },
  ],
  "about/hero": [
    { key: "title", type: "text", label: "Page Title" },
    { key: "subtitle", type: "textarea", label: "Page Subtitle" },
  ],
  "about/story": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "content", type: "textarea", label: "Story Content" },
    { key: "image", type: "image", label: "Story Image" },
  ],
  "about/team": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "members", type: "array", label: "Team Members (JSON array of {name, role, image, bio})" },
  ],
  "about/values": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "values", type: "array", label: "Values (JSON array of {title, description})" },
  ],
  "contact/hero": [
    { key: "title", type: "text", label: "Page Title" },
    { key: "subtitle", type: "textarea", label: "Page Subtitle" },
  ],
  "contact/info": [
    { key: "email", type: "text", label: "Contact Email" },
    { key: "phone", type: "text", label: "Contact Phone" },
    { key: "address", type: "textarea", label: "Office Address" },
    { key: "hours", type: "text", label: "Business Hours" },
  ],
  "shop/hero": [
    { key: "title", type: "text", label: "Page Title" },
    { key: "subtitle", type: "textarea", label: "Page Subtitle" },
  ],
  "shop/categories": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "categories", type: "array", label: "Categories (JSON array of {name, image, link})" },
  ],
  "impact/hero": [
    { key: "title", type: "text", label: "Page Title" },
    { key: "subtitle", type: "textarea", label: "Page Subtitle" },
  ],
  "impact/metrics": [
    { key: "title", type: "text", label: "Section Title" },
    { key: "description", type: "textarea", label: "Section Description" },
  ],
  "faq/hero": [
    { key: "title", type: "text", label: "Page Title" },
    { key: "subtitle", type: "textarea", label: "Page Subtitle" },
  ],
  "faq/questions": [
    { key: "questions", type: "array", label: "FAQ Items (JSON array of {question, answer})" },
  ],
  "privacy/content": [
    { key: "title", type: "text", label: "Page Title" },
    { key: "last_updated", type: "text", label: "Last Updated Date" },
    { key: "content", type: "textarea", label: "Privacy Policy Content" },
  ],
  "terms/content": [
    { key: "title", type: "text", label: "Page Title" },
    { key: "last_updated", type: "text", label: "Last Updated Date" },
    { key: "content", type: "textarea", label: "Terms of Service Content" },
  ],
};

interface SiteContent {
  id: string;
  page_name: string;
  section_key: string;
  content: Record<string, unknown>;
  updated_at?: string;
}

// Helper to parse content which might be string or object
const parseContent = (content: unknown): Record<string, unknown> => {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch {
      return {};
    }
  }
  return (content as Record<string, unknown>) || {};
};

export function CMSManager() {
  const queryClient = useQueryClient();
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [jsonContent, setJsonContent] = useState<string>("");
  const [formContent, setFormContent] = useState<Record<string, unknown>>({});
  const [editMode, setEditMode] = useState<"form" | "json">("form");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSection, setNewSection] = useState({ page: "", section: "" });

  const [selectedPage, setSelectedPage] = useState<string>("all");

  const { data: allContent, isLoading } = useQuery({
    queryKey: ["admin-cms-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("page_name", { ascending: true })
        .order("section_key", { ascending: true });
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        content: parseContent(item.content),
      })) as SiteContent[];
    },
  });

  const selectedItem = allContent?.find((c) => c.id === selectedContentId);
  const sectionKey = selectedItem ? `${selectedItem.page_name}/${selectedItem.section_key}` : "";
  const knownFields = KNOWN_SECTIONS[sectionKey];

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: Record<string, unknown> }) => {
      const { error } = await supabase
        .from("site_content")
        .update({ content: JSON.stringify(content), updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cms-all"] });
      queryClient.invalidateQueries({ queryKey: ["cms-content"] });
      toast.success("Content updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update content: " + error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({ page, section }: { page: string; section: string }) => {
      const { error } = await supabase
        .from("site_content")
        .insert({ page_name: page, section_key: section, content: JSON.stringify({}) });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cms-all"] });
      setIsCreateDialogOpen(false);
      setNewSection({ page: "", section: "" });
      toast.success("New section created");
    },
    onError: (error: Error) => {
      toast.error("Failed to create section: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cms-all"] });
      setSelectedContentId("");
      toast.success("Section deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete section: " + error.message);
    },
  });

  const handleSelect = (id: string) => {
    const item = allContent?.find((c) => c.id === id);
    if (item) {
      setSelectedContentId(id);
      setJsonContent(JSON.stringify(item.content, null, 2));
      setFormContent(item.content || {});
    }
  };

  const handleFormFieldChange = (key: string, value: unknown) => {
    const updated = { ...formContent, [key]: value };
    setFormContent(updated);
    setJsonContent(JSON.stringify(updated, null, 2));
  };

  const handleSave = () => {
    try {
      const contentToSave = editMode === "json" ? JSON.parse(jsonContent) : formContent;
      updateMutation.mutate({ id: selectedContentId, content: contentToSave });
    } catch (e) {
      toast.error("Invalid JSON format");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this section? This cannot be undone.")) {
      deleteMutation.mutate(selectedContentId);
    }
  };

  useEffect(() => {
    if (editMode === "json" && selectedContentId && jsonContent) {
      try {
        const parsed = JSON.parse(jsonContent);
        setFormContent(parsed);
      } catch (e) {
        // Silently fail parsing while typing
      }
    }
  }, [jsonContent, editMode, selectedContentId]);

  const pages = Array.from(new Set(allContent?.map(item => item.page_name) || []));

  const filteredContent = allContent?.filter(item => {
    const matchesSearch = item.page_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section_key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPage = selectedPage === "all" || item.page_name === selectedPage;
    return matchesSearch && matchesPage;
  });

  const renderFormField = (field: ContentField) => {
    const value = (formContent[field.key] as string | number | boolean | unknown[]) ?? "";

    switch (field.type) {
      case "image":
        return (
          <ImageUploader
            key={field.key}
            label={field.label}
            currentUrl={value as string}
            onUpload={(url) => handleFormFieldChange(field.key, url)}
          />
        );
      case "textarea":
        return (
          <div key={field.key} className="space-y-2">
            <Label>{field.label}</Label>
            <Textarea
              value={value as string}
              onChange={(e) => handleFormFieldChange(field.key, e.target.value)}
              rows={4}
            />
          </div>
        );
      case "number":
        return (
          <div key={field.key} className="space-y-2">
            <Label>{field.label}</Label>
            <Input
              type="number"
              value={value as number}
              onChange={(e) => handleFormFieldChange(field.key, parseFloat(e.target.value))}
            />
          </div>
        );
      case "boolean":
        return (
          <div key={field.key} className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id={field.key}
              checked={!!value}
              onChange={(e) => handleFormFieldChange(field.key, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor={field.key}>{field.label}</Label>
          </div>
        );
      case "array":
        return (
          <div key={field.key} className="space-y-2">
            <Label>{field.label}</Label>
            <Textarea
              value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value as string}
              onChange={(e) => {
                try {
                  handleFormFieldChange(field.key, JSON.parse(e.target.value));
                } catch (err) {
                  handleFormFieldChange(field.key, e.target.value);
                }
              }}
              className="font-mono text-xs"
              rows={6}
            />
          </div>
        );
      default:
        return (
          <div key={field.key} className="space-y-2">
            <Label>{field.label}</Label>
            <Input
              value={value as string}
              onChange={(e) => handleFormFieldChange(field.key, e.target.value)}
            />
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Sidebar: Content List */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">CMS Sections</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Section</DialogTitle>
                  <DialogDescription>Add a new editable section to your site.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Page Name (e.g., home, global, contact)</Label>
                    <Input
                      placeholder="home"
                      value={newSection.page}
                      onChange={(e) => setNewSection({ ...newSection, page: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Key (e.g., hero, features, footer)</Label>
                    <Input
                      placeholder="hero"
                      value={newSection.section}
                      onChange={(e) => setNewSection({ ...newSection, section: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => createMutation.mutate(newSection)}
                    disabled={!newSection.page || !newSection.section || createMutation.isPending}
                  >
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Create Section
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Pages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pages</SelectItem>
                {pages.map(page => (
                  <SelectItem key={page} value={page}>{page}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                className="pl-8 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 border-t max-h-[600px] overflow-y-auto">
          <div className="flex flex-col">
            {filteredContent?.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex flex-col items-start px-4 py-3 text-left transition-colors hover:bg-muted/50 border-b border-border/50 ${selectedContentId === item.id ? "bg-primary/5 border-l-4 border-l-primary" : ""
                  }`}
              >
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.page_name === 'global' ? <Globe className="h-3 w-3" /> : <FileJson className="h-3 w-3" />}
                  {item.page_name}
                </span>
                <span className="text-sm font-medium mt-0.5">{item.section_key}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content: Editor */}
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle>Content Editor</CardTitle>
              {selectedItem?.page_name === 'global' && <Settings className="h-4 w-4 text-primary" />}
            </div>
            <CardDescription>
              {selectedItem ? (
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {selectedItem.page_name}/{selectedItem.section_key}
                </span>
              ) : "Select a section from the list to begin editing."}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {selectedContentId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!selectedContentId || updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {!selectedContentId ? (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/5 text-muted-foreground">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Settings className="h-10 w-10 text-primary opacity-50" />
              </div>
              <h3 className="text-lg font-medium">No Section Selected</h3>
              <p className="max-w-xs text-center mt-2">
                Choose a page section from the sidebar to manage its text, images, and settings.
              </p>
            </div>
          ) : (
            <Tabs value={editMode} onValueChange={(v) => setEditMode(v as "form" | "json")} className="space-y-6">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="form" className="gap-2 px-4">
                  <Type className="h-4 w-4" />
                  Visual Editor
                </TabsTrigger>
                <TabsTrigger value="json" className="gap-2 px-4">
                  <Code className="h-4 w-4" />
                  JSON Editor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {knownFields ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6 md:col-span-1">
                      {knownFields.filter((_, i) => i % 2 === 0).map(renderFormField)}
                    </div>
                    <div className="space-y-6 md:col-span-1">
                      {knownFields.filter((_, i) => i % 2 !== 0).map(renderFormField)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/10 flex items-start gap-3">
                      <Settings className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-primary">Dynamic Field Recognition</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          This section's structure is learned dynamically from the database.
                          If you need to add a new field (e.g., a new image or text block), switch to the <strong>JSON Editor</strong> tab, add it there, and save. It will then appear here as a form field.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {Object.entries(formContent).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label className="capitalize text-xs font-semibold tracking-wide text-muted-foreground">{key.replace(/_/g, " ")}</Label>
                          {typeof value === "string" && (value.startsWith("http") || value.includes("supabase")) ? (
                            <ImageUploader
                              currentUrl={value}
                              onUpload={(url) => handleFormFieldChange(key, url)}
                            />
                          ) : typeof value === "string" && value.length > 100 ? (
                            <Textarea
                              value={value}
                              onChange={(e) => handleFormFieldChange(key, e.target.value)}
                              rows={4}
                            />
                          ) : typeof value === "string" ? (
                            <Input
                              value={value}
                              onChange={(e) => handleFormFieldChange(key, e.target.value)}
                            />
                          ) : typeof value === "number" ? (
                            <Input
                              type="number"
                              value={value}
                              onChange={(e) => handleFormFieldChange(key, parseFloat(e.target.value))}
                            />
                          ) : typeof value === "boolean" ? (
                            <div className="flex items-center gap-2 py-2">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleFormFieldChange(key, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm">Enabled</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Textarea
                                value={JSON.stringify(value, null, 2)}
                                onChange={(e) => {
                                  try {
                                    handleFormFieldChange(key, JSON.parse(e.target.value));
                                  } catch (err) {
                                    // Silently fail parsing
                                  }
                                }}
                                className="font-mono text-[10px] bg-muted/30"
                                rows={6}
                              />
                              <p className="text-[10px] text-muted-foreground italic text-right">JSON Object</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="json" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                    <span>Editor Mode: Raw JSON</span>
                    <span>Valid JSON Required</span>
                  </div>
                  <Textarea
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    className="min-h-[500px] font-mono text-sm leading-relaxed border-2 focus-visible:ring-primary"
                    placeholder="{ 'key': 'value' }"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
