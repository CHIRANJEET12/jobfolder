import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { BarChart, Users, Briefcase } from 'lucide-react';

function Dashboard() {
  const user = useAuthStore(state => state.user);
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/auth/dashboard');
      return response.data;
    }
  });

  const { data: applicationStats } = useQuery({
    queryKey: ['applicationStats'],
    queryFn: async () => {
      const response = await api.get('/auth/applications');
      return response.data;
    },
    enabled: user?.role === 'candidate'
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {user?.role === 'candidate' && applicationStats && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Applications</h3>
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{applicationStats.totalApplications}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Selected</h3>
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">
                {applicationStats.statusData?.Selected || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Success Rate</h3>
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {applicationStats.conversionRatio}%
              </p>
            </div>
          </>
        )}
      </div>

      {user?.role === 'candidate' && applicationStats?.applications?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {applicationStats.applications.slice(0, 5).map((app) => (
              <div key={app._id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{app.job.title}</h3>
                    <p className="text-gray-600">{app.job.company}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    app.status === 'Selected' ? 'bg-green-100 text-green-800' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;