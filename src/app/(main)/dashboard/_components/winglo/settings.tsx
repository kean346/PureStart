"use client";
import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { id, type Settings } from "./model";
import { Choice, Modal, Panel, TextField } from "./shared";
import { useDemo, useDemoData } from "./store";
export function AutomationPreview({
  initial = "Booking reminder",
  customer: selectedCustomer,
  bookingId,
}: {
  initial?: string;
  customer?: string;
  bookingId?: string;
}) {
  const d = useDemoData();
  const [kind, setKind] = useState(initial);
  const [customerId, setCustomer] = useState(selectedCustomer ?? d.customers[0]?.id ?? "");
  const [simulated, setSimulated] = useState(false);
  const customer = d.customers.find((c) => c.id === customerId);
  const booking =
    d.bookings.find((b) => b.id === bookingId) ??
    d.bookings.filter((b) => b.customerId === customerId).sort((a, b) => b.start.localeCompare(a.start))[0];
  const service = d.settings.services.find((s) => s.id === booking?.serviceId);
  const text = (d.settings.templates[kind] ?? "")
    .replaceAll("{name}", customer?.name ?? "Demo customer")
    .replaceAll("{service}", service?.name ?? "cleaning")
    .replaceAll("{date}", booking?.start.replace("T", " at ") ?? "a date to be confirmed");
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">Simulation Only · No WhatsApp, email, or SMS connection.</p>
      {!bookingId && (
        <>
          <Choice
            label="Template"
            value={kind}
            options={Object.keys(d.settings.templates)}
            onChange={(v) => {
              setKind(v);
              setSimulated(false);
            }}
          />
          <Choice
            label="Customer for preview"
            value={customerId}
            options={d.customers}
            onChange={(v) => {
              setCustomer(v);
              setSimulated(false);
            }}
          />
        </>
      )}
      <blockquote className="bg-muted rounded-xl p-5 text-sm leading-relaxed">{text}</blockquote>
      <Button
        onClick={() => {
          setSimulated(true);
          if (kind === "Booking reminder" && booking) useDemo.getState().previewReminder(booking.id);
          toast.success("Preview simulated locally. No message sent.");
        }}
      >
        Simulate message
      </Button>
      {simulated && (
        <p role="status" className="text-sm">
          Simulation complete. This preview was not sent.
        </p>
      )}
    </div>
  );
}
export function SettingsPage() {
  const d = useDemoData();
  const update = useDemo((s) => s.update);
  const reset = useDemo((s) => s.reset);
  const [value, setValue] = useState<Settings>(d.settings);
  const [confirm, setConfirm] = useState(false);
  const [preview, setPreview] = useState(false);
  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update((d) => ({ ...d, settings: value }));
          toast.success("Demo settings saved");
        }}
        className="flex flex-col gap-5"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Business profile" description="Demo profile · Editable in this browser">
            <FieldGroup>
              {(
                [
                  ["business", "Business name"],
                  ["phone", "Contact details"],
                  ["email", "Business email"],
                  ["hours", "Business hours"],
                  ["areas", "Service areas"],
                ] as const
              ).map(([key, label]) => (
                <TextField
                  key={key}
                  label={label}
                  required
                  value={value[key]}
                  onChange={(e) => setValue({ ...value, [key]: e.target.value })}
                />
              ))}
            </FieldGroup>
          </Panel>
          <Panel
            title="Sample pricing rules"
            description="Illustrative estimates only. No actual Winglo prices are represented."
          >
            <FieldGroup>
              {(
                [
                  ["travel", "Default travel charge (R)"],
                  ["sizeRate", "Size adjustment per m² above 80m² (R)"],
                  ["extraPrice", "Selected extras package (R)"],
                  ["vat", "VAT (%) · 0 means VAT is not applied"],
                ] as const
              ).map(([key, label]) => (
                <TextField
                  key={key}
                  label={label}
                  required
                  type="number"
                  min="0"
                  max={key === "vat" ? 100 : undefined}
                  step="0.01"
                  value={value[key]}
                  onChange={(e) => setValue({ ...value, [key]: Number(e.target.value) })}
                />
              ))}
            </FieldGroup>
            <p className="text-muted-foreground mt-4 text-xs">
              Changes apply to new estimates. Saved quotations keep their reviewed prices. VAT defaults to zero; no VAT
              registration is assumed.
            </p>
          </Panel>
        </div>
        <Panel
          title="Cleaning services & base estimates"
          description="The five service types share centralised question sets."
        >
          <FieldGroup>
            {value.services.map((s, i) => (
              <div className="grid gap-3 sm:grid-cols-2" key={s.id}>
                <TextField
                  label="Service name"
                  required
                  value={s.name}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      services: value.services.map((v, n) => (n === i ? { ...v, name: e.target.value } : v)),
                    })
                  }
                />
                <TextField
                  label="Sample base price (R)"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={s.base}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      services: value.services.map((v, n) => (n === i ? { ...v, base: Number(e.target.value) } : v)),
                    })
                  }
                />
              </div>
            ))}
          </FieldGroup>
        </Panel>
        <Panel
          title="Service extras"
          description="Available add-on choices. The selected extras package uses the sample rate above."
        >
          <TextField
            label="Extras (comma separated)"
            defaultValue={value.extraOptions.join(", ")}
            onChange={(e) =>
              setValue({
                ...value,
                extraOptions: e.target.value
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean),
              })
            }
          />
        </Panel>
        <Panel title="Cleaning team" description="Fictional staff · Assign them to jobs from Bookings">
          <FieldGroup>
            {value.staff.map((s, i) => (
              <div className="flex items-end gap-2" key={s.id}>
                <TextField
                  label="Cleaner name"
                  required
                  value={s.name}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      staff: value.staff.map((v, n) => (n === i ? { ...v, name: e.target.value } : v)),
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={d.bookings.some((b) => b.staffId === s.id)}
                  onClick={() => setValue({ ...value, staff: value.staff.filter((v) => v.id !== s.id) })}
                >
                  Remove
                </Button>
              </div>
            ))}
          </FieldGroup>
          <Button
            className="mt-4"
            variant="outline"
            type="button"
            onClick={() => setValue({ ...value, staff: [...value.staff, { id: id("S"), name: "New demo cleaner" }] })}
          >
            Add cleaner
          </Button>
          <p className="text-muted-foreground mt-2 text-xs">Staff linked to existing bookings cannot be removed.</p>
        </Panel>
        <Panel
          title="Demo automation templates"
          description="Use {name}, {service}, and {date} placeholders. Simulation Only."
        >
          <FieldGroup>
            {Object.entries(value.templates).map(([key, text]) => (
              <TextField
                key={key}
                label={key}
                value={text}
                required
                onChange={(e) => setValue({ ...value, templates: { ...value.templates, [key]: e.target.value } })}
              />
            ))}
          </FieldGroup>
        </Panel>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Save settings</Button>
          <Button type="button" variant="outline" onClick={() => setPreview(true)}>
            Preview saved automation
          </Button>
        </div>
      </form>
      <Panel
        title="Demo data"
        description="Stored on this browser only. Other devices and customer browsers do not synchronise."
      >
        <Button variant="destructive" onClick={() => setConfirm(true)}>
          Reset Demo Data
        </Button>
      </Panel>
      {confirm && (
        <Modal
          title="Reset all demo records?"
          onClose={() => setConfirm(false)}
          description="This replaces all local changes with fresh fictional records and default sample pricing."
        >
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                reset();
                const refreshed = useDemo.getState().data;
                if (refreshed) setValue(refreshed.settings);
                setConfirm(false);
                toast.success("Demo data reset");
              }}
            >
              Confirm reset
            </Button>
            <Button variant="outline" onClick={() => setConfirm(false)}>
              Keep my data
            </Button>
          </div>
        </Modal>
      )}
      {preview && (
        <Modal title="Automation preview" onClose={() => setPreview(false)}>
          <AutomationPreview />
        </Modal>
      )}
    </div>
  );
}
