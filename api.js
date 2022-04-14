import fetch from "node-fetch";

const BASE = {
  auth: "Basic " + process.env.FD_API_KEY,
  url: process.env.FD_API_BASE_URL,
  internalUrl: process.env.FD_INTERNAL_KNOWLEDGE_BASE_URL,
};

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: BASE.auth,
};

const GETRequestOptions = {
  method: "get",
  headers: HEADERS,
};

export async function getCategories() {
  const response = await fetch(
    BASE.url + "solutions/categories",
    GETRequestOptions
  );
  return response.json();
}

export async function getFolders(categoryId) {
  const response = await fetch(
    BASE.url + "solutions/categories/" + categoryId + "/folders",
    GETRequestOptions
  );
  return response.json();
}
// getArticles actually loads the folder contents (article information)
// WITH individual articles' contents from a /folders endpoint.
// So the getSingleArticle using an /articles endpoint isn't that useful,
// Because if you need just a list of article IDs, you still have to get their full contents.
export async function getArticles(folderId) {
  const response = await fetch(
    BASE.url + "solutions/folders/" + folderId.toString() + "/articles",
    GETRequestOptions
  );
  return response.json();
}

export async function getSingleFolder(folderId) {
  const response = await fetch(
    BASE.url + "solutions/folders/" + folderId,
    GETRequestOptions
  );
  return response.json();
}

export async function getSingleArticle(articleId) {
  const response = await fetch(
    BASE.url + "solutions/articles/" + articleId,
    GETRequestOptions
  );
  return response.json();
}

export async function updateArticleDescription(articleId, newHtmlDescription) {
  const Body = {
    description: newHtmlDescription,
  };

  const PUTRequestOptions = {
    method: "put",
    headers: HEADERS,
    body: JSON.stringify(Body),
  };

  const response = await fetch(
    BASE.url + "solutions/articles/" + articleId,
    PUTRequestOptions
  );
  return response.json();
}

export async function publishArticle(articleId) {
  const Body = {
    status: 2,
  };

  const PUTRequestOptions = {
    method: "put",
    headers: HEADERS,
    body: JSON.stringify(Body),
  };

  const response = await fetch(
    BASE.url + "solutions/articles/" + articleId,
    PUTRequestOptions
  );
  return response.json();
}