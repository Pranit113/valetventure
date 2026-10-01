import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/layout/TopBar';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useApi } from '../../hooks/useApi';
import { tripService } from '../../services/tripService';
import { TripType, TravelMode } from '../../types/api';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Car, Train, Bus, Map, MapPin } from 'lucide-react';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    type: TripType.SOLO,
    travelMode: TravelMode.FLIGHT,
    name: '',
    currency: 'USD',
  });

  const { execute: createTrip, isLoading } = useApi(tripService.create, {
    onSuccess: (data) => {
      navigate(`/trips/${data.id}`);
    }
  });

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleCreate();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const handleCreate = () => {
    createTrip(formData);
  };

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="font-display text-2xl font-semibold">Where are you going?</h2>
            <Input
              autoFocus
              placeholder="e.g. Kyoto, Japan"
              value={formData.destination}
              onChange={(e) => updateForm('destination', e.target.value)}
              leftIcon={<MapPin className="w-5 h-5" />}
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="font-display text-2xl font-semibold">When is the trip?</h2>
            <div className="space-y-4">
              <Input
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => updateForm('startDate', e.target.value)}
              />
              <Input
                type="date"
                label="End Date"
                value={formData.endDate}
                onChange={(e) => updateForm('endDate', e.target.value)}
                min={formData.startDate}
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="font-display text-2xl font-semibold">Who's traveling?</h2>
            <Input
              type="number"
              label="Number of travelers"
              min="1"
              value={formData.travelers}
              onChange={(e) => updateForm('travelers', parseInt(e.target.value))}
            />
            
            <div className="pt-4">
              <label className="block text-sm font-medium mb-3">Trip Type</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(TripType).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateForm('type', type)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                      formData.type === type 
                        ? "bg-primary text-white border-primary" 
                        : "bg-surface dark:bg-surface-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:border-primary/50"
                    )}
                  >
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="font-display text-2xl font-semibold">How are you getting there?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { mode: TravelMode.FLIGHT, icon: Plane, label: 'Flight' },
                { mode: TravelMode.CAR, icon: Car, label: 'Car' },
                { mode: TravelMode.TRAIN, icon: Train, label: 'Train' },
                { mode: TravelMode.BUS, icon: Bus, label: 'Bus' },
                { mode: TravelMode.MIXED, icon: Map, label: 'Mixed' },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => updateForm('travelMode', mode)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors h-24",
                    formData.travelMode === mode 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:border-primary/30"
                  )}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="font-display text-2xl font-semibold">Give it a name</h2>
            <Input
              label="Trip Name"
              placeholder={`My trip to ${formData.destination || 'somewhere'}`}
              value={formData.name}
              onChange={(e) => updateForm('name', e.target.value)}
            />
            <div className="pt-2">
              <label className="block text-sm font-medium mb-1.5 text-text dark:text-text-dark">
                Currency
              </label>
              <select 
                className="w-full rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-3 text-sm focus:border-primary focus:outline-none"
                value={formData.currency}
                onChange={(e) => updateForm('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </motion.div>
        );
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.destination.length > 0;
      case 2: return formData.startDate && formData.endDate && formData.startDate <= formData.endDate;
      case 3: return formData.travelers > 0;
      case 4: return true;
      case 5: return formData.name.length > 0;
      default: return false;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg dark:bg-bg-dark">
      <TopBar 
        showBack={false}
        title={`Step ${step} of ${totalSteps}`} 
        rightElement={
          <button onClick={() => navigate('/trips')} className="text-sm font-medium text-text-muted">Cancel</button>
        }
      />
      
      {/* Progress Bar */}
      <div className="h-1 w-full bg-border dark:bg-border-dark">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
        
        <div className="mt-auto pt-8 flex gap-3 pb-8">
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack} className="w-1/3">
              Back
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            disabled={!isStepValid()} 
            isLoading={isLoading && step === totalSteps}
            className={step > 1 ? "w-2/3" : "w-full"}
          >
            {step === totalSteps ? 'Create Trip' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
