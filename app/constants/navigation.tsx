import { Home, Users, Calendar, Menu, MessageSquare, BookOpen } from "lucide-react";

export const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/vendors", icon: Users, label: "Vendors" },
  { path: "/my-wedding", icon: Calendar, label: "My Wedding" },
  { path: "/messages", icon: MessageSquare, label: "Messages" },
  { path: "/my-bookings", icon: BookOpen, label: "My Bookings" },
  { path: "/more", icon: Menu, label: "More" },
];
