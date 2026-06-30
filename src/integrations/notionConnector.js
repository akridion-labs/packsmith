export function createNotionPayload(notionExport) {
  return {
    action: "create_packsmith_workspace",
    workspaceName: notionExport.workspaceName,
    parentPageTitle: notionExport.parentPageTitle,
    pages: notionExport.pages,
    databases: notionExport.databases,
  };
}

export async function createNotionWorkspace({ apiKey, parentPageId, notionExport }) {
  if (!apiKey || !parentPageId) {
    throw new Error("A Notion API key and parent page ID are required.");
  }

  return {
    status: "planned",
    message:
      "Notion connector payload is ready. Add the server route before sending this to the Notion API.",
    payload: createNotionPayload(notionExport),
  };
}
