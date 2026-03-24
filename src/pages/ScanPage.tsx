import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Image, RotateCcw, X, Zap } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import insectBee from "@/assets/insect-bee.jpg";
import { toast } from "@/components/ui/sonner";
import { getAccessToken } from "@/lib/auth";
import { useI18n } from "@/lib/language";
import { saveCurrentRecognition } from "@/lib/recognition-session";
import { recognizeInsect } from "@/services/recognition-service";

type ScanState = "camera" | "preview" | "scanning";

const ScanPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [state, setState] = useState<ScanState>("camera");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeScanRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStartingLiveCamera, setIsStartingLiveCamera] = useState(true);
  const [liveCameraError, setLiveCameraError] = useState("");
  const [hasLiveCameraStream, setHasLiveCameraStream] = useState(false);

  const updateSelectedImage = (file: File, nextPreviewUrl: string) => {
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
    setProgress(0);
    setState("preview");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const stopLiveCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setHasLiveCameraStream(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (state !== "camera") {
      stopLiveCamera();
      setIsStartingLiveCamera(false);
      return;
    }

    let active = true;

    const startLiveCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setLiveCameraError(t("当前设备不支持实时取景，将回退到系统相机", "Live preview is not supported on this device. Falling back to the system camera."));
        setIsStartingLiveCamera(false);
        return;
      }

      setIsStartingLiveCamera(true);
      setLiveCameraError("");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setHasLiveCameraStream(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : "";
        if (/denied|permission|notallowed/i.test(message)) {
          setLiveCameraError(t("未获得相机权限，将回退到系统相机", "Camera permission was denied. Falling back to the system camera."));
        } else {
          setLiveCameraError(t("实时取景启动失败，将回退到系统相机", "Failed to start live preview. Falling back to the system camera."));
        }
      } finally {
        if (active) {
          setIsStartingLiveCamera(false);
        }
      }
    };

    startLiveCamera();

    return () => {
      active = false;
      stopLiveCamera();
    };
  }, [state, t]);

  useEffect(() => {
    if (!hasLiveCameraStream || !videoRef.current || !streamRef.current) {
      return;
    }

    videoRef.current.srcObject = streamRef.current;
    videoRef.current.play().catch(() => undefined);
  }, [hasLiveCameraStream]);

  const captureWithNativeCamera = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (!photo.webPath) {
        openPicker();
        return;
      }

      const response = await fetch(photo.webPath);
      if (!response.ok) {
        throw new Error("Failed to read captured image");
      }

      const blob = await response.blob();
      const extension = photo.format || blob.type.split("/")[1] || "jpeg";
      const type = blob.type || `image/${extension}`;
      const file = new File([blob], `capture-${Date.now()}.${extension}`, { type });
      const nextPreviewUrl = URL.createObjectURL(file);
      updateSelectedImage(file, nextPreviewUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (/cancel/i.test(message)) {
        return;
      }

      openPicker();
    }
  };

  const handleCapture = async () => {
    if (!streamRef.current || !videoRef.current) {
      await captureWithNativeCamera();
      return;
    }

    const canvas = captureCanvasRef.current ?? document.createElement("canvas");
    captureCanvasRef.current = canvas;
    const video = videoRef.current;
    const width = video.videoWidth || 1080;
    const height = video.videoHeight || 1440;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      await captureWithNativeCamera();
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((nextBlob) => resolve(nextBlob), "image/jpeg", 0.92);
    });

    if (!blob) {
      await captureWithNativeCamera();
      return;
    }

    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
    const nextPreviewUrl = URL.createObjectURL(file);
    updateSelectedImage(file, nextPreviewUrl);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("请选择图片文件", "Please choose an image file"));
      return;
    }

    updateSelectedImage(file, URL.createObjectURL(file));
  };

  const handleRetake = () => {
    setState("camera");
    setProgress(0);
    setSelectedFile(null);
    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      toast.error(t("请先选择一张图片", "Please select an image first"));
      return;
    }
    if (!getAccessToken()) {
      toast.error(t("请先登录后再识别", "Please sign in before starting recognition"));
      navigate("/auth");
      return;
    }

    const scanId = Date.now();
    activeScanRef.current = scanId;
    setState("scanning");
    setProgress(8);

    const progressTimer = window.setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + Math.random() * 12));
    }, 180);

    try {
      const recognition = await recognizeInsect(selectedFile);
      if (activeScanRef.current !== scanId) return;

      window.clearInterval(progressTimer);
      setProgress(100);
      saveCurrentRecognition({ recognition });
      setTimeout(() => {
        navigate("/result", {
          state: {
            recognition,
            previewUrl,
          },
        });
      }, 250);
    } catch (error) {
      if (activeScanRef.current !== scanId) return;

      window.clearInterval(progressTimer);
      setState("preview");
      setProgress(0);
      toast.error(error instanceof Error ? error.message : t("识别失败，请稍后重试", "Recognition failed. Please try again later."));
    }
  };

  const handleCancel = () => {
    activeScanRef.current = Date.now();
    setState(selectedFile ? "preview" : "camera");
    setProgress(0);
  };

  return (
    <MobileLayout>
      <div className="relative h-full min-h-full overflow-hidden bg-foreground">
        {state === "camera" && (
          <>
            <div className="absolute inset-0 bg-black">
              {hasLiveCameraStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  aria-label={t("实时取景画面", "Live camera preview")}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-foreground/40" />
          </>
        )}

        {(state === "preview" || state === "scanning") && (
          <div className="absolute inset-0">
            <img src={previewUrl || insectBee} alt="captured" className={`w-full h-full object-cover ${state === "scanning" ? "brightness-50" : ""} transition-all duration-300`} />
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          aria-label={t("关闭扫描页", "Close scan")}
          className="safe-top-anchor absolute left-5 z-20 btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X size={24} className="text-primary-foreground" />
        </button>

        {state === "camera" && (
          <button
            aria-label={t("闪光灯", "Flash")}
            className="safe-top-anchor absolute right-5 z-20 btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Zap size={22} className="text-primary-foreground" />
          </button>
        )}

        {state === "camera" && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[200px] h-[200px]">
                {[
                  "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                  "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-8 h-8 border-primary-foreground ${cls}`} />
                ))}
              </div>
              <div className="absolute mt-60 text-center px-6">
                <p className="text-caption text-primary-foreground/70">{t("将昆虫置于取景框内", "Place the insect inside the frame")}</p>
                {isStartingLiveCamera && (
                  <p className="mt-2 text-small text-primary-foreground/60">{t("正在启动实时取景...", "Starting live preview...")}</p>
                )}
                {!isStartingLiveCamera && liveCameraError && (
                  <p className="mt-2 text-small text-primary-foreground/60">{liveCameraError}</p>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 glass-dark pb-safe-sheet pt-4">
              <div className="flex items-center justify-around px-8">
                <button
                  onClick={openPicker}
                  aria-label={t("从相册选择", "Choose from gallery")}
                  className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Image size={26} className="text-primary-foreground" />
                </button>
                <button
                  onClick={handleCapture}
                  aria-label={t("拍照识别", "Take photo")}
                  className="w-[72px] h-[72px] rounded-full border-4 border-primary-foreground/80 flex items-center justify-center btn-tap"
                >
                  <div className="w-[58px] h-[58px] rounded-full bg-primary-foreground/90" />
                </button>
                <button
                  onClick={openPicker}
                  aria-label={t("重新选择图片", "Choose another image")}
                  className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <RotateCcw size={24} className="text-primary-foreground" />
                </button>
              </div>
            </div>
          </>
        )}

        <AnimatePresence>
          {state === "preview" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 glass-dark pb-safe-sheet pt-6 px-8"
            >
              <p className="text-center text-caption text-primary-foreground/70 mb-4">{t("确认使用这张照片进行识别？", "Use this photo for recognition?")}</p>
              <div className="flex gap-4">
                <button
                  onClick={handleRetake}
                  className="flex-1 h-12 rounded-xl bg-primary-foreground/20 text-primary-foreground font-semibold text-body btn-tap flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  {t("重拍", "Retake")}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-body btn-tap flex items-center justify-center gap-2"
                >
                  ✓ {t("确认识别", "Recognize")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-10"
            >
              <div className="relative w-24 h-24 mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full border-[3px] border-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-[2px] border-primary/60"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
                <div className="absolute inset-[18px] rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xl font-bold">AI</span>
                </div>
              </div>

              <p className="text-subtitle text-primary-foreground">{t("正在识别中...", "Recognizing...")}</p>
              <p className="text-caption text-primary-foreground/70 mt-1">{t("请保持图片清晰，稍候片刻", "Keep the photo clear for a moment")}</p>

              <div className="w-56 mt-6">
                <div className="h-2 bg-primary-foreground/15 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} />
                </div>
                <p className="text-center text-caption text-primary-foreground/60 mt-2">{Math.round(progress)}%</p>
              </div>

              <button onClick={handleCancel} className="mt-6 text-caption text-primary-foreground/70 btn-tap">
                {t("取消", "Cancel")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default ScanPage;
