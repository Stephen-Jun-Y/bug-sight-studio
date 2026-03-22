import { useMemo, useRef, useState } from "react";
import { Hash, ImagePlus, Lock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/components/ui/sonner";
import { useI18n } from "@/lib/language";
import { createPost } from "@/services/post-service";

const PublishPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const { t } = useI18n();

  const visibility = 1;
  const unsetFieldLabel = t("未添加", "Not added");

  const options = useMemo(
    () => [
      { icon: Hash, label: t("添加话题", "Add tags"), value: unsetFieldLabel },
      { icon: MapPin, label: t("添加位置", "Add location"), value: unsetFieldLabel },
      { icon: Lock, label: t("隐私设置", "Privacy"), value: t("公开", "Public") },
    ],
    [t, unsetFieldLabel],
  );

  const handlePublish = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent || submitting) return;

    setSubmitting(true);
    try {
      await createPost(
        {
          content: trimmedContent,
          visibility,
        },
        selectedImage,
      );

      toast.success(t("发布成功", "Post published"));
      navigate("/community", { replace: true, state: { refreshAt: Date.now() } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("发布失败，请稍后重试", "Failed to publish. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto hide-scrollbar bg-background pb-safe-sheet">
        <PageHeader
          title={t("发布", "New post")}
          right={
            <button
              onClick={() => void handlePublish()}
              disabled={!content.trim() || submitting}
              className={`text-btn btn-tap ${content.trim() && !submitting ? "text-primary" : "text-muted-foreground"}`}
            >
              {submitting ? t("发布中", "Posting") : t("发布", "Post")}
            </button>
          }
        />

        <div className="mt-2 px-5">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border btn-tap"
            >
              <ImagePlus size={24} className="text-muted-foreground" />
              <span className="mt-1 text-[11px] text-muted-foreground">
                {selectedImage ? t("已选择", "Selected") : t("添加图片", "Add image")}
              </span>
            </button>

            {selectedImage ? (
              <div className="flex min-w-0 flex-1 flex-col justify-center rounded-xl bg-card px-4 py-3">
                <p className="truncate text-caption text-foreground">{selectedImage.name}</p>
                <p className="mt-1 text-small text-muted-foreground">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : null}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0];
              setSelectedImage(file);
            }}
          />

          <textarea
            value={content}
            onChange={event => setContent(event.target.value)}
            placeholder={t("分享你的发现...", "Share your discovery...")}
            maxLength={500}
            rows={6}
            className="w-full resize-none bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground"
          />
          <p className="text-right text-small text-muted-foreground">{content.length}/500</p>

          <div className="mt-4 space-y-0 border-t border-border">
            {options.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex w-full items-center justify-between border-b border-border py-3.5">
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-muted-foreground" />
                  <span className="text-body text-foreground">{label}</span>
                </div>
                <span className="text-caption text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PublishPage;
