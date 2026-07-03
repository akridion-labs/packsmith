import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const notionVersion = "2022-06-28";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PacksmithProperty = {
  name: string;
  type: string;
  options?: string[];
};

type PacksmithDatabase = {
  id: string;
  name: string;
  properties: PacksmithProperty[];
  sampleRecords?: Record<string, unknown>[];
};

type PacksmithPage = {
  id: string;
  title: string;
  purpose?: string;
  blocks?: string[];
  database?: string;
};

type WorkspacePayload = {
  workspace?: {
    name?: string;
    parentPage?: {
      title?: string;
      sections?: string[];
    };
    pages?: PacksmithPage[];
    databases?: PacksmithDatabase[];
  };
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
    const workspace = (workspacePayload as WorkspacePayload)?.workspace;

    if (!parentPageId || !workspace?.databases || !workspace?.pages) {
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
        status: "missing_notion_secret",
        createdPageIds: [],
        createdDatabaseIds: [],
        errors: ["NOTION_TOKEN is not configured on the Edge Function yet."],
        preview: {
          parentPageId,
          pageCount: workspace.pages.length,
          databaseCount: workspace.databases.length,
        },
      });
    }

    const rootPage = await notionRequest(notionToken, "/pages", {
      parent: { page_id: parentPageId },
      properties: {
        title: titleValue(workspace.name || workspace.parentPage?.title || "Packsmith Workspace"),
      },
      children: introBlocks(workspace.parentPage?.sections || []),
    });

    const createdPageIds: Array<{ name: string; id: string }> = [
      { name: workspace.name || "Packsmith Workspace", id: rootPage.id },
    ];
    const createdDatabaseIds: Array<{ name: string; id: string }> = [];
    const warnings: string[] = [];
    const databaseIdByKey = new Map<string, string>();
    const relationTargetIds = new Map<string, string>();

    for (const database of workspace.databases) {
      try {
        const createdDatabase = await notionRequest(notionToken, "/databases", {
          parent: { page_id: rootPage.id },
          title: [{ type: "text", text: { content: database.name } }],
          properties: buildDatabaseProperties(database.properties, warnings, database.name, relationTargetIds),
        });

        databaseIdByKey.set(database.id, createdDatabase.id);
        registerRelationTargets(relationTargetIds, database, createdDatabase.id);
        createdDatabaseIds.push({ name: database.name, id: createdDatabase.id });

        for (const record of database.sampleRecords || []) {
          const createdRecord = await notionRequest(notionToken, "/pages", {
            parent: { database_id: createdDatabase.id },
            properties: buildRecordProperties(database.properties, record, relationTargetIds),
          });
          createdPageIds.push({ name: `${database.name} sample`, id: createdRecord.id });
        }
      } catch (error) {
        warnings.push(`${database.name}: ${errorMessage(error, "database creation failed")}`);
      }
    }

    for (const page of workspace.pages) {
      if (page.database) {
        const linkedDatabaseId = databaseIdByKey.get(page.database);
        if (!linkedDatabaseId) warnings.push(`${page.title}: referenced database was not created.`);
        continue;
      }

      try {
        const createdPage = await notionRequest(notionToken, "/pages", {
          parent: { page_id: rootPage.id },
          properties: {
            title: titleValue(page.title),
          },
          children: pageBlocks(page),
        });
        createdPageIds.push({ name: page.title, id: createdPage.id });
      } catch (error) {
        warnings.push(`${page.title}: ${errorMessage(error, "page creation failed")}`);
      }
    }

    return json({
      status: warnings.length ? "partial_success" : "published",
      createdPageIds,
      createdDatabaseIds,
      errors: warnings,
      preview: {
        parentPageId,
        workspaceName: workspace.name,
        pageCount: createdPageIds.length,
        databaseCount: createdDatabaseIds.length,
      },
    });
  } catch (error) {
    return json({ status: "error", errors: [errorMessage(error, "Unknown Notion publish error.")] }, 500);
  }
});

async function notionRequest(token: string, path: string, body: Record<string, unknown>) {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": notionVersion,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `Notion API request failed with ${response.status}`);
  }
  return data;
}

function buildDatabaseProperties(
  properties: PacksmithProperty[],
  warnings: string[],
  databaseName: string,
  relationTargetIds: Map<string, string>,
) {
  const result: Record<string, unknown> = {};
  const hasTitle = properties.some((property) => property.type === "title");

  for (const property of properties) {
    result[property.name] = databaseProperty(property, warnings, databaseName, relationTargetIds);
  }

  if (!hasTitle) result.Name = { title: {} };
  return result;
}

