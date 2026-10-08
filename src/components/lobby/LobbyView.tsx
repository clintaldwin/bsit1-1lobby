import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  FolderOpen,
  House,
  ListChecks,
  Megaphone,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Section,
  Announcement,
  Assignment,
  Task,
  Note,
  Event,
  Resource,
  TaskStatus,
  AssignmentStatus,
} from '@/types/database';
import { DueSoonSection } from './DueSoonSection';
import { AnnouncementsSection } from './AnnouncementsSection';
import { UpcomingEventsSection } from './UpcomingEventsSection';
import { RecentNotesSection } from './RecentNotesSection';
import { QuickAccess } from './QuickAccess';
import { NavTab } from '../common/Navbar';

interface LobbyViewProps {
  section: Section | null;
  announcements: Announcement[];
  assignments: Assignment[];
  tasks: Task[];
  notes: Note[];
  events: Event[];
  resources: Resource[];
  onSelectAssignment: (asg: Assignment) => void;
  onSelectAnnouncement: (ann: Announcement) => void;
  onSelectEvent: (evt: Event) => void;
  onSelectNote: (note: Note) => void;
  onToggleTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onToggleAssignmentStatus: (asgId: string, newStatus: AssignmentStatus) => void;
  onNavigateToTab: (tab: NavTab) => void;
}

const lobbyLinks = [
  { label: 'Home', icon: House, anchor: '#lobby-home' },
  { label: 'Announcements', icon: Megaphone, anchor: '#announcements' },
  { label: 'Assignments', icon: BookOpen, tab: 'assignments' as NavTab },
  { label: 'Tasks', icon: ListChecks, tab: 'tasks' as NavTab },
  { label: 'Notes', icon: FileText, tab: 'notes' as NavTab },
  { label: 'Events', icon: CalendarDays, tab: 'calendar' as NavTab },
  { label: 'Resources', icon: FolderOpen, tab: 'resources' as NavTab },
];

interface LobbyLinkProps {
  compact?: boolean;
  onNavigateToTab: (tab: NavTab) => void;
}

interface MobileQuickLink {
  label: string;
  detail: string;
  icon: LucideIcon;
  tone: string;
  tab?: NavTab;
  anchor?: string;
}

function LobbyLinks({ compact = false, onNavigateToTab }: LobbyLinkProps) {
  return (
    <>
      {lobbyLinks.map(({ label, icon: Icon, anchor, tab }) => {
        const selected = label === 'Home';
        const className = compact
          ? `inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selected
                ? 'border-blue-200 bg-blue-50 text-blue-900'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`
          : `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ${
              selected
                ? 'bg-blue-500/25 font-medium text-white ring-1 ring-inset ring-blue-300/20'
                : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
            }`;
        const contents = (
          <>
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <span>{label}</span>
          </>
        );

        if (anchor) {
          return (
            <a
              key={label}
              href={anchor}
              aria-current={selected ? 'page' : undefined}
              className={className}
            >
              {contents}
            </a>
          );
        }

        return (
          <button
            key={label}
            type="button"
            onClick={() => tab && onNavigateToTab(tab)}
            className={className}
          >
            {contents}
          </button>
        );
      })}
    </>
  );
}

