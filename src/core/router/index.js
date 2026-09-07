import { compile } from "./compile.js";

//* Class Router *//
export class Router {
  #routes = [];

  add (method, path, ...handlers) {
    const compiled = compile(path);
    this.#routes.push({ method: method.toUpperCase(), path, ...compiled, handlers });
    return this;
  }

  get (path, ...handler) {
    return this.add("GET", path, ...handler);
  }

  post (path, ...handler) {
    return this.add("POST", path, ...handler);
  }

  patch (path, ...handler) {
    return this.add("PATCH", path, ...handler);
  }

  put (path, ...handler) {
    return this.add("PUT", path, ...handler);
  }

  delete (path, ...handler) {
    return this.add("DELETE", path, ...handler);
  }

  match (method, pathname) {
    for (const route of this.#routes) {
      if (route.method !== method.toUpperCase())
        continue;
      const match = route.regex.exec(pathname)
      if (!match)
        continue;
      const params = Object.fromEntries(
        route.keys.map((key, index) => [key, decodeURIComponent(match[index + 1])])
      );
      return { ...route, params }
    }
    return null;
  }

  
}