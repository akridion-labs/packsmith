import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const notionToken = Deno.env.get("NOTION_TOKEN");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase Edge Function environment is missing project credentials.");
    }

    const authHeader = req.headers.get("Authorization") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return json({ status: "unauthorized", errors: ["Login is required to publish to Notion."] }, 401);
    }

    const { parentPageId, workspacePayload } = await req.json();

    if (!parentPageId || !workspacePayload?.workspace?.databases || !workspacePayload?.workspace?.pages) {
      return json(
        {
          status: "invalid_payload",
          errors: ["parentPageId and a Packsmith workspace payload are required."],
        },
        400,
      );
    }

    if (!notionToken) {
      return json({
        status: "contract_ready",
        createdPageIds: [],
        createdDatabaseIds: [],
        errors: ["NOTION_TOKEN is not configured on the Edge Function yet."],
        preview: {
          parentPageId,
          pageCount: workspacePayload.workspace.pages.length,
          databaseCount: workspacePayload.workspace.databases.length,
        },
      });
    }

    return json({
      status: "ready_for_notion_api_wiring",
      createdPageIds: [],
      createdDatabaseIds: [],
      errors: ["Add Notion API page/database creation calls in this Edge Function."],
      preview: {
        parentPageId,
        workspaceName: workspacePayload.workspace.name,
        pageCount: workspacePayload.workspace.pages.length,
        databaseCount: workspacePayload.workspace.databases.length,
      },
    });
  } catch (error) {
    return json({ status: "error", errors: [error.message || "Unknown Notion publish error."] }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
