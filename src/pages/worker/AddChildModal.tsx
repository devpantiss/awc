import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Modal } from '../../components/ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { ManagedChild } from '../../data/childMonitoringData';

type ChildFormValues = {
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | '';
  parentName: string;
  phoneNumber: string;
  birthWeight: string;
};

type AddChildModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ManagedChild) => void;
  initialChild?: ManagedChild | null;
};

const emptyForm: ChildFormValues = {
  name: '',
  dob: '',
  gender: '',
  parentName: '',
  phoneNumber: '',
  birthWeight: '',
};

function getAgeLabel(dob: string) {
  if (!dob) return '0y 0m';
  const birthDate = new Date(dob);
  const now = new Date('2026-04-22');
  const months = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
  return `${Math.max(0, Math.floor(months / 12))}y ${Math.max(0, months % 12)}m`;
}

export function AddChildModal({ open, onOpenChange, onSubmit, initialChild }: AddChildModalProps) {
  const [form, setForm] = useState<ChildFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialChild) {
      setForm({
        name: initialChild.name,
        dob: initialChild.dob,
        gender: initialChild.gender,
        parentName: initialChild.parentName,
        phoneNumber: initialChild.phoneNumber,
        birthWeight: String(initialChild.birthWeight),
      });
      setErrors({});
      return;
    }
    setForm(emptyForm);
    setErrors({});
  }, [initialChild, open]);

  const title = useMemo(() => (initialChild ? 'Edit Child' : 'Add Child'), [initialChild]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Child name is required.';
    if (!form.dob) nextErrors.dob = 'Date of birth is required.';
    if (!form.gender) nextErrors.gender = 'Gender is required.';
    if (!form.parentName.trim()) nextErrors.parentName = 'Parent name is required.';
    if (!/^\d{10}$/.test(form.phoneNumber)) nextErrors.phoneNumber = 'Enter a valid 10-digit phone number.';
    const birthWeight = Number(form.birthWeight);
    if (!form.birthWeight || Number.isNaN(birthWeight) || birthWeight <= 0 || birthWeight > 6) {
      nextErrors.birthWeight = 'Birth weight should be between 0.1 and 6 kg.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      id: initialChild?.id ?? `child-${Date.now()}`,
      name: form.name.trim(),
      dob: form.dob,
      ageLabel: getAgeLabel(form.dob),
      gender: form.gender as 'Male' | 'Female',
      parentName: form.parentName.trim(),
      phoneNumber: form.phoneNumber,
      birthWeight: Number(form.birthWeight),
      nutritionStatus: initialChild?.nutritionStatus ?? 'Normal',
    });

    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Maintain child registration details for monitoring, follow-up, and service delivery."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Child Name</label>
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Enter child name"
            />
            {errors.name ? <p className="text-xs text-red-500">{errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date of Birth</label>
            <Input
              type="date"
              value={form.dob}
              onChange={(event) => setForm((current) => ({ ...current, dob: event.target.value }))}
            />
            {errors.dob ? <p className="text-xs text-red-500">{errors.dob}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gender</label>
            <Select
              value={form.gender}
              onValueChange={(value: 'Male' | 'Female') => setForm((current) => ({ ...current, gender: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender ? <p className="text-xs text-red-500">{errors.gender}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Parent Name</label>
            <Input
              value={form.parentName}
              onChange={(event) => setForm((current) => ({ ...current, parentName: event.target.value }))}
              placeholder="Enter parent name"
            />
            {errors.parentName ? <p className="text-xs text-red-500">{errors.parentName}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <Input
              value={form.phoneNumber}
              onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value.replace(/\D/g, '').slice(0, 10) }))}
              placeholder="10-digit mobile number"
            />
            {errors.phoneNumber ? <p className="text-xs text-red-500">{errors.phoneNumber}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Birth Weight</label>
            <Input
              type="number"
              step="0.1"
              value={form.birthWeight}
              onChange={(event) => setForm((current) => ({ ...current, birthWeight: event.target.value }))}
              placeholder="Weight in kg"
            />
            {errors.birthWeight ? <p className="text-xs text-red-500">{errors.birthWeight}</p> : null}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">{initialChild ? 'Save Changes' : 'Add Child'}</Button>
        </div>
      </form>
    </Modal>
  );
}
