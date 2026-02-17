import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from '@tanstack/react-router';

export default function ProposalSharePage() {
  const { proposalId } = useParams({ from: '/proposal/$proposalId' });

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Proposal #{proposalId} - Proposal viewing will be available in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
