import { ChallengeRunner } from "@/components/challenge/ChallengeRunner";

interface Props {
  params: Promise<{ challengeId: string }>;
}

export function generateStaticParams() {
  return [
    { challengeId: "challenge-0" },
    { challengeId: "challenge-1" },
    { challengeId: "challenge-2" },
  ];
}

export default async function ChallengePage({ params }: Props) {
  const { challengeId } = await params;

  return (
    <div className="h-[calc(100vh-6rem)] overflow-hidden">
      <ChallengeRunner challengeId={challengeId} />
    </div>
  );
}
