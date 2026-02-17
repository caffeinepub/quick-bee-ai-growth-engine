import { useMemo } from 'react';
import { useGetAllLeads } from '../../hooks/useLeads';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function FollowUpBadge() {
  const { data: leads = [] } = useGetAllLeads();

  const dueToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = BigInt(today.getTime() * 1000000);

    return leads.filter((lead) => {
      // Backend stores followUpDate in nanoseconds, but leads don't have followUpDate
      // This is a placeholder - in real implementation, we'd need to track follow-up dates
      return false;
    });
  }, [leads]);

  if (dueToday.length === 0) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {dueToday.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold">Follow-ups Due Today</h4>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {dueToday.map((lead) => (
                <div key={lead.id} className="p-2 rounded-lg border border-border hover:bg-accent cursor-pointer">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.niche} • {lead.city}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
