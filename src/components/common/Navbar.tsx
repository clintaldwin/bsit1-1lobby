import React, { useEffect, useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  UserCheck, 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  FileText, 
  FolderGit2,
  House,
  Megaphone,
  MoreHorizontal,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Section } from '@/types/database';

export type NavTab = 
  | 'lobby' 
  | 'assignments' 
  | 'tasks' 
  | 'calendar' 
  | 'notes' 
  | 'resources' 
  | 'admin';

interface NavbarProps {
  section: Section | null;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenSearch: () => void;
}

export function Navbar({
  section,
  activeTab,
  onTabChange,
  isAdminMode,
  onToggleAdminMode,
  onOpenSearch,
}: NavbarProps) {
  const isStudentLobby = activeTab === 'lobby' && !isAdminMode;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [activeLobbyAnchor, setActiveLobbyAnchor] = useState<'home' | 'announcements'>(
    () => window.location.hash === '#announcements' ? 'announcements' : 'home',
  );
  useEffect(() => {
    const updateActiveAnchor = () => {
      setActiveLobbyAnchor(window.location.hash === '#announcements' ? 'announcements' : 'home');
    };
    window.addEventListener('hashchange', updateActiveAnchor);
    return () => window.removeEventListener('hashchange', updateActiveAnchor);
  }, []);
  const navLinks: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
    { id: 'lobby', label: 'Lobby', icon: LayoutDashboard },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Schedule', icon: CalendarIcon },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'resources', label: 'Resources', icon: FolderGit2 },
  ];

  const navigateStudent = (tab: NavTab) => {
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
    if (tab !== 'admin') {
      setActiveLobbyAnchor('home');
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    onTabChange(tab);
    if (tab === 'lobby') {
      window.requestAnimationFrame(() => {
        document.getElementById('lobby-home')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const openAnnouncements = () => {
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
    setActiveLobbyAnchor('announcements');
    if (activeTab !== 'lobby') onTabChange('lobby');
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#announcements`);
    window.requestAnimationFrame(() => {
      document.getElementById('announcements')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <>
      {/* Desktop & Mobile Top Bar adhering to the 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text wordmark */}
          <div className="flex min-w-0 items-center gap-3">
            {!isAdminMode && (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#173353] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
                aria-label={isMobileMenuOpen ? 'Close section menu' : 'Open section menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
            <button
              onClick={() => navigateStudent('lobby')}
              className={`${isAdminMode ? 'text-base font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-80 text-left' : 'hidden text-base font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-80 text-left lg:block'}`}
            >
              Section Lobby
            </button>
            {!isAdminMode && (
              <div className="min-w-0 lg:hidden">
                <p className="truncate text-sm font-semibold leading-4 text-[#173353]">
                  {section?.code || 'Section Lobby'}
                </p>
                <p className="mt-0.5 text-[11px] leading-3 text-slate-500">Section Lobby</p>
              </div>
            )}
            {section && (
              <span className={`${isAdminMode ? 'hidden sm:inline-flex items-center text-xs text-neutral-500 font-mono' : 'hidden items-center text-xs font-mono text-neutral-500 lg:inline-flex'}`}>
                <span className="mr-2 text-neutral-300">/</span>
                {section.code}
              </span>
            )}
          </div>

          {/* Zone 2: 4-6 text navigation links (hidden on mobile, shown in bottom bar) */}
          {!isStudentLobby && (
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-600">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id && !isAdminMode;
                return (
                  <button
                    key={link.id}
                    onClick={() => onTabChange(link.id)}
                    className={`relative py-1 transition-colors hover:text-neutral-900 ${
                      isActive ? 'text-neutral-950 font-semibold' : ''
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMoreMenuOpen(false);
                onOpenSearch();
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200/80"
              title="Search Section Lobby"
              aria-label="Search Section Lobby"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline-block text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded border border-neutral-200">
                /
              </kbd>
            </button>

            {/* Admin Switcher Toggle */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMoreMenuOpen(false);
                onToggleAdminMode();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                isAdminMode
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {isAdminMode ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Console</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="hidden sm:inline">Student View</span>
                  <span className="sm:hidden">Student</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {isMobileMenuOpen && !isAdminMode && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close section menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/45"
          />
          <aside className="relative flex h-full w-[min(19rem,86vw)] flex-col overflow-y-auto bg-[#173353] px-4 py-5 text-white shadow-2xl">
            <div className="mb-7 flex items-center gap-3 px-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/15 text-blue-100 ring-1 ring-inset ring-blue-200/15">
                <BookOpen className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-blue-100">{section?.code || 'Section Lobby'}</p>
                <p className="text-xs text-blue-200/75">Section Lobby</p>
              </div>
            </div>

            <nav aria-label="Mobile section navigation" className="space-y-1.5">
              <button
                type="button"
                onClick={() => navigateStudent('lobby')}
                className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors ${activeTab === 'lobby' && activeLobbyAnchor === 'home' ? 'bg-blue-500/25 font-medium text-white ring-1 ring-inset ring-blue-300/20' : 'text-blue-100/80 hover:bg-white/10 hover:text-white'}`}
              >
                <House className="h-4 w-4" strokeWidth={1.8} />Home
              </button>
              <button
                type="button"
                onClick={openAnnouncements}
                className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors ${activeTab === 'lobby' && activeLobbyAnchor === 'announcements' ? 'bg-blue-500/25 font-medium text-white ring-1 ring-inset ring-blue-300/20' : 'text-blue-100/80 hover:bg-white/10 hover:text-white'}`}
              >
                <Megaphone className="h-4 w-4" strokeWidth={1.8} />Announcements
              </button>
              {navLinks.filter((link) => link.id !== 'lobby').map((link) => {
                const Icon = link.icon;
                const label = link.id === 'calendar' ? 'Events' : link.label;
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => navigateStudent(link.id)}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors ${activeTab === link.id ? 'bg-blue-500/25 font-medium text-white ring-1 ring-inset ring-blue-300/20' : 'text-blue-100/80 hover:bg-white/10 hover:text-white'}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />{label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-white/15 pt-4">
              <button
                type="button"
                onClick={() => navigateStudent('admin')}
                className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-blue-100/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                <span className="flex-1">Admin Dashboard</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Mobile student navigation follows the compact reference layout. */}
      {!isAdminMode ? (
        <div className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden">
          {isMoreMenuOpen && (
            <div className="absolute bottom-full right-3 mb-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {[
                { id: 'assignments' as NavTab, label: 'Assignments', icon: BookOpen },
                { id: 'calendar' as NavTab, label: 'Events', icon: CalendarIcon },
                { id: 'resources' as NavTab, label: 'Resources', icon: FolderGit2 },
                { id: 'admin' as NavTab, label: 'Admin Dashboard', icon: ShieldCheck },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigateStudent(id)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Icon className="h-4 w-4 text-[#244b78]" />{label}
                </button>
              ))}
            </div>
          )}

          <nav aria-label="Mobile primary navigation" className="grid h-16 grid-cols-5 items-center px-1">
            <button
              type="button"
              onClick={() => navigateStudent('lobby')}
              aria-current={activeTab === 'lobby' && activeLobbyAnchor === 'home' ? 'page' : undefined}
              className={`flex h-full min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${activeTab === 'lobby' && activeLobbyAnchor === 'home' ? 'font-semibold text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <House className="h-[18px] w-[18px]" />Home
            </button>
            <button
              type="button"
              onClick={openAnnouncements}
              aria-current={activeTab === 'lobby' && activeLobbyAnchor === 'announcements' ? 'page' : undefined}
              className={`flex h-full min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${activeTab === 'lobby' && activeLobbyAnchor === 'announcements' ? 'font-semibold text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Megaphone className="h-[18px] w-[18px]" />Announcements
            </button>
            <button
              type="button"
              onClick={() => navigateStudent('tasks')}
              aria-current={activeTab === 'tasks' ? 'page' : undefined}
              className={`flex h-full min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${activeTab === 'tasks' ? 'font-semibold text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <CheckSquare className="h-[18px] w-[18px]" />Tasks
            </button>
            <button
              type="button"
              onClick={() => navigateStudent('notes')}
              aria-current={activeTab === 'notes' ? 'page' : undefined}
              className={`flex h-full min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${activeTab === 'notes' ? 'font-semibold text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <FileText className="h-[18px] w-[18px]" />Notes
            </button>
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen((open) => !open)}
              aria-expanded={isMoreMenuOpen}
              aria-label="More section links"
              className={`flex h-full min-h-11 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${isMoreMenuOpen || ['assignments', 'calendar', 'resources'].includes(activeTab) ? 'font-semibold text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <MoreHorizontal className="h-[18px] w-[18px]" />More
            </button>
          </nav>
        </div>
      ) : (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 safe-bottom">
          <nav className="grid grid-cols-5 items-center h-14 px-2">
            {navLinks.slice(0, 4).map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id && !isAdminMode;
              return (
                <button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                    isActive ? 'text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[56px]">{link.label}</span>
                </button>
              );
            })}

            {/* 5th Mobile Tab: More / Admin Toggle or Resources */}
            <button
              onClick={() => onTabChange(isAdminMode ? 'lobby' : 'admin')}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isAdminMode ? 'text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${isAdminMode ? 'stroke-[2.5] text-neutral-900' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[56px]">
                {isAdminMode ? 'Admin' : 'More'}
              </span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
