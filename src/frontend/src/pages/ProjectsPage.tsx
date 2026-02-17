import { useState } from 'react';
import { useGetProjects } from '../hooks/useProjects';
import { useGetAllServices } from '../hooks/useServices';
import { useGetAllLeads } from '../hooks/useLeads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';
import { ProjectDialog } from '../components/projects/ProjectDialog';
import { ProjectDetailDialog } from '../components/projects/ProjectDetailDialog';
import type { Project } from '../backend';

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useGetProjects();
  const { data: services = [] } = useGetAllServices();
  const { data: leads = [] } = useGetAllLeads();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setDetailDialogOpen(true);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Client delivery tracker</p>
        </div>
        <Button onClick={handleAddProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No projects yet. Create your first project to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => {
            const service = services.find(s => s.id === project.serviceId);
            const client = leads.find(l => l.id === project.clientId);
            
            return (
              <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleProjectClick(project)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{service?.name || 'Unknown Service'}</CardTitle>
                    <Badge>{project.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{client?.name || 'Unknown Client'}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Number(project.completion)}%</span>
                    </div>
                    <Progress value={Number(project.completion)} />
                  </div>
                  {project.files.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {project.files.length} attachment{project.files.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ProjectDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        project={selectedProject}
      />
      <ProjectDetailDialog 
        project={selectedProject}
        open={detailDialogOpen} 
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
}
