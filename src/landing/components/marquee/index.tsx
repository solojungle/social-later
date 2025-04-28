export default function Marquee() {
  return (
    <section className="mb-48 flex w-full flex-col items-center py-10">
      <h2 className="mb-8 text-xs tracking-widest text-muted-foreground">
        OUR NETWORK OF THE MOST INNOVATIVE
      </h2>
      <div className="mx-auto flex max-w-5xl select-none gap-20 overflow-x-hidden">
        <ul className="flex min-w-full shrink-0 animate-marquee content-around items-center gap-20 [--duration:15s] md:[--duration:20s] ">
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/armory.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/codecombat.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/kong.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/orb.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/patch.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/popsql.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/jam.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/codecombat.svg" />
          </li>
        </ul>
        <ul className="flex min-w-full shrink-0 animate-marquee content-around items-center gap-20 [--duration:15s] md:[--duration:20s]">
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/armory.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/codecombat.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/kong.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/orb.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/patch.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/popsql.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/jam.svg" />
          </li>
          <li className="leading-[0px] !text-slate-400">
            <img alt="Google" className="h-10" src="/media/codecombat.svg" />
          </li>
        </ul>
      </div>
    </section>
  );
}
