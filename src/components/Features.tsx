import React from 'react';
import { Trophy, Users, Calendar, Star } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: <Trophy className="h-8 w-8 text-gray-400" />,
    title: 'Tournaments',
    description: 'Participate in regular tournaments with exciting prize pools and earn recognition in the community.'
  },
  {
    icon: <Users className="h-8 w-8 text-gray-400" />,
    title: 'Team Formation',
    description: 'Find teammates, create your squad, and build lasting connections with fellow players.'
  },
  {
    icon: <Calendar className="h-8 w-8 text-gray-400" />,
    title: 'Scrim Scheduling',
    description: 'Easily schedule practice matches with other teams to improve your gameplay and strategies.'
  },
  {
    icon: <Star className="h-8 w-8 text-gray-400" />,
    title: 'Leaderboards',
    description: 'Track your progress and compete with other players in our community-specific ranking system.'
  }
];

export default function Features() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
            Community Features
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Everything you need to enhance your MLBB experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}