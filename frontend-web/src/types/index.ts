export interface User {
  id: number;
  phone: string;
  name: string | null;
  role: 'patient' | 'doctor';
  createdAt: string;
}

export interface Profile {
  id: number;
  userId: number;
  user: User;
  fullName: string;
  email: string;
  dateOfBirth: string | null;
  gender: string | null;
  bloodType: string | null;
  address: string | null;
  allergies: string[];
  chronicDiseases: string[];
  emergencyContact: string | null;
  emergencyPhone: string | null;
  medicalHistory: string | null;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string;
  symptoms: string;
  doctorNotes?: string;      // ✅ Ajouté
  prescription?: string;      // ✅ Ajouté
  createdAt: string;
}

export interface Doctor {
  id: number;
  profile: Profile;
}