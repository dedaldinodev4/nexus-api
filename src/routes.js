import { json, readJson } from "./core/http.js"
import { 
  authRepository, 
  projectsRepository, 
  tasksRepository 
} from "./repositories/index.js";
import { forbidden } from "./core/errors/index.js";


const V1 = 'api/v1'


export function buildRoutes(router, { bodyLimit }) {
  // /health - Health route
  router.get("/health", async ({ res }) => {
    json(res, 200, {
      status: "ok",
      uptime: process.uptime(),
      node: process.version,
      version: '1.0.0',
      timestamp: new Date().toISOString()
    })
  })

  //* auth *//
  // POST /auth/regsiter 
  router.post(`/${V1}/auth/register`, async ({ req, res }) => {
    const body = await readJson(req, bodyLimit);
    const user = await authRepository.register(body);
    json(res, 201, { data: user });
  });

  // POST /auth/login
  router.post(`/${V1}/auth/login`, async ({ req, res }) => {
    const body = await readJson(req, bodyLimit);
    const result = await authRepository.login(body);
    json(
      res,
      200,
      { data: result.user },
      { "set-cookie": result.setCookie }
    );
  });

  // POST /auth/logout
  router.post(`/${V1}/auth/logout`, async ({ req, res }) => {
    const cookie = req.headers.cookie || "";
    const match = cookie.match(/(?:^|;\s*)sid=([^;]+)/);
    if (match) {
      await authRepository.logout(match);
    }
    json(
      res,
      200,
      { data: { loggedOut: true } },
      { "set-cookie": "sid=; HttpOnly; Path=/; Max-Age=0" }
    );
  });

  // GET /auth/me 
  router.get(`/${V1}/auth/me`, async ({ res, state }) => {
    json(res, 200, { data: state.user });
  });

  //* Projects *//
  // GET /projects/:id - get one project by ID
  router.get(`/${V1}/projects/:id`, async ({ res, state, params }) => {
    const project = projectsRepository.findById(params.id, state.user.id);
    if (!project)
      throw forbidden("Project not found or not owned by user");
    json(res, 200, { data: project });
  });
  
  // GET /projects - all project
  router.get(`/${V1}/projects`, async ({ res, state }) => {
    const projects = projectsRepository.listByOwner(state.user.id);
    json(res, 200, { data: projects });
  });

  // POST /projects - create a project
  router.post(`/${V1}/projects`, async ({ req, res, state }) => {
    const body = await readJson(req, bodyLimit);
    if (!body.name?.trim())
      throw badRequest("Project name is required");

    const project = projectsRepository.create({
      name: body.name,
      ownerId: state.user.id,
      description: body.description || ""
    });
    json(res, 201, { data: project });
  });

  // DELETE /projects/:id - delete an project 
  router.delete(`/${V1}/projects/:id`, async ({ res, state, params }) => {
    const project = projectsRepository.findById(params.id, state.user.id);
    if (!project)
      throw forbidden("Project not found or not owned by user");
    projectsRepository.delete(params.id, state.user.id);
    res.writeHead(204);
    res.end();
  });

  // GET /projects/:id/tasks - get all tasks of project
  router.get("/projects/:id/tasks", async ({ res, state, params }) => {
    const project = projectsRepository.findById(params.id, state.user.id);
    if (!project)
      throw forbidden("Project not found or not owned by user");
    json(
      res,
      200, {
      data: tasksRepository.list(params.id)
    });
  });

  // POST /projects/:id/tasks - create a task of project
  router.post("/projects/:id/tasks", async ({ req, res, state, params }) => {
    const project = projectsRepository.findById(params.id, state.user.id);
    if (!project)
      throw forbidden("Project not found or not owned by user");

    const body = await readJson(req, bodyLimit);
    if (!body.title?.trim())
      throw badRequest("Task title is required");

    json(res, 201,
      {
        data: tasksRepository.create({
          projectId: params.id,
          title: body.title,
          description: body.description || ""
        })
      });
  });


}