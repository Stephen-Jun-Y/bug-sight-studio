import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { getStoredLanguage, useI18n } from "@/lib/language";
import { updateStoredUser } from "@/lib/auth";
import { toast } from "@/components/ui/sonner";
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/services/user-service";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const data = await getCurrentUserProfile();
        if (!active) return;

        setNickname(data.nickname || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
      } catch (error) {
        const loadProfileError =
          getStoredLanguage() === "en-US" ? "Failed to load profile. Please try again." : "资料加载失败，请稍后重试";
        toast.error(error instanceof Error ? error.message : loadProfileError);
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);
      const updatedProfile = await updateCurrentUserProfile({
        nickname,
        bio,
        location,
      });
      updateStoredUser(updatedProfile);
      navigate("/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("保存失败，请稍后重试", "Failed to save changes. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileLayout>
      <div className="h-full bg-background">
        <PageHeader
          title={t("编辑资料", "Edit profile")}
          right={
            <button onClick={handleSave} className="text-caption text-primary font-semibold" disabled={saving}>
              {t("保存", "Save")}
            </button>
          }
        />
        <div className="px-5 mt-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-secondary border-[3px] border-primary overflow-hidden">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[48px]">🦋</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="profile-nickname" className="text-small text-muted-foreground mb-1 block">
                {t("昵称", "Nickname")}
              </label>
              <input
                id="profile-nickname"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full h-[50px] bg-card rounded-md px-4 text-body text-foreground card-shadow micro-border outline-none focus:focus-glow transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="profile-bio" className="text-small text-muted-foreground mb-1 block">
                {t("简介", "Bio")}
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                maxLength={100}
                className="w-full bg-card rounded-md px-4 py-3 text-body text-foreground card-shadow micro-border outline-none focus:focus-glow transition-shadow resize-none"
              />
              <p className="text-small text-muted-foreground text-right mt-1">{bio.length}/100</p>
            </div>
            <div>
              <label htmlFor="profile-location" className="text-small text-muted-foreground mb-1 block">
                {t("所在地", "Location")}
              </label>
              <input
                id="profile-location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full h-[50px] bg-card rounded-md px-4 text-body text-foreground card-shadow micro-border outline-none focus:focus-glow transition-shadow"
              />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap mt-8 disabled:opacity-50">
            {t("保存修改", "Save changes")}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default EditProfilePage;
