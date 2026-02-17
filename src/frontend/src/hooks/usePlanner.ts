import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useCurrentUserProfile';

export interface PlannerTask {
  day: number;
  date: Date;
  leadsTarget: number;
  outreachTarget: number;
  leadsCompleted: number;
  outreachCompleted: number;
  completed: boolean;
}

export interface PlannerPlan {
  id: string;
  startDate: Date;
  tasks: PlannerTask[];
}

// Simulated planner storage (in production, this would be backend-persisted)
let currentPlan: PlannerPlan | null = null;

export function useGetPlannerPlan() {
  const { data: profile } = useGetCallerUserProfile();

  return useQuery<PlannerPlan | null>({
    queryKey: ['planner', profile?.principal],
    queryFn: async () => {
      // Return the current plan from memory
      return currentPlan;
    },
    enabled: !!profile,
  });
}

export function useCreatePlannerPlan() {
  const queryClient = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();

  return useMutation({
    mutationFn: async () => {
      const startDate = new Date();
      const tasks: PlannerTask[] = [];

      for (let day = 1; day <= 30; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (day - 1));

        tasks.push({
          day,
          date,
          leadsTarget: 10,
          outreachTarget: 100,
          leadsCompleted: 0,
          outreachCompleted: 0,
          completed: false,
        });
      }

      const plan: PlannerPlan = {
        id: `plan-${Date.now()}`,
        startDate,
        tasks,
      };

      currentPlan = plan;
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', profile?.principal] });
    },
  });
}

export function useUpdatePlannerTask() {
  const queryClient = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();

  return useMutation({
    mutationFn: async ({ day, updates }: { day: number; updates: Partial<PlannerTask> }) => {
      if (!currentPlan) throw new Error('No active plan');

      const taskIndex = currentPlan.tasks.findIndex(t => t.day === day);
      if (taskIndex === -1) throw new Error('Task not found');

      currentPlan.tasks[taskIndex] = {
        ...currentPlan.tasks[taskIndex],
        ...updates,
      };

      return currentPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', profile?.principal] });
    },
  });
}
