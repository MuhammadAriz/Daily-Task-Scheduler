'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';

interface ScheduleDisplayProps {
  schedule: {taskDescription: string; startTime: string; endTime: string}[];
  isLoading: boolean;
}

export function ScheduleDisplay({schedule, isLoading}: ScheduleDisplayProps) {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[50%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          ) : schedule && schedule.length > 0 ? (
            <div className="grid gap-4">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{item.taskDescription}</span>
                  <span>
                    {item.startTime} - {item.endTime}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No tasks scheduled. Add tasks and generate a schedule!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
