import React from 'react';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

const MeetOurTeam = () => {
  const teamMembers = [
    {
      initials: 'SJ',
      name: 'Sarah Johnson',
      role: 'Head Trainer & Founder',
      credentials: 'NASM-CPT, Nutrition Specialist',
      bio: '15+ years experience helping clients transform their lives through fitness.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      initials: 'MC',
      name: 'Mike Chen',
      role: 'Strength & Conditioning Coach',
      credentials: 'CSCS, Sports Performance',
      bio: 'Former college athlete specializing in sports performance and injury prevention.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      initials: 'ER',
      name: 'Emily Rodriguez',
      role: 'Senior Fitness Specialist',
      credentials: 'ACE-CPT, Senior Fitness',
      bio: 'Passionate about helping older adults maintain independence and mobility.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      initials: 'DW',
      name: 'David Williams',
      role: 'Nutrition Coach',
      credentials: 'RD, Sports Nutrition',
      bio: 'Registered Dietitian with expertise in performance nutrition and weight management.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Meet Our Team
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our certified professionals are dedicated to helping you achieve your fitness goals
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Profile Image/Initials */}
              <div className={`h-48 bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                <span className="text-white text-4xl font-bold">{member.initials}</span>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Name & Role */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-orange-600 font-medium">{member.role}</p>
                </div>
                
                {/* Credentials */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">{member.credentials}</p>
                </div>
                
                {/* Bio */}
                <div className="mb-6">
                  <p className="text-gray-600">{member.bio}</p>
                </div>
                
                {/* Social Links */}
                <div className="flex space-x-3">
                  <a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-700 transition-colors">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default MeetOurTeam;