import React from 'react';
import { Loader2 } from 'lucide-react';

//Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
    const variants = {
        primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-200",
        secondary: "bg-brand-100 text-brand-900 hover:bg-brand-200",
    }
    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-8 text-lg",
    };
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || isLoading} {...props}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
};

//Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>}
            <input className={`w-full h-11 px-4 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all ${className}`} {...props} />
        </div>
    )
};

// Card
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
    return (
        <div className={`bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden ${className}`} {...props}>
            {children}
        </div>
    )
};

//Badge
export const Badge: React.FC<{ children: React.ReactNode, className?: string, variant?: 'success' | 'warning' | 'neutral' }> = ({ children, className = '', variant = "neutral" }) => {
    const styles = {
        success: "bg-green-100 text-green-100",
        warning: "bg-amber-100 text-amber-800",
        neutral: "bg-stone-100 text-stone-600"
    }
    return (
        <span className={`inline-block items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${styles[variant]} ${className}`}>
            {children}
        </span>
    )
};

//Loader
export const RecipeSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 animate-pulse">
        <div className="h-48 bg-stone-200 rounded-xl mb-4"></div>
        <div className="h-6 bg-stone-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-stone-200 rounded w-1/2 mb-4"></div>
        <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-stone-200 rounded-full"></div>
            <div className="h-6 w-16 bg-stone-200 rounded-full"></div>
        </div>
    </div>
);
