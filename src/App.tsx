import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import { BsSliders, BsGraphUp, BsQuestionCircle } from 'react-icons/bs';

function InputField({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; step: number }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 transition-all duration-300 ease-in-out"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((value - min) / (max - min)) * 100}%, #9CA3AF ${((value - min) / (max - min)) * 100}%, #9CA3AF 100%)`,
          }}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-32 px-3 py-2 text-right border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        />
      </div>
    </div>
  );
}

function ThemeSwitcher({ theme, setTheme }: { theme: string; setTheme: (theme: string) => void }) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme:</span>
      <div className="flex space-x-2">
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-full ${theme === 'light' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'} transition-colors duration-200`}
          aria-label="Light theme"
        >
          <FaSun className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'} transition-colors duration-200`}
          aria-label="Dark theme"
        >
          <FaMoon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`p-2 rounded-full ${theme === 'system' ? 'bg-green-200 text-green-800' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'} transition-colors duration-200`}
          aria-label="System theme"
        >
          <FaDesktop className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function App() {
  const [totalUsers, setTotalUsers] = useState(1000000);
  const [dailyActiveUsers, setDailyActiveUsers] = useState(30);
  const [sessionsPerDay, setSessionsPerDay] = useState(3);
  const [sessionDuration, setSessionDuration] = useState(15);
  const [peakHours, setPeakHours] = useState(4);
  const [peakUsageFactor, setPeakUsageFactor] = useState(2);

  const [averageSessions, setAverageSessions] = useState(0);
  const [peakSessions, setPeakSessions] = useState(0);

  const [theme, setTheme] = useState('system');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const calculateSessions = useCallback(() => {
    const dailyActiveCount = totalUsers * (dailyActiveUsers / 100);
    const totalDailySessions = dailyActiveCount * sessionsPerDay;
    const totalSessionMinutes = totalDailySessions * sessionDuration;
    
    const avgSimultaneousSessions = Math.round(totalSessionMinutes / (24 * 60));
    const peakSimultaneousSessions = Math.round((totalSessionMinutes * peakUsageFactor) / (peakHours * 60));

    setAverageSessions(avgSimultaneousSessions);
    setPeakSessions(peakSimultaneousSessions);
  }, [totalUsers, dailyActiveUsers, sessionsPerDay, sessionDuration, peakHours, peakUsageFactor]);

  useEffect(() => {
    calculateSessions();
  }, [calculateSessions]);

  useEffect(() => {
    const setThemeClass = () => {
      if (theme === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    setThemeClass();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setThemeClass();
    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12 transition-all duration-300 ease-in-out">
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20 transition-all duration-300 ease-in-out">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Simultaneous Sessions Calculator</h1>
          
          <ThemeSwitcher theme={theme} setTheme={setTheme} />

          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Input Parameters */}
            <div className="mb-8 lg:mb-0 order-1 lg:order-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                <BsSliders className="mr-2" />
                Input Parameters
              </h2>
              <InputField label="Total Users" value={totalUsers} onChange={setTotalUsers} min={100000} max={10000000} step={10000} />
              <InputField label="Daily Active Users (%)" value={dailyActiveUsers} onChange={setDailyActiveUsers} min={1} max={100} step={1} />
              <InputField label="Average Sessions per User per Day" value={sessionsPerDay} onChange={setSessionsPerDay} min={1} max={10} step={1} />
              <InputField label="Average Session Duration (minutes)" value={sessionDuration} onChange={setSessionDuration} min={1} max={60} step={1} />
              <InputField label="Peak Hours" value={peakHours} onChange={setPeakHours} min={1} max={24} step={1} />
              <InputField label="Peak Usage Factor" value={peakUsageFactor} onChange={setPeakUsageFactor} min={1} max={5} step={0.1} />
            </div>

            {/* Results */}
            <div className="mb-8 lg:mb-0 order-2 lg:order-2 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                <BsGraphUp className="mr-2" />
                Results
              </h2>
              <div className="space-y-8">
                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg transition-all duration-300 ease-in-out">
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Average Simultaneous Sessions</h3>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-300">{averageSessions.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg transition-all duration-300 ease-in-out">
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">Peak Simultaneous Sessions</h3>
                  <p className="text-4xl font-bold text-green-600 dark:text-green-300">{peakSessions.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-8 order-3 lg:order-3 lg:col-span-2 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 ease-in-out">
            <button
              onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
              className="w-full text-left text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center justify-between"
            >
              <span className="flex items-center">
                <BsQuestionCircle className="mr-2" />
                How It Works
              </span>
              <svg
                className={`w-6 h-6 transform transition-transform duration-200 ${isHowItWorksOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isHowItWorksOpen && (
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <ol className="list-decimal list-inside">
                  <li>Calculate daily active users: Total Users * (Daily Active %)</li>
                  <li>Calculate total daily sessions: Daily Active Users * Average Sessions per User</li>
                  <li>Calculate total session minutes: Total Daily Sessions * Average Session Duration</li>
                  <li>For Average Simultaneous Sessions:
                    <ul className="list-disc list-inside ml-4 mt-2">
                      <li>Divide total session minutes by minutes in a day (24 * 60)</li>
                    </ul>
                  </li>
                  <li>For Peak Simultaneous Sessions:
                    <ul className="list-disc list-inside ml-4 mt-2">
                      <li>Multiply total session minutes by Peak Usage Factor</li>
                      <li>Divide by (Peak Hours * 60 minutes)</li>
                    </ul>
                  </li>
                </ol>
                <p className="mt-6 text-gray-600 dark:text-gray-400">Note: This calculation assumes an even distribution of sessions throughout the day for the average, and a concentration of sessions during peak hours for the peak calculation. Actual usage patterns may vary.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
