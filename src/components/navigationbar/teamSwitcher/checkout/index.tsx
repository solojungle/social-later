"use client";

/**
 * This function will be called when the user clicks "Create Team" in the team switcher.
 * It will open the modal and start the checkout process, which involves the following steps:
 * 1. A multi-step checkout will open.
 * 2. The user will first be prompted to enter a team name and choose a subscription.
 * 3. After clicking next, the user will be prompted to enter their payment details the component provided by Stripe <PaymentElement />.
 * 4. As well as their billing address, it should be able to search instead of having to manually enter it.
 * 5. After clicking next, if the payment is successful, we will create the team.
 */

export function Checkout() {
	// Pass the pages to the multi-step checkout hook.
	// const { step, nextStep, prevStep } = useMultiStepCheckout();
}