function databaseProperty(
  property: PacksmithProperty,
  warnings: string[],
  databaseName: string,
  relationTargetIds: Map<string, string>,
) {
  switch (property.type) {
    case "title":
      return { title: {} };
    case "select":
      return { select: { options: (property.options || []).map((name) => ({ name })) } };
    case "number":
      return { number: { format: "number" } };
    case "date":
      return { date: {} };
    case "checkbox":
      return { checkbox: {} };
    case "person":
      return { people: {} };
    case "relation": {
      const targetDatabaseId = inferRelationTarget(property.name, relationTargetIds);
      if (targetDatabaseId) {
        return {
          relation: {
            database_id: targetDatabaseId,
            type: "single_property",
            single_property: {},
          },
        };
      }
      warnings.push(`${databaseName}.${property.name}: relation target could not be inferred; published as text.`);
      return { rich_text: {} };
    }
    case "text":
    default:
      return { rich_text: {} };
  }
}

function buildRecordProperties(
  properties: PacksmithProperty[],
  record: Record<string, unknown>,
  relationTargetIds: Map<string, string>,
) {
  const result: Record<string, unknown> = {};

  for (const property of properties) {
    const value = record[property.name];
    if (value === undefined || value === null || value === "") continue;
    const notionValue = recordProperty(property, value, relationTargetIds);
    if (notionValue) result[property.name] = notionValue;
  }

  return result;
}

function recordProperty(property: PacksmithProperty, value: unknown, relationTargetIds: Map<string, string>) {
  switch (property.type) {
    case "title":
      return titleValue(String(value));
    case "select":
      return { select: { name: String(value) } };
    case "number":
      return typeof value === "number" ? { number: value } : undefined;
    case "date":
      return { date: { start: String(value) } };
    case "checkbox":
      return { checkbox: Boolean(value) };
    case "person":
      return undefined;
    case "relation":
      if (inferRelationTarget(property.name, relationTargetIds)) return undefined;
      return richTextValue(String(value));
    case "text":
    default:
      return richTextValue(String(value));
  }
}

function registerRelationTargets(targets: Map<string, string>, database: PacksmithDatabase, notionDatabaseId: string) {
  const keys = new Set([
    database.id,
    database.name,
    database.name.replace(/s$/i, ""),
    database.name.replace(/ies$/i, "y"),
  ]);

  for (const key of keys) {
    const normalized = normalizeRelationKey(key);
    if (normalized) targets.set(normalized, notionDatabaseId);
  }
}

function inferRelationTarget(propertyName: string, targets: Map<string, string>) {
  const base = normalizeRelationKey(propertyName);
  const candidates = [
    base,
    `${base}s`,
    base.endsWith("y") ? `${base.slice(0, -1)}ies` : "",
    base.replace(/s$/, ""),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const target = targets.get(candidate);
    if (target) return target;
  }

  return null;
}

function normalizeRelationKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function titleValue(content: string) {
  return {
    title: [
      {
        type: "text",
        text: { content: content.slice(0, 1800) },
      },
    ],
  };
}

function richTextValue(content: string) {
  return {
    rich_text: [
      {
        type: "text",
        text: { content: content.slice(0, 1800) },
      },
    ],
  };
}

function introBlocks(sections: string[]) {
  const children: Array<Record<string, unknown>> = [
    paragraph("Generated by Packsmith. Review the workspace before using it with clients or customers."),
  ];

  for (const section of sections.slice(0, 12)) {
    children.push(toDo(section));
  }

  return children;
}

function pageBlocks(page: PacksmithPage) {
  const children: Array<Record<string, unknown>> = [];
  if (page.purpose) children.push(paragraph(page.purpose));
  for (const block of (page.blocks || []).slice(0, 20)) {
    children.push(toDo(block));
  }
  return children.length ? children : [paragraph("Packsmith generated workspace page.")];
}

function paragraph(content: string) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{ type: "text", text: { content: content.slice(0, 1800) } }],
    },
  };
}

function toDo(content: string) {
  return {
    object: "block",
    type: "to_do",
    to_do: {
      rich_text: [{ type: "text", text: { content: content.slice(0, 1800) } }],
      checked: false,
    },
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
