import { useState } from 'react';
import { useGetAllOutreachActivities } from '../hooks/useOutreach';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, MessageSquare, Phone, Linkedin } from 'lucide-react';
import { StartOutreachDialog } from '../components/outreach/StartOutreachDialog';
import { SafeImage } from '../components/common/SafeImage';
import type { OutreachActivity } from '../types/local';

const platforms = [
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare },
  { id: 'call', name: 'Call', icon: Phone },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
];

export default function OutreachPage() {
  const { data: activities = [], isLoading } = useGetAllOutreachActivities();
  const [selectedPlatform, setSelectedPlatform] = useState('email');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');

  const activitiesByPlatform = activities.filter((a) => a.platform === selectedPlatform);

  const handleStartOutreach = (leadId: string) => {
    setSelectedLeadId(leadId);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading outreach activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outreach</h1>
          <p className="text-muted-foreground">Multi-channel outreach tracking</p>
        </div>
      </div>

      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
        <TabsList className="grid w-full grid-cols-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <TabsTrigger key={platform.id} value={platform.id}>
                <Icon className="mr-2 h-4 w-4" />
                {platform.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform.id} value={platform.id} className="space-y-4">
            {activitiesByPlatform.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <SafeImage
                    src={`/assets/${platform.name.toLowerCase()}-icon.png`}
                    alt={platform.name}
                    className="h-16 w-16 mx-auto opacity-50"
                    fallback={platform.name.charAt(0)}
                  />
                  <p className="text-muted-foreground">No {platform.name} outreach activities yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start reaching out to leads via {platform.name}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activitiesByPlatform.map((activity, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base">Lead: {activity.leadId.slice(0, 12)}...</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{activity.message}</p>
                      <div className="flex gap-2">
                        <Badge variant={activity.sent ? 'default' : 'secondary'}>
                          {activity.sent ? 'Sent' : 'Draft'}
                        </Badge>
                        {activity.replied && <Badge className="bg-green-600">Replied</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Follow-up: {new Date(activity.followUpDate).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <StartOutreachDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leadId={selectedLeadId}
        platform={selectedPlatform}
      />
    </div>
  );
}
