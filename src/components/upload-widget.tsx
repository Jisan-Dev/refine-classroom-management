import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { UploadWidgetValue } from "@/types";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function UploadWidget({
  value = null,
  onChange,
  disabled = false,
}: {
  value: UploadWidgetValue | null;
  onChange: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
}) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  const removeFromCloudinary = async () => {
    if (!deleteToken || isRemoving) return;

    try {
      setIsRemoving(true);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: deleteToken,
          }),
        },
      );

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();

      if (data.result !== "ok") {
        throw new Error("Failed to delete image from Cloudinary");
      }

      // Clear local state
      setPreview(null);
      setDeleteToken(null);

      // Inform parent
      onChangeRef.current?.(null);
    } catch (error) {
      console.error("Cloudinary delete failed:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  useEffect(() => {
    if (value) setPreview(value);
    if (!value) setDeleteToken(null);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return;

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "uploads",
          maxFileSize: 5000000,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
          return_delete_token: true,
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };

            console.log("rr", result.info);
            setPreview(payload);
            setDeleteToken(result.info.delete_token ?? null);
            onChangeRef.current?.(payload);
          }
        },
      );

      return true;
    };

    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) window.clearInterval(intervalId);
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-2">
      {preview ? (
        <>
          <div className="upload-preview">
            <img src={preview.url} alt="upload preview" />
          </div>
          <button
            type="button"
            onClick={removeFromCloudinary}
            disabled={isRemoving}
            className="text-sm text-red-500 cursor-pointer"
          >
            {isRemoving ? (
              <span className="flex items-center gap-1">
                <Loader2 className="animate-spin size-5 -mt-1" />
                Removing...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <X className="size-5 -mt-1" />
                Remove image
              </span>
            )}
          </button>
        </>
      ) : (
        <div
          className="upload-dropzone"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            openWidget();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              openWidget();
            }
          }}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo.</p>
              <p className="text-center">PNG, JPG, WEBP upto 5mb.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
