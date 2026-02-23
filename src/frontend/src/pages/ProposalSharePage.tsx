import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProposalSharePage() {
  // This is a placeholder page for future proposal sharing functionality
  // The route is not currently registered in the router
  
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Proposal viewing will be available in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
