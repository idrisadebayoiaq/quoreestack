import type { Project } from "@/lib/data/content";

export type ProjectOrigin = "client" | "own_product" | "self_initiated" | "concept";

export const originLabels: Record<ProjectOrigin, string> = {
  client: "Client work",
  own_product: "Own product",
  self_initiated: "Self-initiated",
  concept: "Concept",
};

/** Derived from the free-text `client_type` until projects get a dedicated `origin` column. */
export function projectOrigin(project: Pick<Project, "client_type">): ProjectOrigin {
  const type = project.client_type?.toLowerCase() ?? "";
  if (type.includes("concept")) return "concept";
  if (type.includes("self-initiated") || type.includes("self initiated")) return "self_initiated";
  if (type.includes("personal") || type.includes("own product")) return "own_product";
  return "client";
}

const originRank: Record<ProjectOrigin, number> = {
  client: 0,
  own_product: 1,
  self_initiated: 2,
  concept: 3,
};

/** Paid client work first, then products, then speculative work; stable within each group. */
export function sortByProof<T extends Pick<Project, "client_type">>(projects: T[]) {
  return [...projects].sort(
    (a, b) => originRank[projectOrigin(a)] - originRank[projectOrigin(b)],
  );
}
