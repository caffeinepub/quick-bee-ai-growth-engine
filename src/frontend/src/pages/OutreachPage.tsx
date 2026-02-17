import { useState } from 'react';
import { useGetAllOutreachActivities } from '../hooks/useOutreach';
import { useGetAllLeads } from '../hooks/useLeads';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin, Instagram, MessageCircle, Smartphone } from 'lucide-react';

const platforms = [
  { id: 'Email', label: 'Email', icon: Mail },
  { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin },
  { id: 'Instagram', label: 'Instagram', icon: Instagram },
  { id: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'SMS', label: 'SMS', icon: Smartphone },
];

export default function OutreachPage() {
  const { data: outreach = [], isLoading: outreachLoading } = useGetAllOutreachActivities();
  const { data: leads = [], isLoading: leadsLoading } = useGetAllLeads();
  const [activePlatform, setActivePlatform] = useState('Email');

  const isLoading = outreachLoading || leadsLoading;

  const platformOutreach = outreach.filter(o => o.platform === activePlatform);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading outreach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Outreach</h1>
        <p className="text-muted-foreground">Track multi-channel outreach activities</p>
      </div>

      <Tabs value={activePlatform} onValueChange={setActivePlatform}>
        <TabsList className="grid w-full grid-cols-5">
          {platforms.map(platform => {
            const Icon = platform.icon;
            const count = outreach.filter(o => o.platform === platform.id).length;
            return (
              <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{platform.label}</span>
                <Badge variant="secondary" className="ml-1">{count}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {platforms.map(platform => (
          <TabsContent key={platform.id} value={platform.id} className="space-y-4">
            {platformOutreach.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No {platform.label} outreach activities yet.</p>
                  <Button className="mt-4">Start Outreach</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {platformOutreach.map((activity, idx) => {
                  const lead = leads.find(l => l.id === activity.leadId);
                  return (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{lead?.name || 'Unknown Lead'}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{activity.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {activity.sent && <Badge variant="outline">Sent</Badge>}
                              {activity.replied && <Badge className="bg-green-600">Replied</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Mark Sent</Button>
                            <Button size="sm" variant="outline">Mark Replied</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
