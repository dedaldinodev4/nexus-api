import { json } from "./core/http.js"


export function buildRoutes (router, { bodyLimit }) {
  router.get("/health", async ({ res }) => {
    json(res, 200, { 
      status: "ok", 
      uptime: process.uptime(), 
      node: process.version 
    } )
  })
}