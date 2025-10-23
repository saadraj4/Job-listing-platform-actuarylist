import { Calendar, MapPin, Briefcase, Edit2, Trash2 } from 'lucide-react';

export default function JobCard({ job, onEdit, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${job.title}" at ${job.company}?`)) {
      onDelete(job.id);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card hover:shadow-lg hover:bg-gray-200 transition-all duration-200 p-6 border border-gray-400 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 leading-tight tracking-tight">{job.title}</h3>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(job)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            title="Edit job"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            title="Delete job"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-800">
          <Briefcase size={16} className="mr-2 text-gray-400" />
          <span className="font-medium">{job.company}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin size={16} className="mr-2 text-gray-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <span>{formatDate(job.posting_date)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 shadow-sm">
          {job.job_type}
        </span>
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
