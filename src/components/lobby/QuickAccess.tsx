import React from 'react';
import { FolderGit2, ExternalLink, ArrowRight } from 'lucide-react';
import { Resource } from '@/types/database';
import { NavTab } from '../common/Navbar';

interface QuickAccessProps {
  resources: Resource[];
  onNavigateToTab: (tab: NavTab) => void;
}

export function QuickAccess({ resources, onNavigateToTab }: QuickAccessProps) {
  const activeResources = resources.filter((r) => r.status === 'active');

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Shared resources</h2>
          <p className="mt-1 text-xs text-slate-500">Class links and reference materials</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateToTab('resources')}
          className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          All resources <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {activeResources.length > 0 && (
        <div className="divide-y divide-slate-100">
            {activeResources.slice(0, 4).map((res) => (
              res.url ? (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="-mx-1 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <FolderGit2 className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">{res.title}</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                </a>
              ) : (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onNavigateToTab('resources')}
                  className="-mx-1 flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <FolderGit2 className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">{res.title}</span>
                </button>
              )
            ))}
        </div>
      )}

      {activeResources.length === 0 && (
        <div className="rounded-lg bg-slate-50 px-4 py-5 text-center">
          <FolderGit2 className="mx-auto h-5 w-5 text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700">No shared resources yet</p>
          <p className="mt-1 text-xs text-slate-500">Links added for our section will appear here.</p>
        </div>
      )}
    </section>
  );
}
