import { describe, it, expect } from "vitest";
import {
  patients,
  appointments,
  clinicalNotes,
  intakeForms,
  prescriptions,
  metrics,
} from "@/lib/demo-data";
import type {
  Patient,
  Appointment,
  ClinicalNote,
  IntakeForm,
  Prescription,
  HealthcareMetric,
} from "@/lib/types";

// 1. Patient count
describe("Patient Data", () => {
  it("should have exactly 12 patients", () => {
    expect(patients).toHaveLength(12);
  });

  it("should have at least 8 active patients", () => {
    const active = patients.filter((p: Patient) => p.status === "active");
    expect(active.length).toBeGreaterThanOrEqual(8);
  });

  it("every patient should have a valid email and phone", () => {
    for (const p of patients) {
      expect(p.email).toMatch(/^[\w.+-]+@[\w-]+\.[\w.]+$/);
      expect(p.phone).toMatch(/^555-/);
    }
  });
});

// 2. Appointment validation
describe("Appointment Data", () => {
  it("should have exactly 15 appointments", () => {
    expect(appointments).toHaveLength(15);
  });

  it("should have at least 6 appointments for 2026-06-09", () => {
    const today = appointments.filter(
      (a: Appointment) => a.date === "2026-06-09"
    );
    expect(today.length).toBeGreaterThanOrEqual(6);
  });

  it("every appointment should reference a valid patient", () => {
    const patientIds = new Set(patients.map((p: Patient) => p.id));
    for (const a of appointments) {
      expect(patientIds.has(a.patientId)).toBe(true);
    }
  });
});

// 3. Clinical notes
describe("Clinical Notes", () => {
  it("should have exactly 10 clinical notes", () => {
    expect(clinicalNotes).toHaveLength(10);
  });

  it("every clinical note should have a non-empty AI summary", () => {
    for (const n of clinicalNotes) {
      expect(n.aiSummary.length).toBeGreaterThan(20);
    }
  });

  it("finalized notes should outnumber draft notes", () => {
    const finalized = clinicalNotes.filter(
      (n: ClinicalNote) => n.status === "finalized"
    ).length;
    const drafts = clinicalNotes.filter(
      (n: ClinicalNote) => n.status === "draft"
    ).length;
    expect(finalized).toBeGreaterThan(drafts);
  });
});

// 4. Prescriptions
describe("Prescriptions", () => {
  it("should have exactly 13 prescriptions", () => {
    expect(prescriptions).toHaveLength(13);
  });

  it("should have at least 10 active prescriptions", () => {
    const active = prescriptions.filter(
      (r: Prescription) => r.status === "active"
    );
    expect(active.length).toBeGreaterThanOrEqual(10);
  });

  it("every active prescription should have refills remaining", () => {
    const active = prescriptions.filter(
      (r: Prescription) => r.status === "active"
    );
    for (const r of active) {
      expect(r.refillsRemaining).toBeGreaterThan(0);
    }
  });
});

// 5. Intake forms
describe("Intake Forms", () => {
  it("should have at least 4 intake forms", () => {
    expect(intakeForms.length).toBeGreaterThanOrEqual(4);
  });

  it("at least one form should need review", () => {
    const needsReview = intakeForms.filter(
      (f: IntakeForm) => f.status === "needs-review"
    );
    expect(needsReview.length).toBeGreaterThanOrEqual(1);
  });
});

// 6. Metrics
describe("Clinic Metrics", () => {
  it("should have exactly 6 healthcare metrics", () => {
    expect(metrics).toHaveLength(6);
  });

  it("active patients metric should be above 2000", () => {
    const activeMetric = metrics.find(
      (m: HealthcareMetric) => m.label === "Active Patients"
    );
    expect(activeMetric).toBeDefined();
    expect(activeMetric!.value).toBeGreaterThan(2000);
  });

  it("average wait time should be under 30 minutes", () => {
    const waitMetric = metrics.find(
      (m: HealthcareMetric) => m.label === "Average Wait Time"
    );
    expect(waitMetric).toBeDefined();
    expect(waitMetric!.value).toBeLessThan(30);
  });
});

// 7. Cross-entity referential integrity
describe("Referential Integrity", () => {
  it("appointment notesGenerated flag should match existence of clinical notes", () => {
    const noteAppointmentIds = new Set(
      clinicalNotes.map((n: ClinicalNote) => n.appointmentId)
    );
    for (const a of appointments) {
      if (a.notesGenerated) {
        expect(noteAppointmentIds.has(a.id)).toBe(true);
      }
    }
  });

  it("patient names in appointments should match patient records", () => {
    const nameMap = new Map(
      patients.map((p: Patient) => [p.id, `${p.firstName} ${p.lastName}`])
    );
    for (const a of appointments) {
      expect(nameMap.get(a.patientId)).toBe(a.patientName);
    }
  });
});
