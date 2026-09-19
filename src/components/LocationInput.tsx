import { useState } from 'react';
import { MapPin, Crosshair } from 'lucide-react';

interface LocationInputProps {
  latitude: string;
  longitude: string;
  locationName: string;
  onChange: (field: 'latitude' | 'longitude' | 'locationName', value: string) => void;
}

export default function LocationInput({
  latitude,
  longitude,
  locationName,
  onChange,
}: LocationInputProps) {
  const [locating, setLocating] = useState(false);

  const useMyLocation = () => {
    setLocating(true);
    setTimeout(() => {
      onChange('latitude', '45.5231');
      onChange('longitude', '-122.6765');
      onChange('locationName', 'Portland, OR');
      setLocating(false);
    }, 800);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Location name
        </label>
        <div className="relative">
          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={locationName}
            onChange={(e) => onChange('locationName', e.target.value)}
            placeholder="e.g. Willow Creek, OR"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Latitude
          </label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => onChange('latitude', e.target.value)}
            placeholder="45.5231"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Longitude
          </label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => onChange('longitude', e.target.value)}
            placeholder="-122.6765"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60"
      >
        <Crosshair size={15} className={locating ? 'animate-spin' : ''} />
        {locating ? 'Locating…' : 'Use my location'}
      </button>
    </div>
  );
}
