
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MaterialData {
  title: string;
  subject: string;
  file_url: string;
  description: string;
}

const MaterialsManagement = () => {
  const [material, setMaterial] = useState<MaterialData>({ title: "", subject: "", file_url: "", description: "" });
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ["study_materials"],
    queryFn: async () => {
      let { data } = await supabase.from("study_materials").select("*").order("added_at", { ascending: false });
      return data || [];
    }
  });

  const addMaterialMutation = useMutation({
    mutationFn: async (newMaterial: MaterialData) => {
      const { data, error } = await supabase.from("study_materials").insert([newMaterial]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Material added!");
      setMaterial({ title: "", subject: "", file_url: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["study_materials"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("study_materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Material deleted");
      queryClient.invalidateQueries({ queryKey: ["study_materials"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  function handleMatSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMaterialMutation.mutate(material);
  }
  function handleDeleteMaterial(id: string) {
    if (!confirm("Delete this material?")) return;
    deleteMaterialMutation.mutate(id);
  }

  return (
    <div>
      {/* Add Study Material */}
      <form className="bg-white border p-5 rounded mb-6 space-y-3" onSubmit={handleMatSubmit}>
        <h3 className="font-semibold mb-2">Add Study Material</h3>
        <Input value={material.title} name="title" onChange={e => setMaterial(m => ({ ...m, title: e.target.value }))} placeholder="Title" required />
        <Input value={material.subject} name="subject" onChange={e => setMaterial(m => ({ ...m, subject: e.target.value }))} placeholder="Subject" required />
        <Input value={material.file_url} name="file_url" onChange={e => setMaterial(m => ({ ...m, file_url: e.target.value }))} placeholder="File URL" />
        <Input value={material.description} name="description" onChange={e => setMaterial(m => ({ ...m, description: e.target.value }))} placeholder="Description" />
        <Button 
          type="submit" 
          disabled={addMaterialMutation.isPending}
          className="bg-primary hover:bg-primary/90"
        >
          {addMaterialMutation.isPending ? "Saving..." : "Add Material"}
        </Button>
      </form>
      {/* Materials List */}
      <div>
        <h3 className="font-semibold mb-4">All Study Materials ({materials.length})</h3>
        {materialsLoading ? <div>Loading...</div> : (
          <div className="border rounded overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((mat: any) => (
                  <TableRow key={mat.id}>
                    <TableCell className="font-medium">{mat.title}</TableCell>
                    <TableCell>{mat.subject}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={deleteMaterialMutation.isPending} 
                        onClick={() => handleDeleteMaterial(mat.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsManagement;
