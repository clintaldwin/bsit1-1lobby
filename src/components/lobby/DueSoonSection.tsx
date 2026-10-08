import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  ArrowRight, 
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { Assignment, Task } from '@/types/database';
import { calculateDeadlineInfo } from '@/utils/dates';
import { PriorityIndicator } from '../common/PriorityIndicator';
import { EmptyState } from '../common/EmptyState';

interface DueSoonSectionProps {
  assignments: Assignment[];
  tasks: Task[];
  onToggleTaskStatus: (taskId: string, newStatus: any) => void;
  onSelectAssignment: (asg: Assignment) => void;
  onNavigateToTab: (tab: any) => void;
}

export function DueSoonSection({
  assignments,
  tasks,
  onToggleTaskStatus,
  onSelectAssignment,
  onNavigateToTab,
}: DueSoonSectionProps) {
  const [filterType, setFilterType] = useState<'all' | 'assignments' | 'tasks'>('all');

  // Prepare assignments with deadline info
  const pendingAssignments = assignments
    .filter((a) => a.status !== 'completed' && a.status !== 'archived')
    .map((a) => ({
      itemType: 'assignment' as const,
      id: a.id,
      title: a.title,
      subject: a.subject,
      description: a.description,
      priority: a.priority,
      due_at: a.due_at,
      status: a.status,
      original: a,
      deadline: calculateDeadlineInfo(a.due_at),
    }));

  // Prepare tasks with deadline info
  const pendingTasks = tasks
    .filter((t) => t.status !== 'completed' && t.status !== 'archived')
    .map((t) => ({
      itemType: 'task' as const,
      id: t.id,
      title: t.title,
      subject: t.assigned_to ? `Assigned: ${t.assigned_to}` : 'Section Task',
      description: t.description,
      priority: t.priority,
      due_at: t.due_at,
      status: t.status,
      original: t,
      deadline: calculateDeadlineInfo(t.due_at),
    }));

  const allItems = [...pendingAssignments, ...pendingTasks]
    .filter((item) => {
      if (filterType === 'assignments') return item.itemType === 'assignment';
      if (filterType === 'tasks') return item.itemType === 'task';
      return true;
    })
    .sort((a, b) => a.deadline.diffHours - b.deadline.diffHours);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      
      {/* Header with segmented filter buttons */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Assignments & tasks</h2>
          <p className="mt-1 text-xs text-slate-500">Upcoming deadlines, nearest first</p>
        </div>

        {/* Filter buttons */}
        <div className="flex max-w-full items-center gap-1 self-start overflow-x-auto rounded-lg bg-slate-100 p-1 sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items ({pendingAssignments.length + pendingTasks.length})
          </button>
          <button
            onClick={() => setFilterType('assignments')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'assignments'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assignments ({pendingAssignments.length})
          </button>
          <button
            onClick={() => setFilterType('tasks')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              filterType === 'tasks'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tasks ({pendingTasks.length})
          </button>
        </div>
      </div>

      {/* Item List */}
      {allItems.length === 0 ? (
        <EmptyState
          title="No pending deadlines"
          description="There are no open assignments or tasks to show right now."
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {allItems.slice(0, 5).map((item) => {
            const isAssignment = item.itemType === 'assignment';
            const dl = item.deadline;

            return (
              <div
                key={`${item.itemType}_${item.id}`}
                className="group -mx-1 flex items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50"
              >
                {/* Checkbox for tasks, or Icon for assignments */}
                {isAssignment ? (
                  <button
                    onClick={() => onSelectAssignment(item.original as Assignment)}
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    title="View assignment details"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleTaskStatus(item.id, 'completed')}
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    title="Mark task completed"
                  >
                    <Circle className="w-4 h-4" />
                  </button>
                )}

                {/* Content */}
                <div 
                  className="min-w-0 flex-1 cursor-pointer"
                  onClick={() => {
                    if (isAssignment) onSelectAssignment(item.original as Assignment);
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900 transition-colors group-hover:text-blue-800 line-clamp-1">
                      {item.title}
                    </span>
                    <PriorityIndicator priority={item.priority} />
                  </div>

                  <p className="mt-1 text-xs text-slate-600 line-clamp-1">
                    {item.description}
                  </p>

                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tabular-nums text-slate-500">
                    <span className="font-medium text-slate-600">{item.subject}</span>
                    <span
                      className={`flex items-center gap-1.5 ${
                        dl.isOverdue
                          ? 'text-rose-700 font-semibold'
                          : dl.isDueToday
                          ? 'text-amber-700 font-semibold'
                          : dl.isDueTomorrow
                          ? 'text-amber-800 font-medium'
                          : 'text-slate-600'
                      }`}
                    >
                      {dl.isOverdue && <AlertTriangle className="w-3 h-3 text-rose-600 inline" />}
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {dl.relativeLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {allItems.length > 5 && (
            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigateToTab(filterType === 'tasks' ? 'tasks' : 'assignments')}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                View all {allItems.length} deliverables
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

    </section>
  );
}
