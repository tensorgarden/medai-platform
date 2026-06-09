import {
  patients,
  appointments,
  clinicalNotes,
  intakeForms,
  prescriptions,
  metrics,
} from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusDot } from "@/components/ui/status-dot";
import { StatCard } from "@/components/ui/stat-card";

export default function HomePage() {
  const activePatients = patients.filter((p) => p.status === "active").length;
  const todayAppointments = appointments.filter(
    (a) => a.date === "2026-06-09"
  );
  const intakePending = intakeForms.filter(
    (f) => f.status === "pending" || f.status === "in-progress"
  ).length;
  const activePrescriptions = prescriptions.filter(
    (r) => r.status === "active"
  ).length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              MedAI Platform
            </h1>
            <p className="mt-1 text-gray-500">
              Patient Intake &amp; Clinical Notes Automation
            </p>
          </div>
          <Badge variant="success">HIPAA Compliant Demo</Badge>
        </div>
      </header>

      {/* Hero Stats */}
      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Active Patients"
          value={activePatients}
          unit="patients"
          change={4.2}
          trend="up"
        />
        <StatCard
          label="Today's Appointments"
          value={todayAppointments.length}
          unit="appointments"
          change={-3.1}
          trend="down"
        />
        <StatCard
          label="AI Notes Generated"
          value={clinicalNotes.length}
          unit="notes"
          change={12.8}
          trend="up"
        />
        <StatCard
          label="Avg Wait Time"
          value={8.4}
          unit="min"
          change={-15.2}
          trend="down"
        />
      </section>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Patients + Appointments */}
        <section className="space-y-6 lg:col-span-2">
          {/* Patient List */}
          <Card>
            <CardHeader>
              <CardTitle>Patients</CardTitle>
              <span className="text-sm text-gray-400">
                {patients.length} total
              </span>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-medium uppercase text-gray-400">
                    <th className="pb-3 pr-4">Patient</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Physician</th>
                    <th className="pb-3 pr-4">Last Visit</th>
                    <th className="pb-3 pr-4">Intake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-4">
                        <span className="font-medium text-ink">
                          {p.firstName} {p.lastName}
                        </span>
                        <div className="text-xs text-gray-400">
                          {p.conditions.slice(0, 2).join(", ")}
                          {p.conditions.length > 2 ? "..." : ""}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusDot status={p.status as Parameters<typeof StatusDot>[0]["status"]} />
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {p.primaryPhysician}
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{p.lastVisit}</td>
                      <td className="py-3 pr-4">
                        {p.intakeCompleted ? (
                          <Badge variant="success">Complete</Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Appointment Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Schedule</CardTitle>
              <span className="text-sm text-gray-400">
                {todayAppointments.length} today
              </span>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-medium uppercase text-gray-400">
                    <th className="pb-3 pr-4">Time</th>
                    <th className="pb-3 pr-4">Patient</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Physician</th>
                    <th className="pb-3 pr-4">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-4">
                        <div className="text-xs text-gray-400">{a.date}</div>
                        <div className="font-medium text-ink">{a.time}</div>
                      </td>
                      <td className="py-3 pr-4 font-medium text-ink">
                        {a.patientName}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant={
                            a.type === "urgent"
                              ? "danger"
                              : a.type === "telehealth"
                                ? "info"
                                : "default"
                          }
                        >
                          {a.type}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusDot status={a.status as Parameters<typeof StatusDot>[0]["status"]} />
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {a.physician}
                      </td>
                      <td className="py-3 pr-4 max-w-[200px] truncate text-gray-500">
                        {a.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Right: Clinical Notes, Prescriptions, Intake, Metrics */}
        <aside className="space-y-6">
          {/* Clinical Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
              <Badge variant="info">{clinicalNotes.length} notes</Badge>
            </CardHeader>
            <ul className="divide-y divide-gray-50">
              {clinicalNotes.slice(0, 5).map((note) => (
                <li key={note.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {note.patientName}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {note.physician} &middot; {note.date}
                      </p>
                    </div>
                    <StatusDot status={note.status as Parameters<typeof StatusDot>[0]["status"]} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {note.aiSummary}
                  </p>
                </li>
              ))}
            </ul>
            {clinicalNotes.length > 5 && (
              <p className="mt-2 text-center text-xs text-gray-400">
                +{clinicalNotes.length - 5} more notes
              </p>
            )}
          </Card>

          {/* Prescription Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription Tracker</CardTitle>
              <Badge variant="neutral">{activePrescriptions} active</Badge>
            </CardHeader>
            <ul className="divide-y divide-gray-50">
              {prescriptions
                .filter((r) => r.status === "active")
                .slice(0, 4)
                .map((rx) => (
                  <li key={rx.id} className="py-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {rx.medication} {rx.dosage}
                        </p>
                        <p className="text-xs text-gray-400">
                          {rx.patientName} &middot; {rx.frequency}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {rx.refillsRemaining} refills
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>

          {/* Intake Form Status */}
          <Card>
            <CardHeader>
              <CardTitle>Intake Forms</CardTitle>
              <Badge
                variant={intakePending > 0 ? "warning" : "success"}
              >
                {intakePending} pending
              </Badge>
            </CardHeader>
            <div className="space-y-3">
              {intakeForms.map((form) => {
                const completedSections = form.sections.filter(
                  (s) => s.completed
                ).length;
                return (
                  <div key={form.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">
                        {form.patientName}
                      </span>
                      <StatusDot status={form.status as Parameters<typeof StatusDot>[0]["status"]} />
                    </div>
                    <ProgressBar
                      value={completedSections}
                      max={form.sections.length}
                      variant={
                        form.status === "completed"
                          ? "success"
                          : form.status === "needs-review"
                            ? "danger"
                            : "warning"
                      }
                    />
                    <p className="text-xs text-gray-400">
                      {completedSections}/{form.sections.length} sections
                      {form.aiFlagged && (
                        <span className="ml-2 text-red-500">
                          AI flagged
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Clinic Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Clinic Metrics</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {metrics.map((m) => {
                const trendColor =
                  m.trend === "up"
                    ? m.change > 0
                      ? "text-emerald-600"
                      : "text-red-600"
                    : m.trend === "down"
                      ? m.change < 0
                        ? "text-emerald-600"
                        : "text-red-600"
                      : "text-gray-500";
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-500">{m.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-ink">
                        {m.value.toLocaleString()} {m.unit}
                      </span>
                      <span className={`ml-2 text-xs font-medium ${trendColor}`}>
                        {m.change > 0 ? "+" : ""}
                        {m.change}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
