import { compilePath } from "./compilePath.js";

//* Class Router *//
export class Router {
  #routes = [];

  add(method, path, ...handlers) {
    if (!handlers.length) {
      throw new Error(`Route "${method} ${path}" requires a handler`);
    }
    this.#routes.push({
      method: method.toUpperCase(),
      path,
      ...compilePath(path),
      handlers
    })
    return this;
  }

  get(path, ...handler) {
    return this.add("GET", path, ...handler);
  }

  post(path, ...handler) {
    return this.add("POST", path, ...handler);
  }

  put(path, ...handler) {
    return this.add("PUT", path, ...handler);
  }

  patch(path, ...handler) {
    return this.add("PATCH", path, ...handler);
  }

  delete(path, ...handler) {
    return this.add("DELETE", path, ...handler);
  }

  options(path, ...handlers) {
    return this.add("OPTIONS", path, ...handlers);
  }

  head(path, ...handlers) {
    return this.add("HEAD", path, ...handlers);
  }

  match(method, pathname) {
    const routeMethod = method.toUpperCase();

    for (const route of this.#routes) {
      if (route.method !== routeMethod) continue;

      const match = route.regex.exec(pathname)
      if (!match) continue;

      const params = {};

      route.keys.forEach((key, index) => {
        params[key] = decodeURIComponent(match[index + 1]);
      });

      return {
        ...route,
        params
      }
    }
    return null;
  }

  findPath(pathname) {
    return this.#routes.some((route) => route.regex.test(pathname));
  }

  allowedMethods(pathname) {
    return [
      ...new Set(
        this.#routes
          .filter((route) => route.regex.test(pathname))
          .map((route) => route.method)
      )
    ];
  }

}