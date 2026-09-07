//* compile function in Router *//

export function compile(pattern) {
  const keys = [];
  const source = pattern.split("/").map(part => {
    if (!part) return "";
    if (part.startsWith(":")) {
      keys.push(part.slice(1));
      return "([^/]+)";
    }
    if (part === "*") {
      keys.push("wildcard");
      return "(.*)";
    }
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("/");
  return { regex: new RegExp(`^${source || "/"}/?$`), keys };
}