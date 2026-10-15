"use client";

import ProfileLayout from "@/src/layouts/profile-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileLayout page={children} />;
}
