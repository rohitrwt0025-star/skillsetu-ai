import React, { useState, useMemo } from 'react';
import { ApplicationEntry, ApplicationStatus, OpportunityType } from '../types';
import { 
  ListTodo, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Building2, 
  MapPin, 
  AlertCircle, 
  Download, 
  Upload, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  X,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';

interface ApplicationTrackerProps {
  applications: ApplicationEntry[];
  onAddApplication: (entry: ApplicationEntry) => void;
  onUpdateApplication: (entry: ApplicationEntry) => void;
  onDeleteApplication: (id: string) => void;
  onImportApplications: (entries: ApplicationEntry[]) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
  onImportApplications,
}) => {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ApplicationEntry | null>(null);

  // Form states
  const [role, setRole] = useState('');
  const [org, setOrg] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<OpportunityType>('Apprenticeship (NATS)');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [expectedStipend, setExpectedStipend] = useState('');
  const [refNum, setRefNum] = useState('');

  const statuses: ApplicationStatus[] = [
    'Interested',
    'Applied',
    'Test/Interview',
    'Selected',
    'Not Selected',
  ];

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.notes.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || app.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const openAddModal = () => {
    setEditingEntry(null);
    setRole('');
    setOrg('');
    setLocation('');
    setType('Apprenticeship (NATS)');
    setAppliedDate(new Date().toISOString().split('T')[0]);
    setDeadline('');
    setStatus('Applied');
    setNotes('');
    setLink('');
    setExpectedStipend('');
    setRefNum('');
    setIsModalOpen(true);
  };

  const openEditModal = (entry: ApplicationEntry) => {
    setEditingEntry(entry);
    setRole(entry.role);
    setOrg(entry.organization);
    setLocation(entry.location);
    setType(entry.type);
    setAppliedDate(entry.appliedDate);
    setDeadline(entry.deadline);
    setStatus(entry.status);
    setNotes(entry.notes);
    setLink(entry.applicationLink || '');
    setExpectedStipend(entry.expectedStipend || '');
    setRefNum(entry.referenceNumber || '');
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !org) return;

    if (editingEntry) {
      const updated: ApplicationEntry = {
        ...editingEntry,
        role,
        organization: org,
        location,
        type,
        appliedDate,
        deadline,
        status,
        notes,
        applicationLink: link,
        expectedStipend,
        referenceNumber: refNum,
        updatedAt: new Date().toISOString(),
      };
      onUpdateApplication(updated);
    } else {
      const newEntry: ApplicationEntry = {
        id: `app-${Date.now()}`,
        role,
        organization: org,
        location: location || 'Open Location',
        type,
        appliedDate,
        deadline: deadline || '2026-11-30',
        status,
        notes,
        applicationLink: link,
        expectedStipend,
        referenceNumber: refNum,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddApplication(newEntry);
    }

    setIsModalOpen(false);
  };

  // Export JSON backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(applications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `skillsetu_applications_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportApplications(parsed);
          alert(`Successfully imported ${parsed.length} applications!`);
        }
      } catch {
        alert('Invalid JSON file format. Please upload a valid SkillSetu backup file.');
      }
    };
    reader.readAsText(file);
  };

  const statusColorMap: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
    Interested: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
    Applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Test/Interview': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    Selected: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    'Not Selected': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Career Pipeline Management</span>
            <span aria-hidden="true">·</span>
            <span>Private Browser-Local Storage</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Application Tracker</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log recruitment drives, test dates, and follow-ups. Everything is stored directly in your browser.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Backup Actions */}
          <button
            onClick={handleExportJson}
            title="Download JSON Backup"
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          {/* Add New Application Button */}
          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Honest Local Data Storage Disclaimer Box */}
      <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800">
            Local Browser Storage Active
          </p>
          <p className="leading-relaxed">
            Your application entries are stored strictly in this browser’s private LocalStorage for maximum privacy. They do not sync automatically across multiple phones or laptops unless you export and import the backup JSON file.
          </p>
        </div>
      </div>

      {/* Search & View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search role, organization, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-start">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
          >
            <option value="All">All Statuses ({applications.length})</option>
            {statuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <div className="p-1 bg-slate-100 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'board' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80 p-8">
          <ListTodo className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No applications found in this view</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Start tracking recruitment drives, campus DET visits, and NATS applications to stay on top of test dates.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            + Add First Application
          </button>
        </div>
      ) : viewMode === 'board' ? (
        /* Board / Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statuses.map((columnStatus) => {
            const columnEntries = filteredApps.filter(a => a.status === columnStatus);
            return (
              <div
                key={columnStatus}
                className="bg-slate-50/80 rounded-xl border border-slate-200/70 p-3 flex flex-col min-h-[420px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{columnStatus}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                    {columnEntries.length}
                  </span>
                </div>

                {/* Cards in this column */}
                <div className="space-y-2.5 flex-1">
                  {columnEntries.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 bg-white rounded-lg border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all text-xs space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-slate-900 line-clamp-1">{app.role}</span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteApplication(app.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        <span className="font-medium text-slate-800 block truncate">{app.organization}</span>
                        <span className="text-slate-400 block truncate">{app.location}</span>
                      </div>

                      {app.expectedStipend && (
                        <div className="text-[11px] font-semibold text-slate-700">
                          {app.expectedStipend}
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                          {app.notes}
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Due: {app.deadline || 'N/A'}</span>
                        {app.applicationLink && (
                          <a
                            href={app.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-0.5"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {columnEntries.length === 0 && (
                    <div className="text-center py-8 text-[11px] text-slate-400">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table List View */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Role & Organization</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes / Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{app.role}</span>
                    <span className="text-[11px] text-slate-500">{app.organization} · {app.location}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{app.type}</td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap">{app.appliedDate}</td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap text-amber-700">{app.deadline}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${statusColorMap[app.status].bg} ${statusColorMap[app.status].text} ${statusColorMap[app.status].border}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-500">
                    {app.notes || '—'}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(app)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingEntry ? 'Edit Application Record' : 'Log New Application'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Role Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Technician Apprentice"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bharat Electronics Ltd"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru / Pune"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as OpportunityType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
                  >
                    <option value="Apprenticeship (NATS)">Apprenticeship (NATS)</option>
                    <option value="Private Industry">Private Industry (DET)</option>
                    <option value="PSU Trainee">PSU Trainee</option>
                    <option value="Lateral Entry">Lateral Entry (B.Tech)</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Applied Date</label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Deadline / Test Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pipeline Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold focus:outline-none"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Expected Stipend / CTC</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹15,000/mo"
                    value={expectedStipend}
                    onChange={(e) => setExpectedStipend(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Reference / Enrollment ID</label>
                  <input
                    type="text"
                    placeholder="e.g. NATS/BEL/8942"
                    value={refNum}
                    onChange={(e) => setRefNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Application URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Interview Rounds / Reminders</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Technical written test syllabus covers basic electronic components and 8051 timers. Admit card download starts Monday."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
                >
                  {editingEntry ? 'Update Entry' : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
