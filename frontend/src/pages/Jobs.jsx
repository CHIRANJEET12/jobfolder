import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { MapPin, Building2, DollarSign, Calendar, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

function Jobs() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await api.get('/auth/jobs');
      return response.data.jobs;
    }
  });

  const deleteJobMutation = useMutation({
    mutationFn: (jobId) => api.delete(`/auth/delete-job/${jobId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error deleting job');
    }
  });

  const updateJobStatusMutation = useMutation({
    mutationFn: ({ jobId, status }) => api.patch(`/auth/update-job-status/${jobId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error updating job status');
    }
  });

  const applyForJobMutation = useMutation({
    mutationFn: async ({ jobId, formData }) => {
      return api.post(`/apply/${jobId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Application submitted successfully');
      setSelectedFile(null);
      setApplicationMessage('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error submitting application');
    }
  });

  const handleApply = async (jobId) => {
    if (!selectedFile) {
      toast.error('Please select a resume file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('message', applicationMessage);

    applyForJobMutation.mutate({ jobId, formData });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
      <div className="grid gap-6">
        {jobs?.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-5 w-5 mr-2" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Posted on {format(new Date(job.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {user?.role === 'recruiter' && user.id === job.recruiter && (
                  <>
                    <button
                      onClick={() => updateJobStatusMutation.mutate({
                        jobId: job._id,
                        status: job.status === 'ongoing' ? 'ended' : 'ongoing'
                      })}
                      className={`p-2 rounded-full ${
                        job.status === 'ongoing' 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {job.status === 'ongoing' ? <CheckCircle /> : <XCircle />}
                    </button>
                    <button
                      onClick={() => deleteJobMutation.mutate(job._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{job.description}</p>
            </div>

            {user?.role === 'candidate' && job.status === 'ongoing' && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-4">Apply for this position</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Resume (PDF only)
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Message
                    </label>
                    <textarea
                      value={applicationMessage}
                      onChange={(e) => setApplicationMessage(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <button
                    onClick={() => handleApply(job._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;