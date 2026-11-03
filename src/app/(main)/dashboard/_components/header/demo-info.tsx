"use client";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export function DemoInfo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="About Winglo demo">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Winglo Cleaning Services · Demo</DialogTitle>
          <DialogDescription>
            Fictional customer records and sample estimates. No real messages are sent. Changes persist only in this
            browser; other devices do not synchronise. No production authentication, payments, or external messaging is
            connected.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
