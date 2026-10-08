import React, { useState } from 'react';
import { Bell, Clock, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Announcement } from '@/types/database';
import { formatPublishedDate } from '@/utils/dates';
import { PriorityIndicator } from '../common/PriorityIndicator';
import { EmptyState } from '../common/EmptyState';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  onSelectAnnouncement: (ann: Announcement) => void;
}

export function AnnouncementsSection({
  announcements,
  onSelectAnnouncement,
}: AnnouncementsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const activeAnnouncements = announcements
    .filter((a) => a.status === 'published')
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const visibleAnnouncements = showAll ? activeAnnouncements : activeAnnouncements.slice(0, 3);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Announcements
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Recent updates from our section
          </p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-slate-500">
          {activeAnnouncements.length} {activeAnnouncements.length === 1 ? 'notice' : 'notices'}
        </span>
      </div>

      {activeAnnouncements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No active announcements"
          description="Our section has no new broadcasts right now."
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {visibleAnnouncements.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAnnouncement(item)}
              className="-mx-1 cursor-pointer rounded-lg px-2 py-3 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectAnnouncement(item);
                }
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-slate-900 transition-colors group-hover:text-blue-800 line-clamp-1">
                  {item.title}
                </span>
                <PriorityIndicator priority={item.priority} />
              </div>

              <p className="mt-1 text-sm leading-5 text-slate-600 line-clamp-2">
                {item.content}
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {formatPublishedDate(item.published_at)}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="truncate">{item.created_by}</span>
                <ChevronRight className="ml-auto h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeAnnouncements.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {showAll ? 'Show recent only' : `View all ${activeAnnouncements.length} announcements`}
          {showAll ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      )}
    </section>
  );
}
