import React from 'react';
import { Shield, Users, Trophy } from 'lucide-react';

export default function Hero() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-10 w-10 text-gray-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                MLBB Nigeria
              </h1>
            </div>
            <p className="text-xl text-gray-400">
              Discover your squad, conquer tournaments, and rise to the top of the Nigerian Mobile Legends community.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-400" />
                <span>Join a vibrant community of passionate players.</span>
              </li>
              <li className="flex items-center space-x-3">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <span>Participate in exclusive tournaments and win prizes.</span>
              </li>
              <li className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-400" />
                <span>Climb the leaderboards and showcase your skills.</span>
              </li>
            </ul>
            <div className="flex space-x-4">
              <button className="btn-primary transform transition-transform hover:scale-105">
                Join Community
              </button>
              <button className="btn-secondary transform transition-transform hover:scale-105">
                View Tournaments
              </button>
            </div>
          </div>

          {/* Visual Content */}
          <div className="md:w-1/2 text-center">
            <div className="p-8 bg-gray-100 rounded-lg shadow-lg transform transition-transform hover:scale-105">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                "Unite, Compete, Dominate!"
              </h2>
              <p className="text-gray-600">
                Build friendships, battle as a team, and achieve greatness together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
