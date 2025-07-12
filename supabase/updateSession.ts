
import { supabase } from "@/integrations/supabase/client";

export async function updateSession(id: string, sceneId: string) {
  const { error } = await supabase
    .from("sessions")
    .update({ 
      current_scene_id: sceneId,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);
  
  if (error) throw error;
}
