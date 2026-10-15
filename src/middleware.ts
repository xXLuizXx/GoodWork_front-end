import { NextRequest, NextResponse } from "next/server";

type Role = "admin" | "company" | "individual";

// Páginas acessíveis sem login; todas as outras exigem o cookie de sessão
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/users/create",
  "/forgot-password",
  "/reset-password",
  "/verify-account",
];

// Páginas restritas a alguns perfis (vale também para as subpáginas).
// A regra mais específica vem antes. Páginas fora da lista ficam abertas a qualquer usuário logado
// (ex.: /dashboard, /report, /users/my-profile).
const ROLE_RULES: { path: string; roles: Role[] }[] = [
  // Admin
  { path: "/users/generate-users", roles: ["admin"] },
  { path: "/categories", roles: ["admin"] },
  { path: "/jobs/jobsNotValidated", roles: ["admin"] },
  { path: "/jobs/generate-jobs", roles: ["admin"] },

  // Empresa
  { path: "/jobs/create", roles: ["company"] },
  { path: "/jobs-company-genereted", roles: ["company"] },
  { path: "/jobs-category/jobs-company-category", roles: ["company"] },
  { path: "/jobs-vacancy/jobs-company-vacancy", roles: ["company"] },
  { path: "/users/list-users", roles: ["company"] },
  // my-applications é do candidato, mas precisa vir antes da regra de /applications
  { path: "/applications/my-applications", roles: ["individual"] },
  { path: "/applications", roles: ["company"] },
  { path: "/interviews/create", roles: ["company"] },
  { path: "/interviews/manage", roles: ["company"] },
  { path: "/interviews/my-interviews", roles: ["company"] },

  // Candidato
  { path: "/jobs/jobsRecommended", roles: ["individual"] },
  { path: "/jobs/allJobs", roles: ["individual"] },
  { path: "/jobs-vacancy", roles: ["individual"] },
  { path: "/interviews/candidate", roles: ["individual"] },

  // Compartilhadas
  { path: "/jobs-category", roles: ["admin", "individual"] },
  { path: "/profile", roles: ["admin", "company"] },
];

function matches(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

// Lê o payload do JWT (sem validar a assinatura: quem valida é o back em cada requisição)
function getRole(token: string): Role | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { accessLevel, isAdmin } = JSON.parse(atob(payload));

    if (isAdmin) return "admin";
    if (accessLevel === "company" || accessLevel === "individual") return accessLevel;
    return null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token.token")?.value;
  const role = token ? getRole(token) : null;

  if (!role) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Token ilegível: remove para a tela de login não mandar de volta ao dashboard
    if (token) response.cookies.delete("token.token");
    return response;
  }

  const rule = ROLE_RULES.find(({ path }) => matches(pathname, path));

  if (rule && !rule.roles.includes(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Ignora arquivos internos do Next, rotas de API e arquivos estáticos (ex.: /Img/...)
  matcher: ["/((?!_next/|api/|favicon.ico|.*\\..*).*)"],
};
