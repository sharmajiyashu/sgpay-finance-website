"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  IconUsers,
  IconHelp,
  IconClock,
  IconProgress,
  IconCircleCheck,
  IconUsersGroup,
  IconLink,
  IconHierarchy,
} from "@tabler/icons-react";
import { getDashboardStats } from "@/sg-admin/lib/services/dashboardService";
import { RoarReferralCopyCard } from "@/components/roar/RoarReferralCopyCard";
import { getRoarReferralLink } from "@/sg-admin/lib/services/roarReferralService";
import { twMerge } from "tailwind-merge";
import {
  RecordCard,
  RecordCardField,
  RecordCardFields,
  RecordCardHeader,
  ResponsiveRecordList,
} from "@/components/ui/ResponsiveRecordList";

function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <div className={twMerge("rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <p className="text-destructive">
        {error instanceof Error ? error.message : "Failed to load dashboard"}
      </p>
    );
  }

  const stats = data!;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of users, enquiries, and Roar referrals
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Users" value={stats.totalUsers} icon={IconUsers} />
        <StatCard label="Active Users" value={stats.activeUsers} icon={IconUsers} />
        <StatCard label="Total Enquiries" value={stats.totalEnquiries} icon={IconHelp} />
        <StatCard label="Pending Enquiries" value={stats.enquiriesByStatus.pending} icon={IconClock} />
        <StatCard label="Pending Agents" value={stats.pendingAgents ?? 0} icon={IconUsersGroup} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Roar Credit Card Referrals</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Roar Enquiries"
            value={stats.roarEnquiries ?? 0}
            icon={IconLink}
          />
          <StatCard
            label="Attributed Referrals"
            value={stats.roarAttributed ?? 0}
            icon={IconHierarchy}
          />
          <StatCard
            label="Roar Pending"
            value={stats.roarPending ?? 0}
            icon={IconClock}
          />
        </div>
        <div className="mt-4 space-y-3">
          <RoarReferralCopyCard getLink={getRoarReferralLink} queryScope="admin-dashboard" />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/choice-connect/roar-bank-enquiry"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Roar Bank Enquiry
            </Link>
            <Link
              href="/admin/choice-connect/roar-referral-tree"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Roar Referral Tree
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold">Enquiries by Status</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <IconClock className="h-4 w-4" /> Pending
              </span>
              <span className="font-semibold">{stats.enquiriesByStatus.pending}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <IconProgress className="h-4 w-4" /> In Progress
              </span>
              <span className="font-semibold">{stats.enquiriesByStatus.in_progress}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <IconCircleCheck className="h-4 w-4" /> Resolved
              </span>
              <span className="font-semibold">{stats.enquiriesByStatus.resolved}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4">
            <ResponsiveRecordList
              isEmpty={stats.recentEnquiries.length === 0}
              emptyMessage="No enquiries yet"
              table={
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="px-4 pb-2 pr-4 font-medium">Name</th>
                      <th className="px-4 pb-2 pr-4 font-medium">Email</th>
                      <th className="px-4 pb-2 pr-4 font-medium">Status</th>
                      <th className="px-4 pb-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentEnquiries.map((e) => (
                      <tr key={e._id} className="border-b border-border/50">
                        <td className="px-4 py-3 pr-4 font-medium">{e.name}</td>
                        <td className="px-4 py-3 pr-4 text-muted-foreground">{e.email}</td>
                        <td className="px-4 py-3 pr-4 capitalize">{e.status.replace("_", " ")}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(e.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
              cards={stats.recentEnquiries.map((e) => (
                <RecordCard key={e._id}>
                  <RecordCardHeader
                    title={e.name}
                    subtitle={e.email}
                    badge={
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                        {e.status.replace("_", " ")}
                      </span>
                    }
                  />
                  <RecordCardFields>
                    <RecordCardField
                      label="Date"
                      value={new Date(e.createdAt).toLocaleDateString()}
                    />
                  </RecordCardFields>
                </RecordCard>
              ))}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/users"
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Manage Users
        </Link>
        <Link
          href="/admin/enquiries"
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Manage Enquiries
        </Link>
        <Link
          href="/admin/insurance/motor"
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Motor Insurance
        </Link>
      </div>
    </div>
  );
}
