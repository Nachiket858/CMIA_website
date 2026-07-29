"use client";

import { useState } from "react";
import { site } from "@/lib/content";

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

const SUBJECTS = [
  "Membership",
  "Hall booking",
  "Certificate of Origin / GSP",
  "Clusters",
  "Skill Hub / training",
  "Something else",
];

type Fields = { name: string; organisation: string; email: string; phone: string; subject: string; message: string };

const EMPTY: Fields = { name: "", organisation: "", email: "", phone: "", subject: "", message: "" };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.name.trim()) e.name = "Enter your name so the office knows who is writing.";

  if (!f.email.trim() && !f.phone.trim()) {
    e.email = "Give either an email address or a phone number — the office needs one way to reply.";
  } else if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) {
    e.email = "This address is missing something — check for a typo, like a full stop after the @.";
  }

  const digits = f.phone.replace(/\D/g, "");
  if (f.phone.trim() && digits.length < 10) {
    e.phone = `That is ${digits.length} digit${digits.length === 1 ? "" : "s"} — an Indian mobile number has 10.`;
  }

  if (!f.subject) e.subject = "Pick what this is about, so it reaches the right person.";

  if (!f.message.trim()) {
    e.message = "Tell the office what you need.";
  } else if (f.message.trim().length < 10) {
    e.message = "A little more detail will get you a better answer.";
  }

  return e;
}

export function EnquiryForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [attempted, setAttempted] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const set = (k: keyof Fields) => (v: string) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (attempted) setErrors(validate(next));
  };

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setAttempted(true);
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) {
      setShakeKey((k) => k + 1);
      const first = document.querySelector<HTMLElement>("[data-invalid='true']");
      first?.focus();
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    if (!ENDPOINT) {
      setState("failed");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...f, _subject: `CMIA enquiry — ${f.subject}` }),
      });
      setState(res.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <div className="check-pop surface relative overflow-hidden rounded-md border-success/40 p-7">
        <div
          aria-hidden="true"
          className="check-pop grid h-11 w-11 place-items-center rounded-full bg-success/15 text-success"
          style={{ animationDelay: "80ms" }}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path
              d="M5 12.5 10 17 19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-text-hi">Sent.</h2>
        <p className="mt-3 leading-relaxed text-text-mid">
          The office will reply. If it is urgent, call{" "}
          <a href={`tel:${site.contact.phone}`} className="link-underline text-brass-lift">
            {site.contact.phoneDisplay}
          </a>{" "}
          during {site.contact.hours}.
        </p>
      </div>
    );
  }

  const label = "block text-[0.82rem] font-medium tracking-wide text-brass uppercase";
  const err = (k: keyof Fields) => (attempted ? errors[k] : undefined);

  const Err = ({ k }: { k: keyof Fields }) => {
    const e = err(k);
    if (!e) return null;
    return (
      <p className="sheet-in mt-1.5 flex gap-2 text-sm text-error">
        <span aria-hidden="true">↳</span>
        {e}
      </p>
    );
  };

  const attrs = (k: keyof Fields) => ({
    id: k,
    name: k,
    value: f[k],
    "aria-invalid": err(k) ? true : undefined,
    "aria-describedby": err(k) ? `${k}-error` : undefined,
    "data-invalid": err(k) ? "true" : undefined,
    className: "field",
  });

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {attempted && errorCount > 0 && (
        <div
          key={shakeKey}
          role="alert"
          className="shake rounded-md border border-error/50 bg-ink-900 p-4 text-sm"
        >
          <p className="font-semibold text-text-hi">
            {errorCount} {errorCount === 1 ? "field needs" : "fields need"} attention
          </p>
          <ul className="mt-2 space-y-1">
            {Object.entries(errors).map(([k, v]) => (
              <li key={k}>
                <a href={`#${k}`} className="link-underline text-error">
                  {v}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Your name
          </label>
          <input
            type="text"
            autoComplete="name"
            onChange={(e) => set("name")(e.target.value)}
            {...attrs("name")}
            className="field mt-2"
          />
          <Err k="name" />
        </div>
        <div>
          <label htmlFor="organisation" className={label}>
            Organisation <span className="ml-1.5 text-text-lo normal-case">optional</span>
          </label>
          <input
            type="text"
            autoComplete="organization"
            onChange={(e) => set("organisation")(e.target.value)}
            {...attrs("organisation")}
            className="field mt-2"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            onChange={(e) => set("email")(e.target.value)}
            {...attrs("email")}
            className="field mt-2"
          />
          <Err k="email" />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone
          </label>
          <input
            type="tel"
            autoComplete="tel"
            onChange={(e) => set("phone")(e.target.value)}
            {...attrs("phone")}
            className="field mt-2"
          />
          <Err k="phone" />
        </div>
      </div>
      <p className="-mt-2 text-xs text-text-lo">Either one is enough.</p>

      <div>
        <label htmlFor="subject" className={label}>
          What is this about
        </label>
        <select
          onChange={(e) => set("subject")(e.target.value)}
          {...attrs("subject")}
          className="field mt-2"
        >
          <option value="">Choose one</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Err k="subject" />
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Your message
        </label>
        <textarea
          rows={5}
          onChange={(e) => set("message")(e.target.value)}
          {...attrs("message")}
          className="field mt-2 resize-y"
        />
        <Err k="message" />
      </div>

      <div className="border-t border-ink-600 pt-6">
        <button
          type="submit"
          disabled={state === "sending"}
          className="pressable gable-cut inline-flex w-full items-center justify-center gap-2.5 bg-signal px-6 py-4 font-semibold text-ink-900 shadow-[var(--shadow-sm)] transition-[background-color,box-shadow,opacity] duration-200 hover:bg-signal-lift hover:shadow-[var(--glow-signal)] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {state === "sending" && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-900"
            />
          )}
          {state === "sending" ? "Sending…" : "Send message"}
        </button>

        {state === "failed" && (
          <div
            role="alert"
            className="shake mt-5 rounded-md border border-error/50 bg-ink-900 p-4 text-sm"
          >
            <p className="font-semibold text-text-hi">
              {ENDPOINT ? "That did not send." : "Online submission is not connected yet."}
            </p>
            <p className="mt-2 leading-relaxed text-text-mid">
              Please email{" "}
              <a
                href={`mailto:${site.contact.emails[1].address}`}
                className="link-underline text-brass-lift"
              >
                {site.contact.emails[1].address}
              </a>{" "}
              or call{" "}
              <a href={`tel:${site.contact.phone}`} className="link-underline text-brass-lift">
                {site.contact.phoneDisplay}
              </a>{" "}
              during {site.contact.hours}.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