export function LobbyView({
  section,
  announcements,
  assignments,
  tasks,
  notes,
  events,
  resources,
  onSelectAssignment,
  onSelectAnnouncement,
  onSelectEvent,
  onSelectNote,
  onToggleTaskStatus,
  onNavigateToTab,
}: LobbyViewProps) {
  const assignmentCount = assignments.filter((item) => item.status === 'pending').length;
  const taskCount = tasks.filter((item) => item.status !== 'completed' && item.status !== 'archived').length;
  const noteCount = notes.filter((item) => item.status === 'published').length;
  const resourceCount = resources.filter((item) => item.status === 'active').length;
  const sectionContext = [section?.academic_year, section?.semester].filter(Boolean).join(' · ');

  const summaryLinks = [
    {
      label: 'Assignments',
      detail: `${assignmentCount} pending`,
      count: assignmentCount,
      icon: BookOpen,
      tab: 'assignments' as NavTab,
      tone: 'bg-blue-50 text-blue-800',
    },
    {
      label: 'Tasks',
      detail: `${taskCount} active`,
      count: taskCount,
      icon: ListChecks,
      tab: 'tasks' as NavTab,
      tone: 'bg-emerald-50 text-emerald-800',
    },
    {
      label: 'Notes',
      detail: `${noteCount} published`,
      count: noteCount,
      icon: FileText,
      tab: 'notes' as NavTab,
      tone: 'bg-violet-50 text-violet-800',
    },
    {
      label: 'Resources',
      detail: `${resourceCount} available`,
      count: resourceCount,
      icon: FolderOpen,
      tab: 'resources' as NavTab,
      tone: 'bg-rose-50 text-rose-800',
    },
  ];

  const quickLinks = [
    { label: 'Assignments', detail: `${assignmentCount} pending`, icon: BookOpen, tab: 'assignments' as NavTab },
    { label: 'Tasks', detail: `${taskCount} active`, icon: ListChecks, tab: 'tasks' as NavTab },
    { label: 'Notes', detail: `${noteCount} published`, icon: FileText, tab: 'notes' as NavTab },
    { label: 'Events', detail: 'Section calendar', icon: CalendarDays, tab: 'calendar' as NavTab },
    { label: 'Admin Dashboard', detail: 'Requires admin verification', icon: ShieldCheck, tab: 'admin' as NavTab },
  ];

  const mobileQuickLinks: MobileQuickLink[] = [
    ...summaryLinks.map(({ label, detail, icon, tab, tone }) => ({ label, detail, icon, tab, tone })),
    { label: 'Events', detail: 'Calendar', icon: CalendarDays, tab: 'calendar' as NavTab, tone: 'bg-sky-50 text-sky-800' },
    { label: 'Announcements', detail: 'Recent updates', icon: Megaphone, anchor: '#announcements', tone: 'bg-amber-50 text-amber-800' },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 pb-20 text-slate-900 lg:pb-0">
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="hidden bg-[#173353] text-white lg:block">
          <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col px-4 py-6">
            <div className="mb-9 flex items-center gap-3 px-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/15 text-blue-100 ring-1 ring-inset ring-blue-200/15">
                <BookOpen className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-tight text-blue-100">
                  {section?.code || 'Section Lobby'}
                </p>
                <p className="text-xs text-blue-200/75">Student lobby</p>
              </div>
            </div>

            <nav aria-label="Section navigation" className="space-y-1.5">
              <LobbyLinks onNavigateToTab={onNavigateToTab} />
            </nav>

            <div className="mt-auto border-t border-white/15 pt-4">
              <p className="px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-blue-200/65">
                Current section
              </p>
              <p className="mt-1 truncate px-3 text-sm text-blue-50">
                {section?.name || section?.code || 'Section details unavailable'}
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="grid min-w-0 grid-cols-1 gap-6 px-4 py-5 sm:px-6 sm:py-7 xl:grid-cols-[minmax(0,1fr)_17.5rem] xl:gap-7 xl:px-8">
            <div className="min-w-0 space-y-6">
              <header id="lobby-home" className="scroll-mt-20">
                <p className="text-sm font-medium text-slate-500">
                  {sectionContext || 'Section Lobby'}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#173353] sm:text-3xl">
                  Welcome to {section?.name || section?.code || 'our section'}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Here’s what’s happening in our section.
                </p>
              </header>

              <section className="relative isolate overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-5 py-5 sm:px-7 sm:py-6">
                <div className="relative z-10 max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                    {section?.code || 'Section'} section
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#173353] sm:text-2xl">
                    Learn <span className="px-1 text-blue-500">·</span> Collaborate <span className="px-1 text-blue-500">·</span> Grow
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    Stay updated with announcements, assignments, study notes, and important dates.
                  </p>
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-3 right-6 hidden items-end gap-2 text-blue-700/75 sm:flex">
                  <span className="flex h-12 w-16 items-center justify-center rounded-t-xl border border-blue-100 bg-white shadow-sm">
                    <BookOpen className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <span className="flex h-[4.25rem] w-16 items-center justify-center rounded-t-xl border border-blue-200 bg-blue-100/80 shadow-sm">
                    <FileText className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <span className="flex h-14 w-16 items-center justify-center rounded-t-xl border border-sky-100 bg-white shadow-sm">
                    <FolderOpen className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                </div>
              </section>

              <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
                <div id="announcements" className="min-w-0 scroll-mt-20">
                  <AnnouncementsSection
                    announcements={announcements}
                    onSelectAnnouncement={onSelectAnnouncement}
                  />
                </div>
                <section aria-label="Quick links" className="rounded-2xl border border-slate-200 bg-white p-4 xl:hidden">
                  <h2 className="text-base font-semibold text-[#173353]">Quick links</h2>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {mobileQuickLinks.map(({ label, detail, icon: Icon, tab, anchor, tone }) => {
                      const className = 'flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-1.5 py-2 text-center transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';
                      const contents = (
                        <>
                          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                          </span>
                          <span className="block max-w-full truncate text-[10px] font-medium leading-3 text-slate-800">{label}</span>
                          <span className="block max-w-full truncate text-[9px] leading-3 text-slate-500">{detail}</span>
                        </>
                      );

                      if (anchor) {
                        return <a key={label} href={anchor} className={className}>{contents}</a>;
                      }

                      return (
                        <button key={label} type="button" onClick={() => tab && onNavigateToTab(tab)} className={className}>
                          {contents}
                        </button>
                      );
                    })}
                  </div>
                </section>
                <UpcomingEventsSection
                  events={events}
                  onSelectEvent={onSelectEvent}
                  onNavigateToCalendar={() => onNavigateToTab('calendar')}
                />
              </div>

              <section aria-label="Section content summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {summaryLinks.map(({ label, detail, count, icon: Icon, tab, tone }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onNavigateToTab(tab)}
                    className="group flex min-h-[88px] items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:p-4"
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold leading-5 tabular-nums text-slate-900">{count}</span>
                      <span className="mt-1 block truncate text-xs font-medium text-slate-700 group-hover:text-blue-900">{label}</span>
                      <span className="block truncate text-[11px] text-slate-500">{detail}</span>
                    </span>
                  </button>
                ))}
              </section>

              <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(260px,.9fr)]">
                <DueSoonSection
                  assignments={assignments}
                  tasks={tasks}
                  onToggleTaskStatus={onToggleTaskStatus}
                  onSelectAssignment={onSelectAssignment}
                  onNavigateToTab={onNavigateToTab}
                />
                <div className="min-w-0 space-y-5">
                  <RecentNotesSection
                    notes={notes}
                    onSelectNote={onSelectNote}
                    onNavigateToNotes={() => onNavigateToTab('notes')}
                  />
                  <QuickAccess
                    resources={resources}
                    onNavigateToTab={onNavigateToTab}
                  />
                </div>
              </div>
            </div>

            <aside className="hidden min-w-0 space-y-5 xl:sticky xl:top-20 xl:self-start xl:block">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <h2 className="text-base font-semibold text-[#173353]">Quick links</h2>
                <div className="mt-3 space-y-2">
                  {quickLinks.map(({ label, detail, icon: Icon, tab }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => onNavigateToTab(tab)}
                      className="group flex min-h-12 w-full items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-left transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[#244b78]" strokeWidth={1.8} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-800">{label}</span>
                        <span className="block truncate text-[11px] text-slate-500">{detail}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-800" />
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <h2 className="text-base font-semibold text-[#173353]">Section info</h2>
                {section ? (
                  <div className="mt-3 rounded-xl bg-blue-50/70 p-4">
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                      <UsersRound className="h-5 w-5" />
                    </span>
                    <p className="font-semibold text-slate-900">{section.name || section.code}</p>
                    <p className="mt-1 text-sm text-slate-600">{section.code}</p>
                    {sectionContext && (
                      <p className="mt-3 border-t border-blue-100 pt-3 text-xs text-slate-600">
                        {sectionContext}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    Section information is unavailable.
                  </p>
                )}
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
