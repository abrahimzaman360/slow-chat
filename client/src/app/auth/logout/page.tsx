"use client";

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
import { SERVER_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-provider";

export default function LogoutPage() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const LogoutAction = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        throw new Error("Logout failed");
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
              This action cannot be undone. This will logout you from your
              account! You will need to login again to access your account!
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
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
