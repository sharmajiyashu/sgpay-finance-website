"use client";

import * as React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  IconChevronLeft,
  IconUser,
  IconHeart,
  IconClock,
  IconMapPin,
  IconCalendar,
  IconTrash
} from "@tabler/icons-react";
import {
  getAppUserDetail,
  getUserLikesSent,
  getUserLikesReceived,
  getUserMatches,
  deleteLike,
  deleteMatch,
  type AppUser,
  type UserLike,
  type UserMatch,
  type MobileProfileImage,
} from "@/lib/services/userManagementService";
import { useTranslations } from "@/contexts/LanguageContext";
import { twMerge } from "tailwind-merge";

type Tab = "profile" | "likes-sent" | "likes-received" | "matches";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslations();
  const userId = Number(params.id);

  const [user, setUser] = React.useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = React.useState<Tab>("profile");
  const [loading, setLoading] = React.useState(true);
  const [tabData, setTabData] = React.useState<(UserLike | UserMatch)[]>([]);
  const [tabLoading, setTabLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUser = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getAppUserDetail(userId);
      setUser(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("userManagement.failedToLoad"));
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  const fetchTabData = React.useCallback(async (tab: Tab) => {
    if (!userId) return;
    setTabLoading(true);
    try {
      let data: (UserLike | UserMatch)[] = [];
      if (tab === "likes-sent") data = await getUserLikesSent(userId, { limit: 100 });
      else if (tab === "likes-received") data = await getUserLikesReceived(userId, { limit: 100 });
      else if (tab === "matches") data = await getUserMatches(userId, { limit: 100 });
      setTabData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setTabLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  React.useEffect(() => {
    if (activeTab !== "profile") {
      fetchTabData(activeTab);
    }
  }, [activeTab, fetchTabData]);

  const getProfileImageUrl = React.useCallback((img: MobileProfileImage) => {
    return img.media?.url ?? img.url ?? null;
  }, []);

  const primaryImage = React.useMemo(() => {
    if (!user?.profileImages || user.profileImages.length === 0) return null;
    const explicitPrimary = user.profileImages.find((img) => img.isPrimary);
    if (explicitPrimary) return explicitPrimary;
    const sorted = [...user.profileImages].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    return sorted[0] ?? null;
  }, [user?.profileImages]);

  const primaryImageUrl = React.useMemo(() => {
    return primaryImage ? getProfileImageUrl(primaryImage) : null;
  }, [getProfileImageUrl, primaryImage]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <IconClock className="h-10 w-10 animate-spin text-primary/20" />
          <p className="text-sm font-medium text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-sm font-medium text-destructive">{error || "User not found"}</p>
        <button onClick={() => router.back()} className="rounded-xl border border-border px-4 py-2 text-sm">
          {t("userDetails.backToList")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:bg-muted active:scale-95"
        >
          <IconChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{user.firstName} {user.lastName}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Summary Card */}
        <div className="space-y-6 lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative aspect-square w-full bg-muted/30">
              {primaryImageUrl ? (
                <Image
                  src={primaryImageUrl}
                  alt="Profile"
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/20">
                  <IconUser className="h-24 w-24" />
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconMapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground capitalize">{user.profile?.gender || "Not specified"}</p>
                    <p>{t("userDetails.gender")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconCalendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {user.profile?.dob ? new Date(user.profile.dob).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                    <p>{t("userDetails.dob")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconClock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <p>{t("userManagement.createdAt")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs Content */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-6">
            <div className="flex gap-1 rounded-2xl border border-border bg-muted/20 p-1">
              {(["profile", "likes-sent", "likes-received", "matches"] as Tab[]).map((tab) => {
                const labelMap: Record<Tab, string> = {
                  profile: t("userDetails.profile"),
                  "likes-sent": t("userDetails.likesSent"),
                  "likes-received": t("userDetails.likesReceived"),
                  matches: t("userDetails.matches"),
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={twMerge(
                      "flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
                      activeTab === tab
                        ? "bg-background text-primary shadow-sm ring-1 ring-border"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    )}
                  >
                    {labelMap[tab]}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[300px]">
              {activeTab === "profile" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <section>
                    <h3 className="mb-4 text-lg font-bold text-foreground">{t("userDetails.bio")}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      {user.profile?.bio || "No bio provided."}
                    </p>
                  </section>

                  <section className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("userDetails.personalInfo")}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.relationship")}</span>
                          <span className="font-medium text-foreground">{user.profile?.relationshipStatus || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.education")}</span>
                          <span className="font-medium text-foreground">{user.profile?.educationLevel || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.height")}</span>
                          <span className="font-medium text-foreground">{user.profile?.height ? `${user.profile.height} cm` : "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userManagement.email")}</span>
                          <span className="font-medium text-foreground break-all">{user.email || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userManagement.mobile")}</span>
                          <span className="font-medium text-foreground">{user.mobile || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userManagement.firstName")}</span>
                          <span className="font-medium text-foreground">
                            {user.firstName || "—"} {user.lastName || ""}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.languages")}</span>
                          <span className="font-medium text-foreground">
                            {user.profile?.languages && user.profile.languages.length > 0
                              ? user.profile.languages.join(", ")
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.location")}</span>
                          <span className="font-medium text-foreground">
                            {user.profile?.location
                              ? [
                                  user.profile.location.name,
                                  user.profile.location.city,
                                  user.profile.location.state,
                                  user.profile.location.zipcode,
                                ]
                                  .filter(Boolean)
                                  .join(", ")
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("userDetails.preferences")}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.drinking")}</span>
                          <span className="font-medium text-foreground">{user.profile?.drinkingHabits || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.smoking")}</span>
                          <span className="font-medium text-foreground">{user.profile?.smokingHabits || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.pets")}</span>
                          <span className="font-medium text-foreground">{user.profile?.havePets || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.children")}</span>
                          <span className="font-medium text-foreground">{user.profile?.haveChildren || "—"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.searchingFor")}</span>
                          <span className="font-medium text-foreground">
                            {user.profile?.searchingFor && user.profile.searchingFor.length > 0
                              ? user.profile.searchingFor.join(", ")
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t("userDetails.connectionType")}</span>
                          <span className="font-medium text-foreground">
                            {user.profile?.connectionType && user.profile.connectionType.length > 0
                              ? user.profile.connectionType.join(", ")
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {user.profileImages && user.profileImages.length > 0 && (
                    <section className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {t("userDetails.photos")}
                      </h3>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {user.profileImages.map((img) => {
                          const url = getProfileImageUrl(img);
                          return (
                          <div
                            key={img.id}
                            className={twMerge(
                              "relative h-24 overflow-hidden rounded-xl border border-border/60 bg-muted/20 sm:h-28",
                              img.id === primaryImage?.id && "ring-2 ring-primary border-transparent"
                            )}
                          >
                            {url ? (
                              <Image
                                src={url}
                                alt="Profile"
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/20">
                                <IconUser className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {activeTab !== "profile" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {tabLoading ? (
                    <div className="flex h-40 items-center justify-center gap-2 text-muted-foreground">
                      <IconClock className="h-5 w-5 animate-spin" />
                      {t("common.loading")}
                    </div>
                  ) : tabData.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground opacity-50">
                      <IconHeart className="h-8 w-8" />
                      {t(activeTab === "matches" ? "userDetails.noMatches" : "userDetails.noLikes")}
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {tabData.map((item, idx) => {
                        let otherUser: AppUser | undefined;
                        let date: string | undefined;

                        if (activeTab === "matches") {
                          const match = item as UserMatch;
                          otherUser = match.user1?.id === userId ? match.user2 : match.user1;
                          date = match.matchedAt ?? match.createdAt ?? match.updatedAt;
                        } else {
                          const like = item as UserLike;
                          otherUser =
                            activeTab === "likes-sent"
                              ? like.liked ?? like.receiver
                              : like.liker ?? like.sender;
                          date = like.createdAt ?? like.updatedAt;
                        }

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-muted/10 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                                {otherUser?.firstName?.[0] || <IconUser className="h-4 w-4" />}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-foreground truncate">
                                  {otherUser?.firstName || "Unknown"} {otherUser?.lastName || ""}
                                </span>
                                {date && (
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                                    {new Date(date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={async () => {
                                if (activeTab === "matches") await deleteMatch(item.id);
                                else await deleteLike(item.id);
                                fetchTabData(activeTab);
                              }}
                              className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
