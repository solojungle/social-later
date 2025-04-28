import { formatNumber } from "@/components/graphs/view-comparisons";

export function Last10Posts({ stats }: any) {
  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-4">
      {stats.map((stat: any, index: any) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className="flex flex-col justify-center gap-1" key={index}>
          <Header title={stat.title} />
          <Value value={stat.value} />
        </div>
      ))}
    </div>
  );
}

function Header({ title }: any) {
  return <h2 className="text-xs capitalize text-muted-foreground">{title}</h2>;
}

function Value({ value }: any) {
  return (
    <span className="text-base font-light sm:text-xl">
      {formatNumber(value)}
    </span>
  );
}
