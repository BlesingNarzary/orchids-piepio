import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/login",
    "/signup",
    "/privacy",
    "/terms",
    "/api/checkout",
    "/api/build-requests",
  ],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

