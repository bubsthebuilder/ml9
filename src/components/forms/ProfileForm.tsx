import React from 'react';
import { ProfileFormData } from '@/types/profile';
import { GAME_ROLES, RANKS } from '@/config/constants';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (formData: ProfileFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileForm({ formData, onChange, onSubmit }: ProfileFormProps) {
  const handleHeroChange = (index: number, value: string) => {
    const newHeroes = [...formData.favoriteHeroes];
    newHeroes[index] = value;
    onChange({ ...formData, favoriteHeroes: newHeroes });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormInput
        label="Username"
        value={formData.username}
        onChange={(e) => onChange({ ...formData, username: e.target.value })}
        required
      />

      <FormInput
        label="Game ID"
        value={formData.gameId}
        onChange={(e) => onChange({ ...formData, gameId: e.target.value })}
        required
      />

      <FormSelect
        label="Main Role"
        value={formData.role}
        onChange={(e) => onChange({ ...formData, role: e.target.value })}
        options={GAME_ROLES}
        required
      />

      <FormSelect
        label="Current Rank"
        value={formData.rank}
        onChange={(e) => onChange({ ...formData, rank: e.target.value })}
        options={RANKS}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Top 3 Heroes
        </label>
        <div className="space-y-2">
          {formData.favoriteHeroes.map((hero, index) => (
            <FormInput
              key={index}
              value={hero}
              onChange={(e) => handleHeroChange(index, e.target.value)}
              placeholder={`Hero ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isTeamLeader"
          checked={formData.isTeamLeader}
          onChange={(e) => onChange({ ...formData, isTeamLeader: e.target.checked })}
          className="rounded bg-white/5 border-white/10"
        />
        <label htmlFor="isTeamLeader" className="text-sm font-medium text-gray-300">
          I am a team leader in game
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => onChange({ ...formData, bio: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
          placeholder="Tell us about yourself..."
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Complete Profile
      </button>
    </form>
  );
}