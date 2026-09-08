//* compile function in Router *//

export function compilePath (path) {
  if (!path.startsWith("/")) {
    throw new Error(`Route path must start with "/": ${path}`);
  }

  const keys = [];

  const pattern = path.split("/").map((segment) => {
    if (segment === "") return "";

    if (segment.startsWith(":")) {
      const name = segment.slice(1);
      if (!name)
        throw new Error(`Invalid parameter in route: ${path}`);
      keys.push(name);
      return "([^/]+)";
    }

    if (segment === "*") {
      const name = segment.slice(1) || "wildcard";
      keys.push(name);
      return "(.*)";
    }

    return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("/");
  
  return {
    regex: new RegExp(`^${source || "/"}/?$`),
    keys
  };
}