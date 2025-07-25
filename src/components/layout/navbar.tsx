"use client";

import type { ReactNode } from "react";
import { Bell, Search, Brain, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export interface NavbarAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

export interface NavbarUser {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface NavbarLink {
  href: string;
  label: string;
}

export interface NavbarProps {
  variant?: "dashboard" | "landing";
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  user?: NavbarUser;
  actions?: NavbarAction[];
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  children?: ReactNode;
  // Landing page specific props
  links?: NavbarLink[];
  brandName?: string;
  showAuth?: boolean;
}

export function Navbar({
  variant = "dashboard",
  searchPlaceholder = "Search...",
  onSearch,
  user,
  actions = [],
  showNotifications = true,
  notificationCount,
  onNotificationClick,
  children,
  links = [],
  brandName = "Claisse",
  showAuth = true,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultActions: NavbarAction[] = [
    { label: "Profile", onClick: () => console.log("Profile clicked") },
    { label: "Settings", onClick: () => console.log("Settings clicked") },
    { label: "Sign out", onClick: () => console.log("Sign out clicked") },
  ];

  const menuActions = actions.length > 0 ? actions : defaultActions;

  if (variant === "landing") {
    return (
      <>
        <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                {brandName}
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-all duration-200 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              {showAuth && (
                <div className="flex items-center space-x-4">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                    Get Started - FREE
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>

            {children}
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-card shadow-xl border-l border-border">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold text-card-foreground">
                        {brandName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-muted-foreground"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <nav className="flex-1 px-6 py-6">
                  <div className="space-y-4">
                    {links.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        className="block text-muted-foreground hover:text-primary transition-colors font-medium py-3 text-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </nav>

                {showAuth && (
                  <div className="p-6 border-t border-border space-y-4">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3">
                      Get Started - FREE
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Dashboard variant (original)
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <SidebarTrigger />
        <div className="flex flex-1 items-center gap-4">
          {onSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {children}
        </div>
        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onNotificationClick}
            >
              <Bell className="h-4 w-4" />
              {notificationCount && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Button>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {menuActions.map((action, index) => (
                  <DropdownMenuItem key={index} onClick={action.onClick}>
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
