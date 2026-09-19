import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sprout } from 'lucide-react';
import FormField from '@/components/FormField';
import QualitySelector from '@/components/QualitySelector';
import PhotoUploadArea from '@/components/PhotoUploadArea';
import LocationInput from '@/components/LocationInput';
import { cropOptions, quantityUnits, editListingMock } from '@/data/mockData';
import type { CropType, ListingFormData, QuantityUnit } from '@/types';

const cropTypeOptions: CropType[] = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Leafy Greens',
  'Root Crops',
  'Berries',
  'Dairy',
  'Honey',
];

const emptyForm: ListingFormData = {
  cropName: '',
  cropType: 'Vegetables',
  quantity: 0,
  unit: 'kg',
  pricePerUnit: 0,
  qualityRating: 0,
  description: '',
  location: '',
  latitude: '',
  longitude: '',
  organic: false,
};

export default function CreateEditListingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ListingFormData>(
    isEdit ? editListingMock : emptyForm
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof ListingFormData, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof ListingFormData, string>> = {};
    if (!form.cropName) e.cropName = 'Please select a crop.';
    if (!form.quantity || form.quantity <= 0)
      e.quantity = 'Quantity must be greater than 0.';
    if (!form.pricePerUnit || form.pricePerUnit <= 0)
      e.pricePerUnit = 'Price must be greater than 0.';
    if (form.qualityRating === 0)
      e.qualityRating = 'Please select a quality rating.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.location.trim()) e.location = 'Location name is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-green-700"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
            <Sprout size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Listing' : 'Create New Listing'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEdit
                ? 'Update your crop details and republish'
                : 'List your produce for buyers to discover and bid on'}
            </p>
          </div>
        </div>

        {submitted && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <Check size={20} className="text-green-600" />
            <p className="text-sm font-medium text-green-700">
              {isEdit ? 'Listing updated successfully!' : 'Listing published successfully!'}
              {' '}Redirecting to your dashboard…
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          {/* Crop name + type */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Crop name" required error={errors.cropName}>
              <select
                value={form.cropName}
                onChange={(e) => update('cropName', e.target.value)}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 ${
                  errors.cropName
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                }`}
              >
                <option value="">Select a crop…</option>
                {cropOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Crop type" required>
              <select
                value={form.cropType}
                onChange={(e) => update('cropType', e.target.value as CropType)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                {cropTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Quantity + unit + price */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FormField label="Quantity" required error={errors.quantity}>
              <input
                type="number"
                min={0}
                value={form.quantity || ''}
                onChange={(e) => update('quantity', Number(e.target.value))}
                placeholder="0"
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.quantity
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                }`}
              />
            </FormField>

            <FormField label="Unit" required>
              <select
                value={form.unit}
                onChange={(e) => update('unit', e.target.value as QuantityUnit)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                {quantityUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Price per unit (₹)"
              required
              error={errors.pricePerUnit}
            >
              <input
                type="number"
                step="0.01"
                min={0}
                value={form.pricePerUnit || ''}
                onChange={(e) => update('pricePerUnit', Number(e.target.value))}
                placeholder="0.00"
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.pricePerUnit
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                }`}
              />
            </FormField>
          </div>

          {/* Quality rating */}
          <FormField
            label="Quality rating"
            required
            error={errors.qualityRating}
            hint="Rate the quality of your harvest from 1 to 5 stars"
          >
            <QualitySelector
              value={form.qualityRating}
              onChange={(v) => update('qualityRating', v)}
            />
          </FormField>

          {/* Photo upload */}
          <FormField
            label="Crop photo"
            hint="A clear photo helps buyers evaluate your produce"
          >
            <PhotoUploadArea
              previewImage={
                isEdit
                  ? 'https://images.pexels.com/photos/18759607/pexels-photo-18759607.jpeg?auto=compress&cs=tinysrgb&h=400'
                  : undefined
              }
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            required
            error={errors.description}
            hint="Describe growing conditions, taste, and any special handling"
          >
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Tell buyers about your produce…"
              className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
              }`}
            />
          </FormField>

          {/* Location */}
          <FormField
            label="Farm location"
            required
            error={errors.location}
            hint="Enter your farm address or coordinates"
          >
            <LocationInput
              latitude={form.latitude}
              longitude={form.longitude}
              locationName={form.location}
              onChange={(field, value) => update(field === 'locationName' ? 'location' : field, value)}
            />
          </FormField>

          {/* Organic toggle */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.organic}
              onChange={(e) => update('organic', e.target.checked)}
              className="h-5 w-5 rounded accent-green-600"
            />
            <span className="text-sm font-medium text-gray-700">
              Certified organic produce
            </span>
          </label>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-50 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitted}
              className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md disabled:opacity-70"
            >
              {isEdit ? 'Update Listing' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
