import { PersonalAvatarCard } from "../cards/personal/personal-avatar";
import { PersonalNameCard } from "../cards/personal/personal-name";

export function AccountForm() {
	return (
		<>
			<PersonalAvatarCard />
			<PersonalNameCard />
			{/* <PersonalUsernameCard formControl={form.control} /> */}
		</>
	);
}
