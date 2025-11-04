import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Auth routes (standalone, no layout)
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  
  // Index and catch-all for custom router
  index("routes/_index.tsx"),
  route("*", "routes/$.tsx"), // Catch-all for all other paths
] satisfies RouteConfig;
