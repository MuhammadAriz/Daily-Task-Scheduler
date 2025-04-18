// src/ai/flows/suggest-schedule.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest an optimal schedule for the user's tasks based on their priorities and constraints.
 *
 * - suggestSchedule - A function that suggests the schedule
 * - SuggestScheduleInput - The input type for the suggestSchedule function.
 * - SuggestScheduleOutput - The return type for the suggestSchedule function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestScheduleInputSchema = z.object({
  tasks: z
    .array(
      z.object({
        description: z.string().describe('The description of the task.'),
        priority: z.enum(['high', 'medium', 'low']).describe('The priority of the task.'),
        duration: z.number().describe('The duration of the task in minutes.'),
        constraints: z.string().optional().describe('Any constraints on when the task can be done, e.g., "only in the morning"'),
      })
    )
    .describe('The list of tasks to schedule.'),
  availableTime: z.string().describe('The total available time for scheduling in minutes.'),
});

export type SuggestScheduleInput = z.infer<typeof SuggestScheduleInputSchema>;

const SuggestScheduleOutputSchema = z.object({
  schedule: z.array(
    z.object({
      taskDescription: z.string().describe('The description of the task.'),
      startTime: z.string().describe('The suggested start time for the task (e.g., 9:00 AM).'),
      endTime: z.string().describe('The suggested end time for the task (e.g., 10:00 AM).'),
    })
  ).describe('The suggested schedule for the day.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested schedule.'),
});

export type SuggestScheduleOutput = z.infer<typeof SuggestScheduleOutputSchema>;

export async function suggestSchedule(input: SuggestScheduleInput): Promise<SuggestScheduleOutput> {
  return suggestScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSchedulePrompt',
  input: {
    schema: z.object({
      tasks: z
        .array(
          z.object({
            description: z.string().describe('The description of the task.'),
            priority: z.enum(['high', 'medium', 'low']).describe('The priority of the task.'),
            duration: z.number().describe('The duration of the task in minutes.'),
            constraints: z.string().optional().describe('Any constraints on when the task can be done, e.g., "only in the morning"'),
          })
        )
        .describe('The list of tasks to schedule.'),
      availableTime: z.string().describe('The total available time for scheduling in minutes.'),
    }),
  },
  output: {
    schema: z.object({
      schedule: z.array(
        z.object({
          taskDescription: z.string().describe('The description of the task.'),
          startTime: z.string().describe('The suggested start time for the task (e.g., 9:00 AM).'),
          endTime: z.string().describe('The suggested end time for the task (e.g., 10:00 AM).'),
        })
      ).describe('The suggested schedule for the day.'),
      reasoning: z.string().describe('The AI reasoning behind the suggested schedule.'),
    }),
  },
  prompt: `You are an AI assistant that helps users create a daily schedule. Given the following tasks, their priorities, durations and constraints, and the available time, create an optimal schedule.

Tasks:
{{#each tasks}}
- Description: {{this.description}}, Priority: {{this.priority}}, Duration: {{this.duration}} minutes, Constraints: {{this.constraints}}
{{/each}}

Available Time: {{availableTime}} minutes

Prioritize tasks based on their priority, and respect any constraints.
Return the schedule in the format of a JSON array, with each element containing the task description, start time, and end time. Also, include a reasoning section explaining how you arrived at the schedule.
`, // Ensure proper JSON formatting and include reasoning
});

const suggestScheduleFlow = ai.defineFlow<
  typeof SuggestScheduleInputSchema,
  typeof SuggestScheduleOutputSchema
>(
  {
    name: 'suggestScheduleFlow',
    inputSchema: SuggestScheduleInputSchema,
    outputSchema: SuggestScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

