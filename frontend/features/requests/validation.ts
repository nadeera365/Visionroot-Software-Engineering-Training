export interface FormValues{
    title: string;
    description: string;
    category: string;
    priority: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export function validateRequest(values: FormValues): FormErrors {
    const errors: FormErrors = {};
    const title = values.title.trim();
    const description = values.description.trim();

    if (title.length < 3 || title.length > 100) {
        errors.title = "Title must be between 3 and 100 characters.";   
    }

    if (description.length < 1 || description.length > 1000) {
        errors.description = "Description must be between 1 and 1000 characters.";   
    }

    if (!["IT", "Facilities", "Other"].includes(values.category)) {
        errors.category = "Please select a valid category.";   
    }

    if (!["LOW", "MEDIUM", "HIGH"].includes(values.priority)) {
        errors.priority = "Please select a valid priority.";   
    }

    return errors;
}