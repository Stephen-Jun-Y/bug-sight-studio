const normalizeUrl = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

const isBlobUrl = (value?: string) => Boolean(value?.startsWith("blob:"));

type ResolveSpeciesCoverOptions = {
  coverImageUrl?: string | null;
  recognitionImageUrl?: string | null;
  previewUrl?: string | null;
  allowPreviewUrl?: boolean;
  fallbackSrc: string;
};

export const resolveSpeciesCover = ({
  coverImageUrl,
  recognitionImageUrl,
  previewUrl,
  allowPreviewUrl = false,
  fallbackSrc,
}: ResolveSpeciesCoverOptions) => {
  const stableCover = normalizeUrl(coverImageUrl);
  if (stableCover) {
    return stableCover;
  }

  const uploadedImage = normalizeUrl(recognitionImageUrl);
  if (uploadedImage) {
    return uploadedImage;
  }

  const transientPreview = normalizeUrl(previewUrl);
  if (transientPreview && allowPreviewUrl) {
    return transientPreview;
  }

  if (transientPreview && !isBlobUrl(transientPreview)) {
    return transientPreview;
  }

  return fallbackSrc;
};

export const shouldRevokePreviewUrl = (previewUrl?: string | null) => isBlobUrl(normalizeUrl(previewUrl));
