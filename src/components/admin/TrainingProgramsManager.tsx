import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  duration: string;
  level: string;
  category: string | null;
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  "Sparkles", "Globe", "Layers", "BarChart3", "Brain", "Smartphone", "Cloud",
  "TrendingUp", "Briefcase", "Building2", "Award", "Users", "Database",
  "Code", "Shield", "Palette", "Link", "Wifi", "BarChart", "CheckCircle"
];

const levelOptions = ["Beginner", "Intermediate", "Advanced", "Beginner to Intermediate", "Intermediate to Advanced", "Beginner to Advanced"];

const categoryOptions = ["AI & ML", "Development", "Data", "Infrastructure", "Marketing", "Security", "Design", "Technology", "Business", "Quality"];

const TrainingProgramsManager = () => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Code",
    gradient: "from-blue-500 to-cyan-500",
    duration: "8-12 weeks",
    level: "Beginner to Advanced",
    category: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from("training_programs")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to fetch programs");
      console.error(error);
    } else {
      setPrograms(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const programData = {
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      gradient: formData.gradient,
      duration: formData.duration,
      level: formData.level,
      category: formData.category || null,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    if (editingProgram) {
      const { error } = await supabase
        .from("training_programs")
        .update(programData)
        .eq("id", editingProgram.id);

      if (error) {
        toast.error("Failed to update program");
        console.error(error);
      } else {
        toast.success("Program updated successfully");
        fetchPrograms();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("training_programs").insert([programData]);

      if (error) {
        toast.error("Failed to add program");
        console.error(error);
      } else {
        toast.success("Program added successfully");
        fetchPrograms();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    const { error } = await supabase.from("training_programs").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete program");
      console.error(error);
    } else {
      toast.success("Program deleted successfully");
      fetchPrograms();
    }
  };

  const handleEdit = (program: TrainingProgram) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      icon: program.icon,
      gradient: program.gradient,
      duration: program.duration,
      level: program.level,
      category: program.category || "",
      display_order: program.display_order,
      is_active: program.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "Code",
      gradient: "from-blue-500 to-cyan-500",
      duration: "8-12 weeks",
      level: "Beginner to Advanced",
      category: "",
      display_order: programs.length,
      is_active: true,
    });
    setEditingProgram(null);
    setIsDialogOpen(false);
  };

  const toggleActive = async (program: TrainingProgram) => {
    const { error } = await supabase
      .from("training_programs")
      .update({ is_active: !program.is_active })
      .eq("id", program.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchPrograms();
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Training Programs</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProgram ? "Edit Program" : "Add New Program"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="gradient">Gradient Classes</Label>
                <Input
                  id="gradient"
                  value={formData.gradient}
                  onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                  placeholder="from-purple-500 to-pink-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="8-12 weeks"
                  />
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingProgram ? "Update" : "Add"} Program
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>{program.display_order}</TableCell>
                  <TableCell className="font-medium">{program.title}</TableCell>
                  <TableCell>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded">{program.category || "-"}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{program.duration}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      program.level.includes('Advanced') ? 'bg-purple-500/10 text-purple-400' :
                      program.level.includes('Intermediate') ? 'bg-blue-500/10 text-blue-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>{program.level}</span>
                  </TableCell>
                  <TableCell>
                    <Switch checked={program.is_active} onCheckedChange={() => toggleActive(program)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(program)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(program.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingProgramsManager;
