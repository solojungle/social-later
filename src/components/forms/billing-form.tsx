import { TeamPaymentMethodCard } from "../cards/teams/team-payment-method";
import { TeamPaymentPlanCard } from "../cards/teams/team-plan";

export function BillingForm() {
	return (
		<>
			<TeamPaymentMethodCard />
			<TeamPaymentPlanCard />
		</>
	);
}
