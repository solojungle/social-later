import { Button } from "../ui/button";

type ContinueWithBaseProps = {
  icon: string;
  props?: Record<string, any>;
  text: string;
};

export const ContinueWithBase = ({
  icon,
  props,
  text,
}: ContinueWithBaseProps) => {
  return (
    <Button type="button" variant="outline" {...props}>
      <img alt="Single sign on with google" className="h-7 w-7" src={icon} />
      <span className="flex h-8 grow items-center justify-center">{text}</span>
    </Button>
  );
};
