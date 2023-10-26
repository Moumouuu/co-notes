import InvitePage from "@/components/pages/invite-page";

export default function Page({
  params,
}: {
  params: { inviteLink: string; idNote: string };
}) {
  const { inviteLink, idNote } = params;
  return <InvitePage inviteLink={inviteLink} idNote={idNote} />;
}
