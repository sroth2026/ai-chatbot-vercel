"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type LoginActionState, login } from "../actions";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: "idle" }
  );
  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "failed") {
      setIsLoading(false);
      toast({ type: "error", description: "Invalid credentials!" });
    } else if (state.status === "invalid_data") {
      setIsLoading(false);
      toast({ type: "error", description: "Failed validating your submission!" });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      setIsLoading(false);
      toast({ type: "success", description: "Welcome back!" });
      setTimeout(() => {
        updateSession();
        router.refresh();
      }, 500);
    }
  }, [state.status, router, updateSession]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    setPassword(formData.get("password") as string);
    setIsLoading(true);
    formAction(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background px-2 md:px-6 relative overflow-hidden">
      {/* Subtle golf-themed background accents */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-5xl bg-white dark:bg-tertiary shadow-2xl rounded-3xl flex flex-col md:flex-row gap-0 border border-secondary/30 dark:border-primary/30 overflow-hidden relative z-10">
        {/* Image Section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 to-secondary/5 dark:from-tertiary dark:to-tertiary w-2/5 p-10 relative">
          {/* Golf ball pattern accent */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-3 h-3 bg-primary rounded-full"></div>
            <div className="absolute top-20 right-20 w-2 h-2 bg-primary rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-3 h-3 bg-secondary rounded-full"></div>
            <div className="absolute bottom-10 right-16 w-2 h-2 bg-primary rounded-full"></div>
          </div>
          <img
            src="/images/lioncaddie.png"
            alt="Lion Caddie Logo"
            width="192"
            height="192"
            className="rounded-2xl shadow-xl mb-6 object-contain relative z-10"
          />
          <h1 className="text-3xl font-extrabold text-primary dark:text-secondary mb-2 tracking-tight relative z-10">Lion Caddie</h1>
          <p className="text-lg text-secondary dark:text-primary text-center font-medium relative z-10 px-4">Your premium golf AI companion</p>
        </div>
        {/* Form Section */}
        <div className="flex flex-col justify-center items-center w-full md:w-3/5 p-8 md:p-20 gap-8 bg-background dark:bg-tertiary">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-2"></div>
            <h3 className="font-bold text-3xl text-primary dark:text-secondary">Welcome Back</h3>
            <p className="text-secondary/80 dark:text-primary/80 text-center max-w-sm">Sign in to access your personalized golf insights and AI caddie</p>
          </div>
          <AuthForm action={handleSubmit} defaultEmail={email} defaultPassword={password}>
            <SubmitButton isSuccessful={isSuccessful} isLoading={isLoading}>Sign in</SubmitButton>
            <p className="mt-6 text-center text-secondary/70 text-sm dark:text-primary/70">
              {"Don't have an account? "}
              <Link
                className="font-semibold text-primary hover:text-secondary transition-colors dark:text-secondary dark:hover:text-primary"
                href="/register"
              >
                Sign up
              </Link>
              {" for free."}
            </p>
          </AuthForm>
          <div className="mt-4 pt-6 border-t border-secondary/20 dark:border-primary/20 w-full text-center">
            <p className="text-xs text-secondary/50 dark:text-primary/50">Trusted by golfers worldwide</p>
          </div>
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white dark:bg-tertiary rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 border border-secondary/30 dark:border-primary/30">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-primary dark:text-secondary font-semibold">Signing you in...</p>
          </div>
        </div>
      )}
    </div>
  );
}