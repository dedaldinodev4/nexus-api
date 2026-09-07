import { json } from "./core/http"


export function buildRoutes (router, { bodyLimit }) {
  router.get("/health", async ({ response }) => {
    json(response, 200, { 
      status: "ok", 
      uptime: process.uptime(), 
      node: process.version 
    } )
  })
}