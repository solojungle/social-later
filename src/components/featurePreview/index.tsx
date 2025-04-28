export function FeaturePreview({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="m-3 max-w-2xl space-y-4 border border-border p-6">
      <div className="mb-6 space-y-4">
        <h2 className="text-lg">{title}</h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
}
