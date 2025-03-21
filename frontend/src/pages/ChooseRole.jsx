import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Building2 } from 'lucide-react';

function ChooseRole() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/signup', { state: { role: selectedRole } });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Role</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <button
          className={`p-6 border-2 rounded-lg ${
            selectedRole === 'candidate'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-400'
          }`}
          onClick={() => setSelectedRole('candidate')}
        >
          <UserPlus className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Job Seeker</h2>
          <p className="text-gray-600">
            Browse and apply for jobs that match your skills and experience
          </p>
        </button>

        <button
          className={`p-6 border-2 rounded-lg ${
            selectedRole === 'recruiter'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-400'
          }`}
          onClick={() => setSelectedRole('recruiter')}
        >
          <Building2 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Recruiter</h2>
          <p className="text-gray-600">
            Post jobs and find the perfect candidates for your company
          </p>
        </button>
      </div>

      <button
        className={`mt-8 w-full py-3 rounded-lg font-semibold ${
          selectedRole
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
        onClick={handleContinue}
        disabled={!selectedRole}
      >
        Continue as {selectedRole || '...'}
      </button>
    </div>
  );
}

export default ChooseRole;