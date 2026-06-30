export function createNotionPayload(notionExport, connection = {}) {
  return {
    action: "create_packsmith_workspace",
    schemaVersion: notionExport.schemaVersion,
    parentPageId: connection.parentPageId || "notion-parent-page-id",
    workspace: {
      name: notionExport.workspaceName,
      parentPage: notionExport.parentPage,
      pages: notionExport.pages,
      databases: notionExport.databases,
    },
    backendContract: {
      method: "POST",
      path: "/api/notion/publish",
      requiredSecrets: ["notionToken"],
      requiredFields: ["parentPageId", "workspace"],
    },
  };
}

export function simulateNotionPublish(notionExport, connection = {}) {
  const payload = createNotionPayload(notionExport, connection);

  return {
    status: connection.parentPageId ? "ready_to_publish" : "missing_parent_page",
    message: connection.parentPageId
      ? "Simulation complete. Backend can create this workspace when a server-side Notion token is provided."
      : "Add a parent page ID to complete the publish simulation. Do not store Notion tokens in the browser.",
    createdPreview: {
      parentPage: payload.workspace.parentPage.title,
      pages: payload.workspace.pages.map((page) => page.title),
      databases: payload.workspace.databases.map((database) => ({
        name: database.name,
        properties: database.properties.length,
        sampleRecords: database.sampleRecords.length,
      })),
    },
    payload,
  };
}

export async function createNotionWorkspace({ notionToken, parentPageId, notionExport }) {
  if (!notionToken || !parentPageId) {
    throw new Error("A server-side Notion token and parent page ID are required.");
  }

  return {
    status: "contract_ready",
    message:
      "Frontend contract is ready. Implement POST /api/notion/publish to send this payload to the Notion API from the server.",
    payload: createNotionPayload(notionExport, { parentPageId }),
  };
}
