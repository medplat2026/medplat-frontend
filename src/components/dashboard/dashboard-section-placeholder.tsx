type DashboardSectionPlaceholderProps = {
  title: string;
  description?: string;
};

export function DashboardSectionPlaceholder({
  title,
  description = "This section is not wired to the API yet. Use the dashboard home for the live overview.",
}: DashboardSectionPlaceholderProps) {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
