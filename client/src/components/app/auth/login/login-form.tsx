"use client";

import type React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// Define User type for mutation
type User = {
  identity: string;
  password: string;
  remember: boolean;
};

// User Form Schema - fix the remember field to be required
const LoginFormSchema = z.object({
  identity: z
    .string()
    .min(1, "Username or email is required")
    .min(3, "Must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean(), // Remove .default(false) to make it required
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const hasShownError = useRef(false);

  // Handle error codes with useEffect to prevent showing toasts on every render
  useEffect(() => {
    if (hasShownError.current) return; // Already shown, skip
    const errorCode = searchParams.get("error_code");

    if (errorCode) {
      hasShownError.current = true; // Mark as shown

      switch (errorCode) {
        case "oauth_failed": {
          toast.error("OAuth login failed", {
            richColors: true,
            duration: 4000,
            description: "Authentication Failed!",
          });
          console.log(errorCode);
          break;
        }
        case "oauth_failed_404": {
          toast.error("OAuth login failed", {
            richColors: true,
            duration: 4000,
            description: "Authentication Failed!",
          });
          console.log(errorCode);
          break;
        }
        default: {
          toast.error("Login failed");
          break;
        }
      }
    }

    // Optionally clear the error from the URL
    const url = new URL(window.location.href);
    url.searchParams.delete("error_code");
    window.history.replaceState({}, "", url.toString());
  }, [searchParams]); // Only run when searchParams changes

  // Login Mutation (CORS Fix)
  const mutation = useMutation({
    mutationFn: async (user: User) =>
      await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      }).then((res) => {
        if (!res.ok) {
          console.log(res);
          throw new Error("Login failed");
        }
        return res.json();
      }),
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        description: "Please try again later.",
      });
    },
    onSettled: () => {
      setLoading(false);
    },
    retry: false,
  });

  // Define form with proper typing
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      identity: "",
      password: "",
      remember: false,
    },
  });

  // Form Submit Handler
  const onSubmit = (data: LoginFormValues) => {
    setLoading(true);
    setTimeout(() => {
      mutation.mutate(data);
    }, 2000);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 py-4">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="sr-only">SlowChat Inc.</span>
        </a>
        <h1 className="text-xl font-bold">Welcome to SlowChat Inc.</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="login-form"
          className="flex flex-col gap-6"
        >
          <FormField
            name="identity"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Username or Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn or shadcn@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="remember"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Remember me
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Button variant="outline" className="w-full">
          <a
            href="http://localhost:3000/api/auth/github"
            className="flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with Github
          </a>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <a
            href="http://localhost:3000/api/auth/google"
            className="flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Continue with Google
          </a>
        </Button>
      </div>
      <div className="text-center text-sm py-2">
        Don't have an account?{" "}
        <Link href="/auth/register" className="underline underline-offset-4">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
