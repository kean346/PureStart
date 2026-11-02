"use client";

import { useState } from "react";

import { Bell, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function DemoInfo() {
  const [read, setRead] = useState(false);
  return (
    <>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) setRead(true);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={read ? "Notifications, all read" : "Notifications, 2 unread"}
            className="relative"
          >
            <Bell />
            {!read && <span className="bg-primary absolute top-1 right-1 size-1.5 rounded-full" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Workspace notifications <Badge variant="secondary">Demo</Badge>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <div className="flex flex-col gap-3 p-2 text-sm">
            <div>
              <p className="font-medium">Your October report is ready</p>
              <p className="text-muted-foreground text-xs">Ellis Marlow · Nov 1, 09:00 UTC</p>
            </div>
            <div>
              <p className="font-medium">Insights launch campaign reviewed</p>
              <p className="text-muted-foreground text-xs">Avery Sloan · Nov 1, 08:30 UTC</p>
            </div>
            <p className="text-muted-foreground text-xs">Illustrative notifications. Nothing is sent.</p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="About NOREVA">
            <Info />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>NOREVA Insights</DialogTitle>
            <DialogDescription>Analytics & Intelligence · A fictional concept by paceIT</DialogDescription>
          </DialogHeader>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A premium B2B SaaS analytics showcase. All customers, employees, campaigns, events, and results are
            fictional. This demo uses a fixed dataset ending November 1, 2026 and requires no account or backend.
          </p>
          <p className="text-muted-foreground text-sm">
            Built on the open-source Studio Admin foundation by Mohammed Arham Khan. Original MIT copyright and license
            notices are retained.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
