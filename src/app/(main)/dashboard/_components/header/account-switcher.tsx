"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
export function AccountSwitcher({ users }: { users: ReadonlyArray<{ name: string; email: string; role: string }> }) {
  const user = users[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Demo profile">
          <Avatar className="size-7 rounded-lg">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {user.name} · {user.role}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <p className="text-muted-foreground px-2 py-2 text-xs">{user.email}</p>
        <p className="text-muted-foreground px-2 pb-2 text-xs">Fictional demo profile. No sign-in required.</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
