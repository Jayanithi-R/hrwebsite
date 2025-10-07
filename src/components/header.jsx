import React from "react";
import { Button } from "./ui/button"; // Adjust the path as per your project
import { Bell, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"; // Adjust the path
import { Input } from "./ui/input"; // Adjust the path

export function Header() {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white shadow-sm gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Welcome back, Juwita 👋</h1>
        <p className="text-sm text-muted-foreground">
          Here's what's happening with your team today.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        {/* Search Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
              <DialogDescription>
                Search for employees, departments, and more.
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </DialogContent>
        </Dialog>

        {/* Notification */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-5 w-5" />
          </Button>
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
        </div>
      </div>
    </header>
  );
}
