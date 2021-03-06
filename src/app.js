const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
// app.use("/repositories/:id", validateRepositoryId);

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: `Invalid repository ID` });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.get("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const repo = repositories[repoIndex];

  return response.json(repo);
});

app.post("/repositories", (request, response) => {
  const { id, title, url, techs } = request.body;

  const repository = {
    id: id ? id : uuid(),
    title,
    url,
    likes: 0,
    techs,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  let { likes } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (likes !== repositories[repoIndex].likes) {
    likes = repositories[repoIndex].likes;
  }

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const repo = repositories[repoIndex];

  repo.likes += 1;

  return response.json(repo);
});

module.exports = app;
