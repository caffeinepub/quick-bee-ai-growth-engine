import { useState } from 'react';
import { useGetAllOutreachActivities, useUpdateOutreachStatus } from '../hooks/useOutreach';
import { useGetAllLeads } from '../hooks/useLeads';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin, Instagram, MessageCircle, Smartphone, Plus } from 'lucide-react';
import { UPLOADED_IMAGES } from '../constants/uploadedImages';
import { SafeImage } from '../components/common/SafeImage';
import { StartOutreachDialog } from '../components/outreach/StartOutreachDialog';
import { toast } from 'sonner';
import type { OutreachActivity } from '../backend';

const platforms = [
  { id: 'Email', label: 'Email', icon: Mail, image: UPLOADED_IMAGES.email },
  { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin, image: null },
  { id: 'Instagram', label: 'Instagram', icon: Instagram, image: UPLOADED_IMAGES.instagram },
  { id: 'WhatsApp', label: 'WhatsApp', icon: MessageCircle, image: UPLOADED_IMAGES.whatsapp },
  { id: 'SMS', label: 'SMS', icon: Smartphone, image: UPLOADED_IMAGES.phone },
];

export default function OutreachPage() {
  const { data: outreach = [], isLoading: outreachLoading } = useGetAllOutreachActivities();
  const { data: leads = [], isLoading: leadsLoading } = useGetAllLeads();
  const updateStatus = useUpdateOutreachStatus();
  const [activePlatform, setActivePlatform] = useState('Email');
  const [startDialogOpen, setStartDialogOpen] = useState(false);

  const isLoading = outreachLoading || leadsLoading;

  const platformOutreach = outreach.filter(o => o.platform === activePlatform);
  const activePlatformData = platforms.find(p => p.id === activePlatform);

  const handleMarkSent = async (activity: OutreachActivity) => {
    try {
      await updateStatus.mutateAsync({ activity, updates: { sent: true } });
      toast.success('Marked as sent');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleMarkReplied = async (activity: OutreachActivity) => {
    try {
      await updateStatus.mutateAsync({ activity, updates: { replied: true } });
      toast.success('Marked as replied');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

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
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">Outreach</h1>
        <p className="page-description">Track multi-channel outreach activities</p>
      </div>

      <Tabs value={activePlatform} onValueChange={setActivePlatform}>
        <TabsList className="grid w-full grid-cols-5 h-auto">
          {platforms.map(platform => {
            const Icon = platform.icon;
            const count = outreach.filter(o => o.platform === platform.id).length;
            return (
              <TabsTrigger 
                key={platform.id} 
                value={platform.id} 
                className="flex flex-col sm:flex-row items-center gap-2 py-3 px-2 focus-ring"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{platform.label}</span>
                <Badge variant="secondary" className="text-xs">{count}</Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {platforms.map(platform => (
          <TabsContent key={platform.id} value={platform.id} className="space-y-5 mt-6">
            {platformOutreach.length === 0 ? (
              <Card className="interactive-card">
                <CardContent className="py-16 text-center space-y-6">
                  {platform.image ? (
                    <div className="flex justify-center">
                      <SafeImage
                        src={platform.image} 
                        alt={platform.label}
                        className="w-32 h-32 object-cover rounded-2xl shadow-lg"
                        fallbackClassName="w-32 h-32 rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-2xl bg-muted flex items-center justify-center">
                        <platform.icon className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">No {platform.label} outreach yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Start reaching out to your leads via {platform.label} to track engagement and replies.
                    </p>
                  </div>
                  <Button size="lg" className="focus-ring" onClick={() => setStartDialogOpen(true)}>
                    Start Outreach
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setStartDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Outreach
                  </Button>
                </div>
                {platformOutreach.map((activity, idx) => {
                  const lead = leads.find(l => l.id === activity.leadId);
                  return (
                    <Card key={idx} className="interactive-card">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{lead?.name || 'Unknown Lead'}</h3>
                              {activity.sent && (
                                <Badge variant="outline" className="text-xs">Sent</Badge>
                              )}
                              {activity.replied && (
                                <Badge variant="default" className="text-xs">Replied</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {activity.message}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {!activity.sent && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkSent(activity)}
                                disabled={updateStatus.isPending}
                              >
                                Mark Sent
                              </Button>
                            )}
                            {activity.sent && !activity.replied && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkReplied(activity)}
                                disabled={updateStatus.isPending}
                              >
                                Mark Replied
                              </Button>
                            )}
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

      <StartOutreachDialog
        open={startDialogOpen}
        onOpenChange={setStartDialogOpen}
        platform={activePlatform}
      />
    </div>
  );
}
