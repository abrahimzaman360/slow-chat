import { createFileRoute } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/auth/logout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const LogoutAction = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Dialog defaultOpen open={open} onOpenChange={setOpen}>
        <DialogTrigger className="" asChild>
          <Button variant="outline">Logout</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure to logout?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will logout you from your account!
              You will need to login again to access your account!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={LogoutAction}
              disabled={loading}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
