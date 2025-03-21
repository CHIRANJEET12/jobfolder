import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { toast } from 'react-hot-toast';
import { Calendar, FileText, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

function Applications() {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const response = await api.get('/auth/applications');

      return response.data;
    }
  });
  

  const updateApplicationMutation = useMutation({
    mutationFn: ({ appId, status, interviewDate, interviewMessage }) => 
      api.post(`/auth/update-application/${appId}`, { status, interviewDate, interviewMessage }),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast.success('Application status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error updating application');
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Selected':
        return <CheckCircle className="h-5 w-5" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5" />;
      case 'Interview Scheduled':
        return <Calendar className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
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
      <h1 className="text-3xl font-bold mb-8">
        {user?.role === 'candidate' ? 'My Applications' : 'Manage Applications'}
      </h1>

      {user?.role === 'candidate' && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-blue-600">{applications?.totalApplications || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-green-600">{applications?.conversionRatio || 0}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Interviews Scheduled</h3>
            <p className="text-3xl font-bold text-purple-600">
              {applications?.statusData?.['Interview Scheduled'] || 0}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {applications?.applications?.map((application) => (
          <div key={application._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{application.job.title}</h2>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-5 w-5 mr-2" />
                    <span>{application.job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Applied on {format(new Date(application.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FileText className="h-5 w-5 mr-2" />
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusIcon(application.status)}
                <span className={`px-3 py-1 rounded-full ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
            </div>

            {application.interviewDate && (
              <div className="mt-4 p-4 bg-purple-50 rounded-md">
                <h3 className="font-semibold text-purple-800 mb-2">Interview Details</h3>
                <p className="text-purple-700">
                  Scheduled for: {format(new Date(application.interviewDate), 'MMM dd, yyyy HH:mm')}
                </p>
                {application.interviewMessage && (
                  <p className="mt-2 text-purple-700">{application.interviewMessage}</p>
                )}
              </div>
            )}

            {user?.role === 'recruiter' && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-4">Update Application Status</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateApplicationMutation.mutate({
                      appId: application._id,
                      status: 'Selected'
                    })}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                  >
                    Select Candidate
                  </button>
                  <button
                    onClick={() => updateApplicationMutation.mutate({
                      appId: application._id,
                      status: 'Interview Scheduled',
                      interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                      interviewMessage: 'Please prepare for a technical interview.'
                    })}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => updateApplicationMutation.mutate({
                      appId: application._id,
                      status: 'Rejected'
                    })}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                  >
                    Reject
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

export default Applications;