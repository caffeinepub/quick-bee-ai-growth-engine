import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllServices } from '../../hooks/useServices';
import { useGetAllLeads } from '../../hooks/useLeads';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useAddProject, useUpdateProject } from '../../hooks/useProjects';
import { toast } from 'sonner';
import type { Project } from '../../backend';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const { data: profile } = useGetCallerUserProfile();
  const { data: services = [] } = useGetAllServices();
  const { data: leads = [] } = useGetAllLeads();
  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  
  const [formData, setFormData] = useState({
    serviceId: '',
    clientId: '',
    notes: '',
    status: 'active',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        serviceId: project.serviceId,
        clientId: project.clientId,
        notes: project.notes,
        status: project.status,
      });
    } else {
      setFormData({ serviceId: '', clientId: '', notes: '', status: 'active' });
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.agency) {
      toast.error('You must have a profile to manage projects');
      return;
    }

    if (!formData.serviceId || !formData.clientId) {
      toast.error('Please select a service and client');
      return;
    }

    try {
      const projectData: Project = {
        id: project?.id || `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        agency: profile.agency,
        serviceId: formData.serviceId,
        clientId: formData.clientId,
        startDate: project?.startDate || BigInt(Date.now() * 1000000),
        milestones: project?.milestones || [],
        files: project?.files || [],
        notes: formData.notes,
        completion: project?.completion || BigInt(0),
        status: formData.status,
      };

      if (project) {
        await updateProject.mutateAsync(projectData);
        toast.success('Project updated successfully');
      } else {
        await addProject.mutateAsync(projectData);
        toast.success('Project created successfully');
      }
      
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Update project details' : 'Create a new project for a client'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="service">Service *</Label>
              <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="onHold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Project notes..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addProject.isPending || updateProject.isPending}>
              {(addProject.isPending || updateProject.isPending) ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
