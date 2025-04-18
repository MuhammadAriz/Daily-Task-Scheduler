'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInput,
  SidebarInset,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {Icons} from '@/components/icons';
import {TaskInput} from '@/components/task-input';
import {ScheduleDisplay} from '@/components/schedule-display';
import {useToast} from '@/hooks/use-toast';
import {useState} from 'react';
import {suggestSchedule} from '@/ai/flows/suggest-schedule';

export function Dashboard() {
  const {toast} = useToast();
  const [schedule, setSchedule] = useState<any>([]); // Replace 'any' with your schedule type
  const [isLoading, setIsLoading] = useState(false);

  const handleScheduleUpdate = async (tasks: any[]) => {
    // Example: Assuming tasks have description, priority, duration, constraints
    setIsLoading(true);
    try {
      const availableTime = '480'; // Example: 8 hours in minutes
      const suggestedSchedule = await suggestSchedule({tasks, availableTime});
      setSchedule(suggestedSchedule.schedule);
      toast({
        title: 'Schedule Generated',
        description: 'AI-powered schedule generated successfully!',
      });
    } catch (error: any) {
      console.error('Error generating schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate schedule. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarInput placeholder="Search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Icons.home className="mr-2 h-4 w-4" />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Icons.settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <p className="px-2 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} DayWise
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="container relative pb-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between py-6">
            <h1 className="text-3xl font-bold tracking-tight">DayWise</h1>
            <SidebarTrigger asChild>
              <Button variant="outline">Toggle Sidebar</Button>
            </SidebarTrigger>
          </div>
          <main className="mx-auto max-w-7xl py-6">
            <TaskInput onTaskSubmit={handleScheduleUpdate} />
            <ScheduleDisplay schedule={schedule} isLoading={isLoading} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
