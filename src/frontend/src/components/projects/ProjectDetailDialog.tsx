import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUpdateProject } from '../../hooks/useProjects';
import { toast } from 'sonner';
import type { Project } from '../../backend';
import { Calendar, FileText } from 'lucide-react';
import { AttachmentUploader } from '../uploads/AttachmentUploader';
import { AttachmentList } from '../uploads/AttachmentList';

interface ProjectDetailDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailDialog({ project, open, onOpenChange }: ProjectDetailDialogProps) {
  const updateProject = useUpdateProject();
  const [notes, setNotes] = useState(project?.notes || '');
  const [files, setFiles] = useState(project?.files || []);

  if (!project) return null;

  const handleUpdate = async () => {
    try {
      await updateProject.mutateAsync({
        ...project,
        notes,
        files,
      });
      toast.success('Project updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update project');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Project Details</span>
            <Badge>{project.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            View and update project information
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Started:</span>
              <span>{formatDate(project.startDate)}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Completion</Label>
            <div className="space-y-2">
              <Progress value={Number(project.completion)} />
              <p className="text-sm text-muted-foreground">{Number(project.completion)}% complete</p>
            </div>
          </div>

          {project.milestones.length > 0 && (
            <div className="grid gap-2">
              <Label>Milestones</Label>
              <ul className="list-disc list-inside text-sm space-y-1">
                {project.milestones.map((milestone, idx) => (
                  <li key={idx}>{milestone}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Project notes..."
              rows={4}
            />
          </div>

          <div className="border-t pt-4">
            <Label className="mb-3 block">Attachments</Label>
            <AttachmentUploader
              onFilesSelected={(newFiles) => setFiles([...files, ...newFiles])}
            />
            {files.length > 0 && (
              <div className="mt-4">
                <AttachmentList
                  files={files}
                  onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleUpdate} disabled={updateProject.isPending}>
            {updateProject.isPending ? 'Updating...' : 'Update Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
