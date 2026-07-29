"use client";

import { useState } from "react";
import { membership, site, rupees, tenureCost } from "@/lib/content";

/**
 * Membership application.
 *
 * There is no backend — this is a static site — so the form posts to whatever
 * endpoint NEXT_PUBLIC_FORM_ENDPOINT names (any Formspree-compatible service
 * works). When that is unset it says so plainly and offers the PDF and the
 * office's phone number, rather than swallowing a submission into nothing.
 *
 * Validation runs on submit and on blur-after-touch, and every message says
 * what to do rather than that something is wrong.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

type Fields = {
  organisation: string;
  representative: string;
  designation: string;
  email: string;
  phone: string;
  address: string;
  industrySize: string;
  industryType: string;
  products: string;
  exports: string;
  gst: string;
  message: string;
};

const EMPTY: Fields = {
  organisation: "",
  representative: "",
  designation: "",
  email: "",
  phone: "",
  address: "",
  industrySize: "",
  industryType: "",
  products: "",
  exports: "no",
  gst: "",
  message: "",
};

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};

  if (!f.organisation.trim())
    e.organisation = "Enter the registered name of your organisation.";

  if (!f.representative.trim())
    e.representative = "Enter the name of the owner or official representative.";

  if (!f.email.trim()) {
    e.email = "Enter an email address so the office can reply.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) {
    e.email = "This address is missing something — check for a typo, like a full stop after the @.";
  }

  const digits = f.phone.replace(/\D/g, "");
  if (!digits) {
    e.phone = "Enter a phone number the office can reach you on.";
  } else if (digits.length < 10) {
    e.phone = `That is ${digits.length} digit${digits.length === 1 ? "" : "s"} — an Indian mobile number has 10.`;
  }

  if (!f.industrySize)
    e.industrySize = "Choose the class that matches your UDYAM Aadhaar.";

  if (!f.industryType) e.industryType = "Choose manufacturing, services or association.";

  if (f.gst.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{3}$/i.test(f.gst.trim())) {
    e.gst =
      "A GST number is 15 characters, like 27AAAAM0963H1ZO. Leave it blank if you do not have one yet.";
  }

  return e;
}

export function ApplyForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [attempted, setAttempted] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const set = (k: keyof Fields) => (v: string) => {
    setF((prev) => ({ ...prev, [k]: v }));
    if (touched[k] || attempted) {
      setErrors(validate({ ...f, [k]: v }));
    }
  };

  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(f));
  };

  const chosenClass = membership.classes.find((c) => c.name === f.industrySize);
  const firstYear = chosenClass
    ? tenureCost(chosenClass, membership.tenures[0])
    : null;

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setAttempted(true);
    const e = validate(f);
    setErrors(e);

    if (Object.keys(e).length > 0) {
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
        body: JSON.stringify({ ...f, _subject: `Membership enquiry — ${f.organisation}` }),
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
        <h2 className="mt-4 font-display text-xl font-semibold text-text-hi">
          Your enquiry has been sent.
        </h2>
        <p className="mt-3 leading-relaxed text-text-mid">
          The office will be in touch. Applications are considered at the next Executive
          Committee meeting, and need a proposer and a seconder from existing members.
        </p>
        <p className="mt-4 text-sm text-text-lo">
          If you would rather move faster, call{" "}
          <a href={`tel:${site.contact.phone}`} className="link-underline text-agri-lift">
            {site.contact.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  const label = "block text-[0.82rem] font-medium tracking-wide text-agri uppercase";

  const err = (k: keyof Fields) => (attempted || touched[k] ? errors[k] : undefined);

  const Field = ({
    k,
    labelText,
    type = "text",
    hint,
    autoComplete,
    required = true,
  }: {
    k: keyof Fields;
    labelText: string;
    type?: string;
    hint?: string;
    autoComplete?: string;
    required?: boolean;
  }) => {
    const e = err(k);
    return (
      <div>
        <label htmlFor={k} className={label}>
          {labelText}
          {!required && <span className="ml-1.5 text-text-lo normal-case">optional</span>}
        </label>
        {hint && <p className="mt-1 text-xs text-text-lo">{hint}</p>}
        <input
          id={k}
          name={k}
          type={type}
          value={f[k]}
          onChange={(ev) => set(k)(ev.target.value)}
          onBlur={blur(k)}
          autoComplete={autoComplete}
          aria-invalid={e ? true : undefined}
          aria-describedby={e ? `${k}-error` : undefined}
          data-invalid={e ? "true" : undefined}
          className="field mt-2"
        />
        <FieldError message={e} />
      </div>
    );
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      {attempted && errorCount > 0 && (
        <div
          key={shakeKey}
          role="alert"
          className={`shake rounded-md border border-error/50 bg-ink-900 p-4 text-sm leading-relaxed text-text-mid`}
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

      <fieldset className="space-y-5">
        <legend className="font-display text-[0.72rem] font-semibold tracking-[0.14em] text-text-lo uppercase">
          Your organisation
        </legend>
        <Field k="organisation" labelText="Name of the organisation" autoComplete="organization" />
        <div>
          <label htmlFor="address" className={label}>
            Postal address <span className="ml-1.5 text-text-lo normal-case">optional</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            value={f.address}
            onChange={(ev) => set("address")(ev.target.value)}
            className="field mt-2 resize-y"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-[0.72rem] font-semibold tracking-[0.14em] text-text-lo uppercase">
          Who to contact
        </legend>
        <Field
          k="representative"
          labelText="Official representative (owner)"
          autoComplete="name"
        />
        <Field k="designation" labelText="Designation" required={false} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field k="email" labelText="Email" type="email" autoComplete="email" />
          <Field
            k="phone"
            labelText="Phone or WhatsApp"
            type="tel"
            autoComplete="tel"
            hint="10 digits"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-[0.72rem] font-semibold tracking-[0.14em] text-text-lo uppercase">
          Your unit
        </legend>

        <div>
          <label htmlFor="industrySize" className={label}>
            Class of membership
          </label>
          <p className="mt-1 text-xs text-text-lo">{membership.formFields.industrySizeBasis}</p>
          <select
            id="industrySize"
            name="industrySize"
            value={f.industrySize}
            onChange={(ev) => set("industrySize")(ev.target.value)}
            onBlur={blur("industrySize")}
            aria-invalid={err("industrySize") ? true : undefined}
            aria-describedby={err("industrySize") ? "industrySize-error" : undefined}
            data-invalid={err("industrySize") ? "true" : undefined}
            className="field mt-2"
          >
            <option value="">Choose a class</option>
            {membership.classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} — {rupees(c.annual)}/year + {rupees(c.admission)} once
              </option>
            ))}
          </select>
          <FieldError message={err("industrySize")} id="industrySize-error" />
          {firstYear && (
            <p
              key={chosenClass?.id}
              className="tnum sheet-in mt-2.5 border-l-2 border-agri/40 pl-3 text-sm text-text-mid"
            >
              First year: {rupees(firstYear.base)} + {rupees(firstYear.gst)} GST ={" "}
              <span className="font-semibold text-text-hi">{rupees(firstYear.total)}</span>
            </p>
          )}
        </div>

        <div>
          <span className={label}>Type of unit</span>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {membership.formFields.industryType.map((t) => (
              <label key={t} className="choice-pill px-3.5 py-2.5 text-sm">
                <input
                  type="radio"
                  name="industryType"
                  value={t}
                  checked={f.industryType === t}
                  onChange={() => set("industryType")(t)}
                  className="sr-only"
                />
                {t}
              </label>
            ))}
          </div>
          <FieldError message={err("industryType")} />
        </div>

        <Field
          k="products"
          labelText="Products or services"
          required={false}
          hint="What your unit makes or does"
        />

        <div>
          <span className={label}>Do you export?</span>
          <div className="mt-2.5 flex gap-2">
            {["no", "yes"].map((v) => (
              <label key={v} className="choice-pill px-5 py-2.5 text-sm capitalize">
                <input
                  type="radio"
                  name="exports"
                  value={v}
                  checked={f.exports === v}
                  onChange={() => set("exports")(v)}
                  className="sr-only"
                />
                {v}
              </label>
            ))}
          </div>
          {f.exports === "yes" && (
            <p className="sheet-in mt-2.5 text-sm text-text-lo">
              The chamber issues Certificates of Origin and hosts fortnightly GSP issuance —
              mention your export markets in the message below.
            </p>
          )}
        </div>

        <Field
          k="gst"
          labelText="GST number"
          required={false}
          hint="15 characters, if you have one"
        />
      </fieldset>

      <div>
        <label htmlFor="message" className={label}>
          Anything else <span className="ml-1.5 text-text-lo normal-case">optional</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={f.message}
          onChange={(ev) => set("message")(ev.target.value)}
          className="field mt-2 resize-y"
        />
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
          {state === "sending" ? "Sending…" : "Send enquiry"}
        </button>

        <p className="mt-3.5 text-sm leading-relaxed text-text-lo">
          This sends an enquiry to the office. The formal application also needs the four
          documents and a proposer and seconder from existing members.
        </p>

        {state === "failed" && (
          <div
            role="alert"
            className="shake mt-5 rounded-md border border-error/50 bg-ink-900 p-4 text-sm leading-relaxed"
          >
            <p className="font-semibold text-text-hi">
              {ENDPOINT
                ? "That did not send."
                : "Online submission is not connected yet."}
            </p>
            <p className="mt-2 text-text-mid">
              {ENDPOINT
                ? "Something went wrong on the way. Please try again, or use one of these instead:"
                : "The form endpoint has not been configured for this site. Please use one of these instead:"}
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>
                Email{" "}
                <a
                  href={`mailto:${site.contact.emails[1].address}?subject=Membership enquiry`}
                  className="link-underline text-agri-lift"
                >
                  {site.contact.emails[1].address}
                </a>
              </li>
              <li>
                Call{" "}
                <a href={`tel:${site.contact.phone}`} className="link-underline text-agri-lift">
                  {site.contact.phoneDisplay}
                </a>{" "}
                <span className="text-text-lo">({site.contact.hours})</span>
              </li>
              <li>
                <a
                  href={membership.formPdfSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-agri-lift"
                >
                  Download the application form
                </a>{" "}
                and take it to the office
              </li>
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}

function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="sheet-in mt-1.5 flex gap-2 text-sm text-error">
      <span aria-hidden="true">↳</span>
      {message}
    </p>
  );
}
