import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, ArrowRight } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { Button, Input, Card } from '../components/UI';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); 

    const { login, register } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Clear previous errors

        try {
            if (isLogin) {
                // Only call the store's login function
                await login(email, password);
            } else {
                // Only call the store's register function
                await register(name, email, password);
            }
            navigate('/');
        } catch (error: unknown) {
            // Display error in UI instead of alert
            if (error instanceof Error) {
                setError(error.message || 'Authentication failed');
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
            <Card className="w-full max-w-md p-8 shadow-xl border-stone-200">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-brand-200">
                        <ChefHat size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-stone-900 mb-2">Welcome to MealMatch</h1>
                    <p className="text-stone-500">
                        {isLogin ? 'Sign in to access your pantry' : 'Create an account to start cooking'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password} // 
                        onChange={(e) => setPassword(e.target.value)} //
                        minLength={6}
                        required
                    />

                    <div className="pt-2">
                        <Button type="submit" className="w-full" isLoading={loading}>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-stone-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(''); // Clear errors when switching
                        }}
                        className="text-brand-600 font-semibold hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-stone-100">
                    <p className="text-xs text-center text-stone-400">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Auth;