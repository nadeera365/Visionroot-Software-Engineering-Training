"use client";

import { useState } from "react";
import Link from "next/link";
import FormField from "./FormField";
import { createRequest } from "../requestsService";
import type {Category, Priority} from "../types";
import { validateRequest, type FormErrors, type FormValues } from "../validation";

const emptyForm: FormValues = {
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
}

function inputStyle(hasError: boolean) {
    return `w-full rounded-md border p-2 ${hasError ? "border-red-600" : "border-gray-400"}`;

}
export default function RequestForm() {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
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
      className="grid gap-4 rounded-lg border border-gray-300 bg-white p-4"
    >
      {success && (
        <p role="status" className="rounded-md border border-green-700 p-3 text-green-800">
          Request created.{" "}
          <Link href="/requests" className="underline">
            View all requests
          </Link>
        </p>
      )}
      {serverError && (
        <p role="alert" className="rounded-md border border-red-600 p-3 text-red-700">
          {serverError}
        </p>
      )}

      <FormField label="Title" htmlFor="title" error={errors.title}>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={inputStyle(Boolean(errors.title))}
        />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={values.description}
          onChange={handleChange}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={inputStyle(Boolean(errors.description))}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Category" htmlFor="category" error={errors.category}>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "category-error" : undefined}
            className={inputStyle(Boolean(errors.category))}
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
            className={inputStyle(Boolean(errors.priority))}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </FormField>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Create request"}
      </button>
    </form>
  );
}
  



