"use client";

export function DeviceVisits() {
  return (
    <div className="h-full w-full rounded-sm border border-border p-3 text-sm">
      <div className="mb-8">
        <h2 className="font-medium">Visits by Device</h2>
        <p className="text-muted-foreground">
          Track user visits across different devices
        </p>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <p>Mobile</p>
          </div>
          <p className="text-muted-foreground">50%</p>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-600" />
            <p>Desktop</p>
          </div>
          <p className="text-muted-foreground">30%</p>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-600" />
            <p>Tablet</p>
          </div>
          <p className="text-muted-foreground">20%</p>
        </div>
      </div>
    </div>
  );
}
