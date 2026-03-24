import { Capacitor } from "@capacitor/core";
import { forwardRef, useEffect, useMemo, useState, type ImgHTMLAttributes } from "react";

type RemoteImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallbackSrc: string;
};

const REMOTE_URL_PATTERN = /^https?:\/\//i;

const isRemoteHttpImage = (src?: string | null) => Boolean(src && REMOTE_URL_PATTERN.test(src));

const RemoteImage = forwardRef<HTMLImageElement, RemoteImageProps>(
  ({ src, fallbackSrc, alt, ...props }, ref) => {
    const [resolvedSrc, setResolvedSrc] = useState(() => src || fallbackSrc);

    const shouldProxyViaFetch = useMemo(
      () => Capacitor.isNativePlatform() && isRemoteHttpImage(src),
      [src],
    );

    useEffect(() => {
      let cancelled = false;
      let objectUrl: string | null = null;

      if (!src) {
        setResolvedSrc(fallbackSrc);
        return;
      }

      if (!shouldProxyViaFetch) {
        setResolvedSrc(src);
        return;
      }

      const loadRemoteImage = async () => {
        try {
          const response = await fetch(src);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          if (!cancelled) {
            setResolvedSrc(objectUrl);
          }
        } catch {
          if (!cancelled) {
            setResolvedSrc(fallbackSrc);
          }
        }
      };

      void loadRemoteImage();

      return () => {
        cancelled = true;
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [fallbackSrc, shouldProxyViaFetch, src]);

    return <img ref={ref} src={resolvedSrc} alt={alt} {...props} />;
  },
);

RemoteImage.displayName = "RemoteImage";

export default RemoteImage;
