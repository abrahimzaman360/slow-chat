import { RegisterForm } from "@/components/app/auth/register/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-xl  rounded-lg bg-background p-6 shadow-lg">
        <RegisterForm />
      </div>
    </div>
  );
}
