"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/Button";
import { buttonClasses } from "@/components/buttonStyles";
import FormField from "@/components/FormField";
import { inputClasses } from "@/components/formStyles";
import { createRequest } from "../requestsService";
import type { Category, Priority } from "../types";
import { validateRequest, type FormErrors, type FormValues } from "../validation";

const emptyForm: FormValues = {
  title: "",
  description: "",
  category: "",
  priority: "MEDIUM",
};

export default function RequestForm() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    setServerError("");

    const foundErrors = validateRequest(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      return; // stop here, show the errors
    }

    setSubmitting(true);
    try {
      await createRequest({
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category as Category,
        priority: values.priority as Priority,
      });
      // Only after the server answered OK
      setValues(emptyForm);
      setSuccess(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      {success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          Request created.{" "}
          <Link href="/requests" className="font-semibold underline">
            View all requests
          </Link>
        </p>
      )}
      {serverError && (
        <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {serverError}
        </p>
      )}

      <FormField label="Title" htmlFor="title" error={errors.title}>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="For example: Wi-Fi not working on the 2nd floor"
          value={values.title}
          onChange={handleChange}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={inputClasses(Boolean(errors.title))}
        />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder="What is the problem? Where and since when?"
          value={values.description}
          onChange={handleChange}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={inputClasses(Boolean(errors.description))}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category" error={errors.category}>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "category-error" : undefined}
            className={inputClasses(Boolean(errors.category))}
          >
            <option value="">Select a category</option>
            <option value="IT">IT</option>
            <option value="Facilities">Facilities</option>
            <option value="Other">Other</option>
          </select>
        </FormField>

        <FormField label="Priority" htmlFor="priority" error={errors.priority}>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className={inputClasses(Boolean(errors.priority))}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </FormField>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={submitting}>
          {submitting ? "Creating..." : "Create request"}
        </Button>
        <Link href="/requests" className={buttonClasses("secondary")}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
