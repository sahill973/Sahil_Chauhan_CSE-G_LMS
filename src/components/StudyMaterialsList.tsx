
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StudyMaterialsList = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["study_materials"],
    queryFn: async () => {
      let { data } = await supabase.from("study_materials").select("*").order("added_at", { ascending: false });
      return data || [];
    }
  });

  if (isLoading) return <div>Loading study materials...</div>;
  if (!data?.length) return <div className="text-muted-foreground">No study materials available.</div>;

  return (
    <ul className="space-y-3">
      {data.map((mat: any) => (
        <li key={mat.id} className="border p-3 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <span className="font-semibold">{mat.title}</span> — {mat.subject}
          </div>
          {mat.file_url && <a href={mat.file_url} target="_blank" rel="noreferrer" className="underline text-blue-600 text-sm">Download</a>}
        </li>
      ))}
    </ul>
  );
};
export default StudyMaterialsList;
