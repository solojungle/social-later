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
		<Button
			variant="outline"
			type="button"
			{...props}
		>
			<img className="w-8 h-8" alt="Single sign on with google" src={icon} />
			<span className="flex items-center justify-center h-8 grow">
				{text}
			</span>
		</Button>
	);
};
