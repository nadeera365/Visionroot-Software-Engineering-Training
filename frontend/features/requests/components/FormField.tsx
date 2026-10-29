interface FormFieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    children: React.ReactNode;
}

export default function FormField({ label, htmlFor, error, children }: FormFieldProps) {
    return (
        <div className="grid gap-1">
            <label htmlFor={htmlFor} className="font-bold">
                {label}
            </label>
            {children}
            {error && (<p id={`${htmlFor}-error`} role="alert" className="text-sm text-red-600">{error}</p>)}
        </div>
    );
}