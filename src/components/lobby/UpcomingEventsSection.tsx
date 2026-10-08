import React from 'react';
import { CalendarDays, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Event } from '@/types/database';
import { formatEventDateTime } from '@/utils/dates';
import { EmptyState } from '../common/EmptyState';

interface UpcomingEventsSectionProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onNavigateToCalendar: () => void;
}

export function UpcomingEventsSection({
  events,
  onSelectEvent,
  onNavigateToCalendar,
}: UpcomingEventsSectionProps) {
  const now = Date.now();
  const upcomingEvents = events
    .filter((e) => e.status === 'ongoing' || (e.status === 'upcoming' && new Date(e.starts_at).getTime() >= now))
    .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Upcoming events</h2>
          <p className="mt-1 text-xs text-slate-500">Exams and section activities</p>
        </div>
        <button
          onClick={onNavigateToCalendar}
          className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Calendar <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {upcomingEvents.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No upcoming events"
          description="There are no scheduled quizzes or activities on the calendar."
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {upcomingEvents.slice(0, 4).map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectEvent(evt);
                }
              }}
              className="-mx-1 flex cursor-pointer items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
            >
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                <span className="text-[10px] font-semibold uppercase leading-3">
                  {new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(evt.starts_at))}
                </span>
                <span className="text-base font-semibold leading-5 tabular-nums">
                  {new Intl.DateTimeFormat('en', { day: 'numeric' }).format(new Date(evt.starts_at))}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-slate-900 transition-colors group-hover:text-blue-800 line-clamp-1">
                  {evt.title}
                </h3>
                {evt.description && (
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                    {evt.description}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {formatEventDateTime(evt.starts_at, evt.ends_at)}
                  </span>
                  {evt.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {evt.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
