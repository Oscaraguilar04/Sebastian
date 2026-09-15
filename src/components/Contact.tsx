import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./Contact.css";

export type ContactInquiry = {
  interest: "Buying" | "Selling" | "Exploring" | "Both";
  message?: string;
  key?: number;
};

type FormValues = {
  name: string;
  email: string;
  phone: string;
  interest: ContactInquiry["interest"];
  timing: string;
  area: string;
  message: string;
};

type FormErrors = Partial<Record<"name" | "email" | "phone", string>>;

const emptyForm: FormValues = {
  name: "",
  email: "",
  phone: "",
  interest: "Buying",
  timing: "",
  area: "",
  message: "",
};

const INTENTS: { value: ContactInquiry["interest"]; label: string }[] = [
  { value: "Buying", label: "Buying" },
  { value: "Selling", label: "Selling" },
  { value: "Both", label: "Both" },
  { value: "Exploring", label: "Just exploring" },
];

const INTENT_COPY: Record<
  ContactInquiry["interest"],
  { headline: string; line: string; prompt: string }
> = {
  Buying: {
    headline: "The search starts with what must be true.",
    line: "Tell him what must be true of the next home.",
    prompt: "What matters most in the search?",
  },
  Selling: {
    headline: "The sale starts with the house you have.",
    line: "Tell him what this chapter of the house has been, and what you need next.",
    prompt: "What should a buyer understand about the home?",
  },
  Both: {
    headline: "Both sides of the move can be planned together.",
    line: "The conversation can hold buying and selling at once.",
    prompt: "What needs to happen first—finding, selling, or sequencing both?",
  },
  Exploring: {
    headline: "No decision is required yet.",
    line: "Start with what you are trying to understand. There is no pitch waiting on the other side of this form.",
    prompt: "What are you trying to understand?",
  },
};

const AREAS = [
  "Still deciding",
  "Seven Oaks",
  "Highgate",
  "Riverlakes",
  "Rosedale",
  "Northwest Bakersfield",
] as const;

export function Contact({ inquiry }: { inquiry?: ContactInquiry }) {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const copy = INTENT_COPY[values.interest];

  useEffect(() => {
    if (!inquiry) return;
    setValues((current) => ({
      ...current,
      interest: inquiry.interest,
      message: inquiry.message ?? current.message,
    }));
    setSubmitted(false);
    setErrors({});
  }, [inquiry]);

  useEffect(() => {
    if (submitted) confirmationRef.current?.focus();
  }, [submitted]);

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (field === "name" || field === "email" || field === "phone") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    const emailInput = event.currentTarget.elements.namedItem(
      "email",
    ) as HTMLInputElement;

    if (!values.name.trim()) nextErrors.name = "Please enter your name.";
    if (!values.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (emailInput.validity.typeMismatch) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (values.phone.trim() && values.phone.replace(/\D/g, "").length < 7) {
      nextErrors.phone =
        "Please include a phone number with at least 7 digits, or leave this blank.";
    }

    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      const input = event.currentTarget.elements.namedItem(
        firstError,
      ) as HTMLInputElement;
      requestAnimationFrame(() => input.focus());
      return;
    }
    setSubmitted(true);
  }

  function returnToForm(reset: boolean) {
    if (reset) setValues({ ...emptyForm });
    setErrors({});
    setSubmitted(false);
    requestAnimationFrame(() => nameRef.current?.focus());
  }

  const hasErrors = Object.values(errors).some(Boolean);
  const showTiming = values.interest !== "Exploring";
  const showArea = values.interest !== "Exploring";
  const areaLabel =
    values.interest === "Selling"
      ? "Where is the home"
      : "Area of interest";

  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div className="contact__intro">
        <p className="label">Start a conversation</p>
        <h2 id="contact-heading">
          Your next
          <br />
          move
          <br />
          starts with a
          <br />
          conversation.
        </h2>
        <p className="contact__question">What are you thinking about?</p>
        <div
          className="contact__intents"
          role="radiogroup"
          aria-label="What are you thinking about?"
        >
          {INTENTS.map((item) => (
            <button
              key={item.value}
              className={`contact__intent${values.interest === item.value ? " is-active" : ""}`}
              type="button"
              role="radio"
              aria-checked={values.interest === item.value}
              onClick={() => updateField("interest", item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p>{copy.line}</p>
        <a className="btn btn--ghost" href="#contact-name">
          Schedule a Conversation
        </a>
      </div>

      <div className="contact__form-wrap">
        {submitted ? (
          <div className="contact-confirmation contact__thanks">
            <h3 ref={confirmationRef} tabIndex={-1}>
              Thank you, {values.name.trim().split(/\s+/)[0]}.
            </h3>
            <p>
              This is a portfolio demonstration. Your inquiry has not been sent
              or saved, and no conversation has been scheduled.
            </p>
            <div className="contact__thanks-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => returnToForm(false)}
              >
                Edit inquiry
              </button>
              <button
                type="button"
                className="text-link"
                onClick={() => returnToForm(true)}
              >
                Start a new inquiry
              </button>
            </div>
          </div>
        ) : (
          <form
            className="contact__form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Consultation inquiry"
          >
            <h3 className="contact__form-title">{copy.headline}</h3>
            <p className="contact__note" id="contact-demo-note">
              A portfolio demonstration. Information entered here is not sent or
              saved.
            </p>
            {hasErrors ? (
              <p className="contact__alert" role="alert">
                Please check the highlighted fields below.
              </p>
            ) : null}
            <label htmlFor="contact-name">
              Name
              <input
                ref={nameRef}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
              {errors.name ? (
                <span id="contact-name-error">{errors.name}</span>
              ) : null}
            </label>
            <label htmlFor="contact-email">
              Email
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
              />
              {errors.email ? (
                <span id="contact-email-error">{errors.email}</span>
              ) : null}
            </label>
            <label htmlFor="contact-phone">
              Phone
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={
                  errors.phone ? "contact-phone-error" : undefined
                }
              />
              {errors.phone ? (
                <span id="contact-phone-error">{errors.phone}</span>
              ) : null}
            </label>
            <label className="sr-only" htmlFor="contact-interest">
              Buying / Selling / Exploring
              <select
                id="contact-interest"
                name="interest"
                value={values.interest}
                onChange={(event) =>
                  updateField(
                    "interest",
                    event.target.value as ContactInquiry["interest"],
                  )
                }
              >
                <option>Buying</option>
                <option>Selling</option>
                <option>Both</option>
                <option>Exploring</option>
              </select>
            </label>
            {showTiming ? (
              <label htmlFor="contact-timing">
                Timing
                <select
                  id="contact-timing"
                  name="timing"
                  value={values.timing}
                  onChange={(event) => updateField("timing", event.target.value)}
                >
                  <option value="">Still deciding</option>
                  <option>The next few months</option>
                  <option>This year</option>
                  <option>Just beginning to plan</option>
                </select>
              </label>
            ) : null}
            {showArea ? (
              <label htmlFor="contact-area">
                {areaLabel}
                <select
                  id="contact-area"
                  name="area"
                  value={values.area}
                  onChange={(event) => updateField("area", event.target.value)}
                >
                  {AREAS.map((area) => (
                    <option key={area} value={area === "Still deciding" ? "" : area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="contact__message" htmlFor="contact-message">
              {copy.prompt}
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={values.message}
                onChange={(event) =>
                  updateField("message", event.target.value)
                }
              />
            </label>
            <button
              className="btn btn--ghost"
              type="submit"
              aria-describedby="contact-demo-note"
            >
              Start the Conversation
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
