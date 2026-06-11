import { BackButton } from "@/components/dashboard/back-button";

export function PageHeader({
  title,
  description,
  action,
  showBack = false,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  showBack?: boolean;
}) {
  return (
    <div className="mb-8">
      {showBack && <BackButton />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
