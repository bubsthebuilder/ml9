import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ScrimSettings } from '@/types/scrims';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

interface ScrimSettingsProps {
  teamId: string;
  onUpdate?: () => void;
}

export default function ScrimSettings({ teamId, onUpdate }: ScrimSettingsProps) {
  const [settings, setSettings] = useState<ScrimSettings>({
    teamId,
    maxDailyScrims: 3,
    availability: {}
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [teamId]);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'scrimSettings', teamId));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as ScrimSettings);
      }
    } catch (error) {
      console.error('Error fetching scrim settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await setDoc(doc(db, 'scrimSettings', teamId), settings);
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error saving scrim settings:', error);
    }
  };

  const toggleDayAvailability = (dayIndex: number) => {
    const newAvailability = { ...settings.availability };
    if (newAvailability[dayIndex]) {
      delete newAvailability[dayIndex];
    } else {
      newAvailability[dayIndex] = {
        start: '09:00',
        end: '21:00'
      };
    }
    setSettings({ ...settings, availability: newAvailability });
  };

  const updateDayTimes = (dayIndex: number, field: 'start' | 'end', value: string) => {
    const newAvailability = { ...settings.availability };
    if (newAvailability[dayIndex]) {
      newAvailability[dayIndex] = {
        ...newAvailability[dayIndex],
        [field]: value
      };
    }
    setSettings({ ...settings, availability: newAvailability });
  };

  if (!isEditing) {
    return (
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Scrim Settings</h3>
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-secondary"
          >
            Edit Settings
          </button>
        </div>
        
        <div className="mb-4">
          <p className="font-medium">Maximum Daily Scrims: {settings.maxDailyScrims}</p>
        </div>

        <div>
          <p className="font-medium mb-2">Available Days:</p>
          <div className="space-y-2">
            {DAYS_OF_WEEK.map((day, index) => (
              settings.availability[index] && (
                <div key={day} className="flex items-center justify-between">
                  <span>{day}</span>
                  <span className="text-gray-400">
                    {settings.availability[index].start} - {settings.availability[index].end}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Edit Scrim Settings</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm mb-2">Maximum Daily Scrims</label>
          <input
            type="number"
            value={settings.maxDailyScrims}
            onChange={(e) => setSettings({ ...settings, maxDailyScrims: parseInt(e.target.value) })}
            min={1}
            max={10}
            className="w-32 bg-white/5 border border-white/10 rounded px-3 py-2"
          />
        </div>

        <div>
          <p className="text-sm mb-4">Available Days and Times</p>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => (
              <div key={day} className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!settings.availability[index]}
                    onChange={() => toggleDayAvailability(index)}
                    className="rounded border-gray-400"
                  />
                  <span>{day}</span>
                </label>
                
                {settings.availability[index] && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={settings.availability[index].start}
                      onChange={(e) => updateDayTimes(index, 'start', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={settings.availability[index].end}
                      onChange={(e) => updateDayTimes(index, 'end', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => {
              setIsEditing(false);
              fetchSettings();
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={saveSettings}
            className="btn-primary"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}