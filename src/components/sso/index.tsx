import { Button } from "../ui/button";

type ContinueWithBaseProps = {
	text: string;
	icon: string;
	props?: Record<string, any>;
};

export const ContinueWithBase = ({
	text,
	icon,
	props,
}: ContinueWithBaseProps) => {
	return (
		<Button variant="outline" type="button" {...props}>
			<img className="h-7 w-7" alt="Single sign on with google" src={icon} />
			<span className="flex h-8 grow items-center justify-center">{text}</span>
		</Button>
	);
};
