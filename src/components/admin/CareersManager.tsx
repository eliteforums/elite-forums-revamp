import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, GripVertical, X, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Career {
  id: string;
  title: string;
  department: string | null;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  is_active: boolean;
  display_order: number;
}

const CareersManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "Remote",
    type: "Full-time",
    description: "",
    requirements: "",
    is_active: true,
  });

  const { data: careers, isLoading } = useQuery({
    queryKey: ["admin-careers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("careers")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Career[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCareer: Omit<Career, "id" | "display_order">) => {
      const maxOrder = careers?.reduce((max, c) => Math.max(max, c.display_order), 0) || 0;
      const { data, error } = await supabase
        .from("careers")
        .insert({ ...newCareer, display_order: maxOrder + 1 })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-careers"] });
      toast({ title: "Career added successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error adding career", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (career: Partial<Career> & { id: string }) => {
      const { data, error } = await supabase
        .from("careers")
        .update(career)
        .eq("id", career.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-careers"] });
      toast({ title: "Career updated successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error updating career", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("careers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-careers"] });
      toast({ title: "Career deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting career", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "Remote",
      type: "Full-time",
      description: "",
      requirements: "",
      is_active: true,
    });
    setEditingCareer(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title,
      department: career.department || "",
      location: career.location,
      type: career.type,
      description: career.description,
      requirements: career.requirements?.join("\n") || "",
      is_active: career.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const requirementsArray = formData.requirements
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const careerData = {
      title: formData.title,
      department: formData.department || null,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      requirements: requirementsArray,
      is_active: formData.is_active,
    };

    if (editingCareer) {
      updateMutation.mutate({ ...careerData, id: editingCareer.id });
    } else {
      createMutation.mutate(careerData);
    }
  };

  const toggleActive = (career: Career) => {
    updateMutation.mutate({ id: career.id, is_active: !career.is_active });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Manage Careers
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Career
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCareer ? "Edit Career" : "Add New Career"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Engineering"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Remote, Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Input
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Full-time, Internship"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Job description..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Requirements (one per line)</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Bachelor's degree in CS&#10;3+ years experience&#10;Strong communication skills"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active (visible on website)</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.title || !formData.description}>
                  {editingCareer ? "Update" : "Create"} Career
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {careers?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No career listings yet. Add your first job posting!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {careers?.map((career) => (
              <div
                key={career.id}
                className={`flex items-start gap-4 p-4 border rounded-lg ${
                  !career.is_active ? "opacity-60 bg-muted/50" : ""
                }`}
              >
                <GripVertical className="w-5 h-5 text-muted-foreground mt-1 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold">{career.title}</h4>
                    {career.department && (
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                        {career.department}
                      </span>
                    )}
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {career.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{career.location}</p>
                  <p className="text-sm mt-2 line-clamp-2">{career.description}</p>
                  {career.requirements?.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {career.requirements.length} requirements
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={career.is_active}
                    onCheckedChange={() => toggleActive(career)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(career)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(career.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareersManager;
