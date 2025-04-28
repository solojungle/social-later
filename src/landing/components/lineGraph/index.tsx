export function LineGraph() {
  const views = [
    2100, 2100, 2312, 2050, 2600, 3500, 4000, 4000, 3400, 3400, 4000, 4000,
    5000, 5000, 6000, 6500, 6500, 7000, 7000,
  ];

  const clicks = [
    1000, 1000, 1123, 1000, 1200, 1500, 2000, 2000, 1700, 1700, 2000, 2000,
    2500, 2500, 3000, 3250, 3250, 3500, 3500,
  ];

  const yAxis = ["7,000", "6,000", "5,000", "4,000", "3,000", "2,000", "1,000"];

  const maxYValue = Math.max(...views);

  const viewLineValues = views
    .reverse()
    .map((v, i) => {
      const x = i * 2;
      const y = (v / maxYValue) * 10;
      const roundedY = Math.round(y * 2) / 2;
      return `${x},${roundedY}`;
    })
    .join(" ");

  const clickLineValues = clicks
    .reverse()
    .map((v, i) => {
      const x = i * 2;
      const y = (v / maxYValue) * 10;
      const roundedY = Math.round(y * 2) / 2;
      return `${x},${roundedY}`;
    })
    .join(" ");

  return (
    <section className="p-4">
      <div>
        <svg
          className="h-48 w-full"
          fill="currentColor"
          viewBox={`0 0 ${views.length * 2} 10`}
        >
          <polyline
            fill="none"
            points={viewLineValues}
            stroke="#52aeff"
            strokeWidth=".1"
          />
        </svg>
        <svg
          className="h-48 w-full"
          fill="currentColor"
          viewBox={`0 0 ${views.length * 2} 10`}
        >
          <polyline
            fill="none"
            points={clickLineValues}
            stroke="#45dec5"
            strokeWidth=".1"
          />
        </svg>
        {yAxis.map((y, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className="flex items-center justify-between" key={i}>
            <span className="m-5 text-xs text-gray-500">{y}</span>
            <div className="h-0.5 flex-1 bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
