export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const statusLabels: Record<string, string> = {
  production: "Production",
  internal: "Internal",
  "in-development": "In development",
  archived: "Archived",
};

export const confidentialityLabels: Record<string, string> = {
  public: "Public",
  "partially-private": "Partially private",
  private: "Private",
};

export function formatCount(value: number): string {
  return String(value).padStart(2, "0");
}
