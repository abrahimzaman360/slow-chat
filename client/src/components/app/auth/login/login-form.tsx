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
import { Link } from "@tanstack/react-router";

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
    mutation.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="sr-only">SlowChat Inc.</span>
        </a>
        <h1 className="text-xl font-bold">Welcome to SlowChat Inc.</h1>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/auth/register" className="underline underline-offset-4">
            Sign Up
          </Link>
        </div>
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Remember me
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging in..." : "Login"}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mr-2 h-5 w-5"
          >
            <path
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
              fill="currentColor"
            />
          </svg>
          Continue with Apple
        </Button>
        <Button variant="outline" className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mr-2 h-5 w-5"
          >
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Continue with Google
        </Button>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Copyright © 2025 <a href="#">SlowChat</a>. All rights reserved.
      </div>
    </div>
  );
}
