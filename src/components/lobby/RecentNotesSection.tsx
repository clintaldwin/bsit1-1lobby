import React from 'react';
import { FileText, ArrowRight, ExternalLink, User } from 'lucide-react';
import { Note } from '@/types/database';
import { EmptyState } from '../common/EmptyState';

interface RecentNotesSectionProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onNavigateToNotes: () => void;
}

export function RecentNotesSection({
  notes,
  onSelectNote,
  onNavigateToNotes,
}: RecentNotesSectionProps) {
  const publishedNotes = notes.filter((n) => n.status === 'published');

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Recent notes</h2>
          <p className="mt-1 text-xs text-slate-500">Study guides and class materials</p>
        </div>
        <button
          onClick={onNavigateToNotes}
          className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          All notes <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {publishedNotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes shared yet"
          description="Class lecture reviewers or study notes will appear here once published."
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {publishedNotes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectNote(note);
                }
              }}
              className="-mx-1 cursor-pointer rounded-lg px-2 py-3 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
            >
              <div>
                {note.subject && (
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    {note.subject}
                  </span>
                )}
                <h3 className="mb-1 text-sm font-medium text-slate-900 transition-colors group-hover:text-blue-800 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-xs leading-5 text-slate-600 line-clamp-2">
                  {note.content}
                </p>
                {note.url && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-800">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span>Source Material</span>
                  </div>
                )}
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{note.author}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
