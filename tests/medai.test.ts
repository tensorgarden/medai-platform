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

  it("draft notes with safety risk should require anchored clinician review", () => {
    const riskReviews = clinicalNotes.flatMap((n: ClinicalNote) =>
      n.aiSafetyReview ? [{ status: n.status, ...n.aiSafetyReview }] : []
    );

    expect(riskReviews.length).toBeGreaterThanOrEqual(2);
    for (const review of riskReviews) {
      expect(review.status).toBe("draft");
      expect(review.clinicianEdited).toBe(false);
      expect(review.errorReportStatus).toBe("queued");
      expect(review.sourceAnchors.length).toBeGreaterThanOrEqual(2);
      expect(review.reviewNote).toMatch(/clinician|sign-off|verification/i);
    }
  });

  it("every draft note should carry an AI safety review before clinician sign-off", () => {
    const draftNotes = clinicalNotes.filter(
      (n: ClinicalNote) => n.status === "draft"
    );
    expect(draftNotes.length).toBeGreaterThanOrEqual(3);
    for (const note of draftNotes) {
      expect(note.aiSafetyReview).toBeDefined();
      expect(note.aiSafetyReview!.riskLevel).toMatch(/low|moderate|high/);
      expect(note.aiSafetyReview!.clinicianEdited).toBe(false);
      expect(note.aiSafetyReview!.sourceAnchors.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("records revocable consent before ambient capture without retaining audio", () => {
    const riskReviews = clinicalNotes.flatMap((n: ClinicalNote) =>
      n.aiSafetyReview ? [n.aiSafetyReview] : []
    );

    for (const review of riskReviews) {
      const consent = review.ambientCaptureConsent;

      expect(consent.status).toBe("obtained");
      expect(consent.capturedAt).toMatch(
        /^2026-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      );
      expect(["pre-visit", "rooming", "point-of-capture"]).toContain(
        consent.consentTouchpoint
      );
      expect(consent.disclosureLanguage.length).toBeGreaterThan(2);
      expect(consent.optOutExplained).toBe(true);
      expect(consent.captureMode).toBe("transcript-only");
      expect(consent.audioRetention).toBe("none");
      expect(consent.revocable).toBe(true);
    }
  });

  it("AI safety anchors should preserve source provenance for audit review", () => {
    const riskReviews = clinicalNotes.flatMap((n: ClinicalNote) =>
      n.aiSafetyReview ? [n.aiSafetyReview] : []
    );

    for (const review of riskReviews) {
      for (const anchor of review.sourceAnchors) {
        expect(["transcript", "lab-result", "vitals"]).toContain(anchor.sourceType);
        expect(anchor.timestamp.length).toBeGreaterThanOrEqual(5);
        expect(anchor.snippet.length).toBeGreaterThan(20);
        if (anchor.sourceType === "transcript") {
          expect(anchor.timestamp).toMatch(/^\d{2}:\d{2}:\d{2}$/);
          expect(anchor.speaker).toMatch(/patient|clinician|caregiver|interpreter/);
          expect(anchor.speakerAttribution).toMatch(
            /high-confidence|review-required/
          );
        } else {
          expect("speaker" in anchor).toBe(false);
          expect("speakerAttribution" in anchor).toBe(false);
        }
      }
    }
  });

  it("keeps uncertain speaker attribution in the pre-signoff review queue", () => {
    const notesWithAttributionFlags = clinicalNotes.filter((note: ClinicalNote) =>
      note.aiSafetyReview?.sourceAnchors.some(
        (anchor) =>
          anchor.sourceType === "transcript" &&
          anchor.speakerAttribution === "review-required"
      )
    );

    expect(notesWithAttributionFlags.length).toBeGreaterThanOrEqual(1);
    for (const note of notesWithAttributionFlags) {
      expect(note.status).toBe("draft");
      expect(
        note.aiSafetyReview!.reviewTasks.some(
          (task) => task.taskType === "verify-source-evidence"
        )
      ).toBe(true);
    }
  });

  it("AI safety reviews should label ambient-scribe note quality concerns", () => {
    const riskReviews = clinicalNotes.flatMap((n: ClinicalNote) =>
      n.aiSafetyReview ? [n.aiSafetyReview] : []
    );
    const concerns = riskReviews.flatMap((review) => review.qualityConcerns);

    expect(concerns).toContain("possible-omission");
    expect(concerns).toContain("note-bloat");
    expect(concerns).toContain("unsupported-recommendation");

    for (const review of riskReviews) {
      expect(review.qualityConcerns.length).toBeGreaterThan(0);
      for (const concern of review.qualityConcerns) {
        expect([
          "possible-omission",
          "note-bloat",
          "unsupported-recommendation",
          "source-conflict",
        ]).toContain(concern);
      }
    }
  });

  it("AI safety reviews should carry pre-signoff review tasks", () => {
    const riskReviews = clinicalNotes.flatMap((n: ClinicalNote) =>
      n.aiSafetyReview ? [n.aiSafetyReview] : []
    );

    for (const review of riskReviews) {
      expect(review.reviewTasks.length).toBeGreaterThanOrEqual(2);
      expect(review.reviewTasks.some((task) => task.owner === "clinician")).toBe(
        true
      );
      for (const task of review.reviewTasks) {
        expect([
          "verify-source-evidence",
          "resolve-omission",
          "confirm-medication-change",
          "patient-safety-escalation",
        ]).toContain(task.taskType);
        expect(["clinician", "scribe-reviewer", "care-team"]).toContain(
          task.owner
        );
        expect(task.dueBeforeSignoff).toBe(true);
        expect(task.note.length).toBeGreaterThan(50);
      }
    }
  });

  it("high-risk safety reviews should surface patient-safety escalation tasks", () => {
    const highRiskNotes = clinicalNotes.filter(
      (n: ClinicalNote) => n.aiSafetyReview?.riskLevel === "high"
    );

    expect(highRiskNotes.length).toBeGreaterThanOrEqual(1);
    for (const note of highRiskNotes) {
      const taskTypes = note.aiSafetyReview!.reviewTasks.map(
        (task) => task.taskType
      );
      expect(taskTypes).toContain("patient-safety-escalation");
      expect(taskTypes).toContain("confirm-medication-change");
    }
  });

  it("routes AI documentation risks to accountable escalation paths", () => {
    const riskReviews = clinicalNotes.flatMap((n: ClinicalNote) =>
      n.aiSafetyReview ? [n.aiSafetyReview] : []
    );

    expect(riskReviews.length).toBeGreaterThanOrEqual(3);
    for (const review of riskReviews) {
      expect(review.escalationPath.reason.length).toBeGreaterThan(70);
      expect(review.escalationPath.escalationDeadline).toMatch(
        /^2026-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      );
      expect([
        "attending-clinician",
        "clinical-safety-lead",
        "care-team",
      ]).toContain(review.escalationPath.accountableRole);

      if (review.riskLevel === "high") {
        expect(review.escalationPath.accountableRole).not.toBe(
          "attending-clinician"
        );
      }
    }
  });

  it("ties AI note reviews to patient-centered outcome monitoring", () => {
    const riskNotes = clinicalNotes.filter(
      (n: ClinicalNote) => n.aiSafetyReview
    );

    expect(riskNotes.length).toBeGreaterThanOrEqual(3);
    for (const note of riskNotes) {
      const monitor = note.aiSafetyReview!.outcomeMonitor;

      expect([
        "symptom-follow-up",
        "care-gap-check",
        "medication-response",
      ]).toContain(monitor.trackingSignal);
      expect(["clinician", "care-team", "quality-review"]).toContain(
        monitor.owner
      );
      expect(monitor.dueDate).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(monitor.expectedEvidence.length).toBeGreaterThanOrEqual(2);
      expect(monitor.reason).toMatch(/patient|outcome|follow-up|symptom/i);

      for (const evidence of monitor.expectedEvidence) {
        expect(evidence.length).toBeGreaterThan(55);
      }

      if (note.aiSafetyReview!.riskLevel === "high") {
        expect(monitor.owner).not.toBe("quality-review");
      }
    }
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
  it("should have exactly 7 healthcare metrics", () => {
    expect(metrics).toHaveLength(7);
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

  it("provider edit rate should be present and show month-over-month trend", () => {
    const editRateMetric = metrics.find(
      (m: HealthcareMetric) => m.label === "Provider Edit Rate"
    );
    expect(editRateMetric).toBeDefined();
    expect(editRateMetric!.value).toBeGreaterThan(0);
    expect(editRateMetric!.value).toBeLessThan(100);
    expect(editRateMetric!.unit).toBe("%");
    expect(editRateMetric!.period).toBe("month");
    expect(editRateMetric!.trend).toMatch(/up|down|stable/);
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
