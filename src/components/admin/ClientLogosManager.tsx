import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { toast } from "sonner";

interface ClientLogo {
  id: string;
  name: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const ClientLogosManager = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    const { data, error } = await supabase
      .from("client_logos")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Failed to fetch client logos");
      console.error(error);
    } else {
      setLogos(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const logoData = {
      name: formData.name,
      image_url: formData.image_url,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    if (editingLogo) {
      const { error } = await supabase
        .from("client_logos")
        .update(logoData)
        .eq("id", editingLogo.id);

      if (error) {
        toast.error("Failed to update logo");
        console.error(error);
      } else {
        toast.success("Logo updated successfully");
        fetchLogos();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("client_logos").insert([logoData]);

      if (error) {
        toast.error("Failed to add logo");
        console.error(error);
      } else {
        toast.success("Logo added successfully");
        fetchLogos();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this logo?")) return;

    const { error } = await supabase.from("client_logos").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete logo");
      console.error(error);
    } else {
      toast.success("Logo deleted successfully");
      fetchLogos();
    }
  };

  const handleEdit = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name,
      image_url: logo.image_url,
      display_order: logo.display_order,
      is_active: logo.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      image_url: "",
      display_order: logos.length,
      is_active: true,
    });
    setEditingLogo(null);
    setIsDialogOpen(false);
  };

  const toggleActive = async (logo: ClientLogo) => {
    const { error } = await supabase
      .from("client_logos")
      .update({ is_active: !logo.is_active })
      .eq("id", logo.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      fetchLogos();
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Client Logos</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Logo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLogo ? "Edit Logo" : "Add New Logo"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://... or /src/assets/clients/..."
                  required
                />
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
                  {editingLogo ? "Update" : "Add"} Logo
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
                <TableHead>Preview</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logos.map((logo) => (
                <TableRow key={logo.id}>
                  <TableCell>{logo.display_order}</TableCell>
                  <TableCell>
                    <div className="w-16 h-10 bg-secondary rounded flex items-center justify-center overflow-hidden">
                      {logo.image_url ? (
                        <img src={logo.image_url} alt={logo.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Image className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{logo.name}</TableCell>
                  <TableCell>
                    <Switch checked={logo.is_active} onCheckedChange={() => toggleActive(logo)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(logo)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(logo.id)} className="text-destructive">
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

export default ClientLogosManager;
