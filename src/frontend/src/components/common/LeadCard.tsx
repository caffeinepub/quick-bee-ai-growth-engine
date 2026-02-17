import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Lead } from '../../backend';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const statusColors: Record<string, string> = {
    cold: 'bg-gray-500',
    contacted: 'bg-blue-500',
    interested: 'bg-yellow-500',
    qualified: 'bg-green-500',
    proposalSent: 'bg-purple-500',
    won: 'bg-emerald-600',
    lost: 'bg-red-500',
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{lead.name}</h3>
            <p className="text-sm text-muted-foreground">{lead.contact}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">{lead.niche}</Badge>
              <span className="text-xs text-muted-foreground">{lead.city}</span>
            </div>
          </div>
          <Badge className={statusColors[lead.status] || 'bg-gray-500'}>
            {lead.status}
          </Badge>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Potential: ${Number(lead.revenuePotential).toLocaleString()}</span>
          <span>Owner: {lead.owner}</span>
        </div>
      </CardContent>
    </Card>
  );
}
