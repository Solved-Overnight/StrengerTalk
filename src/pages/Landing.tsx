import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Globe, Users, Shield } from 'lucide-react';

const Landing = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Connect Through Voice With People Around The World
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Break language barriers, make new friends, and explore different cultures through voice conversations with strangers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">
              Start Talking Now
            </Link>
            <Link to="/login" className="btn-outline text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-primary-600 dark:text-primary-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your account to join our global community of voice chatters. It only takes a minute.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="text-primary-600 dark:text-primary-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Match With Someone</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Click "Talk to Stranger" and our system will match you with someone who's also looking to chat.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Mic className="text-primary-600 dark:text-primary-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start Talking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect through voice and start your conversation. No video needed - just your voice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Safety Matters</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We prioritize creating a safe environment for all users. Our platform includes features designed to protect your privacy and ensure a positive experience.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Shield className="text-success-500 mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                  <span className="text-gray-600 dark:text-gray-300">Voice-only conversations protect your visual privacy</span>
                </li>
                <li className="flex items-start">
                  <Shield className="text-success-500 mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                  <span className="text-gray-600 dark:text-gray-300">Easy reporting system for inappropriate behavior</span>
                </li>
                <li className="flex items-start">
                  <Shield className="text-success-500 mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                  <span className="text-gray-600 dark:text-gray-300">Block users you don't want to connect with again</span>
                </li>
                <li className="flex items-start">
                  <Shield className="text-success-500 mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                  <span className="text-gray-600 dark:text-gray-300">No personal information is shared without your consent</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
              <div className="aspect-video flex items-center justify-center">
                <div className="voice-wave">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i}
                      className="voice-wave-bar mx-1"
                      style={{
                        height: `${20 + Math.floor(Math.random() * 40)}px`,
                        '--index': i
                      } as React.CSSProperties}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 dark:bg-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Conversations?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users already connecting through voice around the globe.
          </p>
          <Link to="/signup" className="btn bg-white text-primary-700 hover:bg-primary-50 text-lg px-8 py-3">
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;