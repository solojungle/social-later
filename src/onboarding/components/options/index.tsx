export function Option({ children, description, title }: any) {
  return (
    <div className="relative mb-[8px] flex cursor-pointer select-none flex-col items-start rounded-[8px] border bg-white p-4 transition ease-out hover:border-primary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
      <div className="flex text-base font-semibold md:text-lg">{title}</div>
      <div className="mt-[2px] text-xs font-normal text-gray-600 md:text-sm">
        {description}
      </div>
      {children}
    </div>
  );
}

export function OptionBadge({ children }: any) {
  return (
    // eslint-disable-next-line tailwindcss/classnames-order
    <div className="relative mt-2 flex w-auto items-center gap-0.5 rounded-lg bg-success-foreground/40 p-1 pr-1.5 text-xs font-medium text-success md:absolute md:right-px md:top-px md:mt-0">
      {children}
    </div>
  );
}

export function OptionGroup({ children, description, title }: any) {
  return (
    <div className="mb-4 flex flex-col space-y-1 md:mx-auto md:max-w-[540px] md:pt-[48px] lg:pt-[64px] xl:pt-[88px]">
      <div className="mb-6">
        <div className="mb-2 text-2xl font-bold md:text-4xl">{title}</div>
        <div className="text-sm text-gray-600 md:text-lg">{description}</div>
      </div>
      {children}
    </div>
  );
}
