import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Truck, MapPin, MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Secure Agency Collaboration',
      description: 'Connect with other rescue agencies securely with role-based access control.',
      icon: <Shield size={24} className="text-primary-600" />
    },
    {
      title: 'Resource Management',
      description: 'Track, share, and borrow resources between agencies during critical situations.',
      icon: <Truck size={24} className="text-primary-600" />
    },
    {
      title: 'Real-time Communication',
      description: 'Message other agencies directly with context-aware communications.',
      icon: <MessageSquare size={24} className="text-primary-600" />
    },
    {
      title: 'Interactive Mapping',
      description: 'Visualize nearby agencies and available resources on an interactive map.',
      icon: <MapPin size={24} className="text-primary-600" />
    },
    {
      title: 'Emergency Alerts',
      description: 'Send and receive geo-targeted alerts during emergency situations.',
      icon: <AlertTriangle size={24} className="text-primary-600" />
    },
    {
      title: 'Agency Network',
      description: 'Build a network of agencies for better disaster response coordination.',
      icon: <Users size={24} className="text-primary-600" />
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-primary-900 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Coordinate disaster</span>
                  <span className="block text-accent-400">response effectively</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  RescueConnect helps emergency response agencies collaborate, share resources, and coordinate during disasters to save more lives.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                      <Button variant="primary" size="lg" className="w-full group">
                        {isAuthenticated ? "Go to Dashboard" : "Register Your Agency"}
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to={isAuthenticated ? "/map" : "/login"}>
                      <Button variant="outline" size="lg" className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                        {isAuthenticated ? "View Resource Map" : "Sign In"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/36031/firefighter-fire-portrait-training.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Emergency responders in action"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-transparent lg:hidden" />
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Better disaster response coordination
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              RescueConnect provides the tools needed to effectively coordinate resources and response during emergencies.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="flow-root bg-white rounded-xl px-6 pb-8 shadow-sm ring-1 ring-gray-900/5 hover:shadow-lg transition-shadow duration-300">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to improve your emergency response?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join the network of rescue agencies using RescueConnect to save lives and coordinate more effectively.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button
              variant="secondary"
              size="lg"
              className="mt-8 w-full sm:w-auto group"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;