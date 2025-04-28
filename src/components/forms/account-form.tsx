import { PersonalAvatarCard } from "../cards/personal/personal-avatar";
import { PersonalNameCard } from "../cards/personal/personal-name";
import { PersonalUsernameCard } from "../cards/personal/personal-username";

export function AccountForm() {
  return (
    <>
      <PersonalAvatarCard />
      <PersonalNameCard />
      <PersonalUsernameCard />
    </>
  );
}
