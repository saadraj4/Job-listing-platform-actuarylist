import { useState, useEffect, useMemo } from 'react';
import { Plus, Briefcase, Moon, Sun } from 'lucide-react';
import JobCard from './components/JobCard';
import JobForm from './components/JobForm';
import FilterBar from './components/FilterBar';
import Message from './components/Message';
import { fetchJobs, createJob, updateJob, deleteJob } from "./utils/api";

function App() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(undefined);
  const [message, setMessage] = useState(null);
  const [dark, setDark] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    job_type: 'All',
    location: 'All',
    tags: [],
    sort: 'date_desc',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const enableDark = stored ? stored === 'dark' : prefersDark;
    setDark(enableDark);
    document.documentElement.classList.toggle('dark', enableDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const jobsData = await fetchJobs();
      setJobs(jobsData);
    } catch (error) {
      showMessage('error', 'Failed to load jobs. Please try again.');
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAddJob = () => {
    setEditingJob(undefined);
    setShowForm(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDeleteJob = async (id) => {
    try {
      await deleteJob(id);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      showMessage('success', 'Job deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete job. Please try again.');
      console.error('Error deleting job:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingJob) {
        const updatedJob = await updateJob(editingJob.id, formData);
        setJobs(prevJobs => prevJobs.map(job => (job.id === editingJob.id ? updatedJob : job)));
        showMessage('success', 'Job updated successfully');
      } else {
        const newJob = await createJob(formData);
        setJobs(prevJobs => [newJob, ...prevJobs]);
        showMessage('success', 'Job added successfully');
      }

      setShowForm(false);
      setEditingJob(undefined);
    } catch (error) {
      showMessage('error', `Failed to ${editingJob ? 'update' : 'add'} job. Please try again.`);
      throw error;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingJob(undefined);
  };

  const availableLocations = useMemo(() => {
    const locations = new Set(jobs.map(job => job.location));
    return Array.from(locations).sort();
  }, [jobs]);

  const availableTags = useMemo(() => {
    const tags = new Set(jobs.flatMap(job => job.tags));
    return Array.from(tags).sort();
  }, [jobs]);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword)
      );
    }

    if (filters.job_type !== 'All') {
      filtered = filtered.filter(job => job.job_type === filters.job_type);
    }

    if (filters.location !== 'All') {
      filtered = filtered.filter(job => job.location === filters.location);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(job =>
        filters.tags.some(tag => job.tags.includes(tag))
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.posting_date).getTime();
      const dateB = new Date(b.posting_date).getTime();
      return filters.sort === 'date_desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [jobs, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-sm">
                <Briefcase className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Actuarial Jobs</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Find your next actuarial opportunity</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                aria-label="Toggle dark mode"
                title="Toggle theme"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={handleAddJob}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
              >
                <Plus size={20} />
                Add Job
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableLocations={availableLocations}
          availableTags={availableTags}
        />

        {isLoading ? (
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 w-2/3 rounded bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-20 rounded-full bg-gray-200"></div>
                      <div className="h-6 w-16 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredAndSortedJobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No jobs found</h3>
            <p className="text-gray-600 mb-6 dark:text-gray-200">
              {jobs.length === 0
                ? 'Get started by adding your first job listing'
                : 'Try adjusting your filters to see more results'}
            </p>
            {jobs.length === 0 && (
              <button
                onClick={handleAddJob}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
              >
                <Plus size={20} />
                Add Your First Job
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredAndSortedJobs.length} of {jobs.length} jobs
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredAndSortedJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {showForm && (
        <JobForm
          job={editingJob}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
}

export default App;
