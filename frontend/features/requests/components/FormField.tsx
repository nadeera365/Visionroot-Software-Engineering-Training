interface FormFieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    children: React.ReactNode;
}

export default function FormField({ label, htmlFor, error, children }: FormFieldProps) {
    return (
        <div className="grid gap-2">
            <label htmlFor={htmlFor} className="field-label">
                {label}
            </label>
            {children}
            {error && (<p id={`${htmlFor}-error`} role="alert" className="text-sm text-rose-300">{error}</p>)}
        </div>
    );
}