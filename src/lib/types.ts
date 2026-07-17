// ── MedAI Platform: Core Types ──

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // ISO date
  email: string;
  phone: string;
  status: "active" | "inactive" | "on-hold" | "discharged";
  primaryPhysician: string;
  lastVisit: string; // ISO date
  conditions: string[];
  insuranceProvider: string;
  insuranceId: string;
  intakeCompleted: boolean;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  type: "checkup" | "follow-up" | "specialist" | "urgent" | "telehealth";
  status: "scheduled" | "checked-in" | "in-progress" | "completed" | "cancelled" | "no-show";
  date: string; // ISO date
  time: string; // HH:MM
  duration: number; // minutes
  physician: string;
  reason: string;
  notesGenerated: boolean;
  createdAt: string;
}

export interface ClinicalNote {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  date: string;
  physician: string;
  transcriptPreview: string;
  aiSummary: string;
  diagnosis: string[];
  prescriptions: string[]; // Prescription IDs
  followUpNeeded: boolean;
  followUpDate: string | null;
  status: "draft" | "reviewed" | "finalized";
  aiSafetyReview?: AiClinicalSafetyReview;
  createdAt: string;
}

export type ClinicalNoteQualityConcern =
  | "possible-omission"
  | "note-bloat"
  | "unsupported-recommendation"
  | "source-conflict";

export type ClinicalSafetyReviewTaskType =
  | "verify-source-evidence"
  | "resolve-omission"
  | "confirm-medication-change"
  | "patient-safety-escalation";

export interface ClinicalSafetyReviewTask {
  taskType: ClinicalSafetyReviewTaskType;
  owner: "clinician" | "scribe-reviewer" | "care-team";
  dueBeforeSignoff: boolean;
  note: string;
}

export type ClinicalSafetyEscalationRole =
  | "attending-clinician"
  | "clinical-safety-lead"
  | "care-team";

export interface ClinicalSafetyEscalationPath {
  accountableRole: ClinicalSafetyEscalationRole;
  escalationDeadline: string;
  reason: string;
}

export type ClinicalSafetyOutcomeSignal =
  | "symptom-follow-up"
  | "care-gap-check"
  | "medication-response";

export interface ClinicalSafetyOutcomeMonitor {
  trackingSignal: ClinicalSafetyOutcomeSignal;
  owner: "clinician" | "care-team" | "quality-review";
  dueDate: string;
  expectedEvidence: string[];
  reason: string;
}

export interface AmbientCaptureConsent {
  status: "obtained" | "declined" | "withdrawn";
  capturedAt: string | null;
  consentTouchpoint: "pre-visit" | "rooming" | "point-of-capture";
  disclosureLanguage: string;
  optOutExplained: boolean;
  captureMode: "transcript-only" | "audio-retained";
  audioRetention: "none" | "encounter-only";
  revocable: boolean;
}

export interface AiClinicalSafetyReview {
  riskLevel: "low" | "moderate" | "high";
  clinicianEdited: boolean;
  errorReportStatus: "not-needed" | "queued" | "reported";
  ambientCaptureConsent: AmbientCaptureConsent;
  qualityConcerns: ClinicalNoteQualityConcern[];
  sourceAnchors: ClinicalSourceAnchor[];
  escalationPath: ClinicalSafetyEscalationPath;
  outcomeMonitor: ClinicalSafetyOutcomeMonitor;
  reviewTasks: ClinicalSafetyReviewTask[];
  reviewNote: string;
}

export type ClinicalSourceAnchor =
  | ClinicalTranscriptSourceAnchor
  | ClinicalStructuredSourceAnchor;

export interface ClinicalTranscriptSourceAnchor {
  sourceType: "transcript";
  speaker: "patient" | "clinician" | "caregiver" | "interpreter";
  speakerAttribution: "high-confidence" | "review-required";
  timestamp: string;
  snippet: string;
}

export interface ClinicalStructuredSourceAnchor {
  sourceType: "lab-result" | "vitals";
  timestamp: string;
  snippet: string;
}

export interface IntakeForm {
  id: string;
  patientId: string;
  patientName: string;
  status: "pending" | "in-progress" | "completed" | "needs-review";
  submittedDate: string | null;
  sections: IntakeSection[];
  aiFlagged: boolean;
  flaggedItems: string[];
  createdAt: string;
}

export interface IntakeSection {
  name: string;
  label: string;
  completed: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedDate: string;
  status: "active" | "completed" | "discontinued";
  refillsRemaining: number;
  pharmacy: string;
  notes: string;
  createdAt: string;
}

export interface HealthcareMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number; // percentage change
  period: "today" | "week" | "month" | "year";
  trend: "up" | "down" | "stable";
  updatedAt: string;
}
