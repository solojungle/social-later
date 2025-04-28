import Cookies from "js-cookie";

import { Button } from "../ui/button";

export function OLDLinkTwitterButton({
  codeVerifier,
  state,
  teamId,
  url,
}: {
  codeVerifier: string;
  state: string;
  teamId: string;
  url: string;
}) {
  // Set the cookies
  Cookies.set("codeVerifier", codeVerifier);
  Cookies.set("state", state);
  Cookies.set("teamId", teamId);

  return (
    <Button variant="link">
      <a href={url}>Link twitter</a>
    </Button>
  );
}
