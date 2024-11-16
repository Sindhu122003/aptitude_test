import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';

const companies = [
  { id: '1', name: 'Google', logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=200&h=200' },
  { id: '2', name: 'Microsoft', logo: 'https://images.unsplash.com/photo-1642076368834-68c45aa5674f?auto=format&fit=crop&w=200&h=200' },
  { id: '3', name: 'Amazon', logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=200&h=200' },
  { id: '4', name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&h=200' },
  { id: '5', name: 'Meta', logo: 'https://images.unsplash.com/photo-1633675254053-d96c7668c3b8?auto=format&fit=crop&w=200&h=200' },
  { id: '6', name: 'Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=200&h=200' },
];

function Dashboard() {
  const navigate = useNavigate();

  const handleCompanySelect = (companyId: string) => {
    navigate(`/company/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Aptitude Test Practice Platform
          </h1>
          <p className="text-xl text-gray-600">
            Select a company to start your practice test
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleCompanySelect(company.id)}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-6 w-6 text-indigo-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {company.name}
                    </h3>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-gray-600">
                  Practice {company.name}'s aptitude test with real-time monitoring
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;