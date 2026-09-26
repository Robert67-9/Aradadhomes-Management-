import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Film,
  Trash2,
  Check,
  Play,
  Loader2,
  Sparkles,
  FileVideo,
  Save,
} from 'lucide-react';
import { Apartment } from '../types';
import { compressImageFile, readVideoFile, formatFileSize } from '../utils/mediaUpload';

interface ManageMediaModalProps {
  apartment: Apartment;
  isOpen: boolean;
  onClose: () => void;
  onSaveMedia: (updatedApartment: Apartment) => void;
}

export const ManageMediaModal: React.FC<ManageMediaModalProps> = ({
  apartment,
  isOpen,
  onClose,
  onSaveMedia,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos');
  const [images, setImages] = useState<string[]>(apartment.images || []);
  const [videoUrl, setVideoUrl] = useState<string>(
    apartment.videoUrl || (apartment.videos && apartment.videos[0]) || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle uploading photos
  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setNotice('Optimizing and compressing photos...');

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file);
        newUrls.push(compressed);
      }

      if (newUrls.length > 0) {
        setImages((prev) => [...prev, ...newUrls]);
        setNotice(`Added ${newUrls.length} new photo${newUrls.length > 1 ? 's' : ''}.`);
      }
    } catch (err) {
      console.error(err);
      setNotice('Error uploading image files.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setNotice(null), 3500);
    }
  };

  // Handle uploading video
  const handleUploadVideo = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('video/')) {
      setNotice('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setIsProcessing(true);
    setNotice('Loading video tour file...');

    try {
      const vidDataUrl = await readVideoFile(file);
      setVideoUrl(vidDataUrl);
      setNotice(`Video tour "${file.name}" loaded successfully.`);
    } catch (err) {
      console.error(err);
      setNotice('Error loading video file.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setNotice(null), 3500);
    }
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    if (images.length <= 1) {
      setNotice('A residence requires at least one cover photo.');
      setTimeout(() => setNotice(null), 3000);
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Make cover photo
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
    setNotice('Cover photo updated.');
    setTimeout(() => setNotice(null), 2000);
  };

  // Save changes
  const handleSave = () => {
    const updated: Apartment = {
      ...apartment,
      images,
      videoUrl: videoUrl.trim() ? videoUrl.trim() : undefined,
      videos: videoUrl.trim() ? [videoUrl.trim()] : undefined,
    };
    onSaveMedia(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 px-6 py-4 bg-zinc-50/50">
          <div>
            <h2 className="font-serif text-lg font-bold text-zinc-950">
              Manage Photography & Video Media
            </h2>
            <p className="text-xs text-zinc-500">
              {apartment.title} · {apartment.city}, {apartment.country}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 bg-white px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-1.5 pb-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'photos'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Photos & Gallery ({images.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 pb-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'border-zinc-950 text-zinc-950 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Film className="h-4 w-4" />
            <span>Video Walkthrough {videoUrl ? '✓' : ''}</span>
          </button>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900">
            {isProcessing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-700 shrink-0" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-amber-700 shrink-0" />
            )}
            <span>{notice}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              {/* Dropzone */}
              <div
                onClick={() => imageInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleUploadImages(e.dataTransfer.files);
                }}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50/60 hover:bg-zinc-100/60 p-6 text-center transition-all cursor-pointer"
              >
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUploadImages(e.target.files)}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xs border border-zinc-200">
                  <UploadCloud className="h-5 w-5 text-zinc-700" />
                </div>
                <div className="mt-2.5 text-xs font-semibold text-zinc-900">
                  Upload more high-resolution photos
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Click or drag files · Supports JPG, PNG, WEBP · Auto-compressed
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative group rounded-xl overflow-hidden border-2 bg-zinc-100 shadow-2xs ${
                      i === 0 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-zinc-200'
                    }`}
                  >
                    <img src={img} alt="" className="aspect-4/3 w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                        ★ Primary Cover
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      {i !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(i)}
                          className="rounded-lg bg-white/90 hover:bg-white px-2 py-1 text-[10px] font-bold text-zinc-950 shadow-sm cursor-pointer"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(i)}
                        className="rounded-lg bg-rose-600/90 hover:bg-rose-600 p-1.5 text-white shadow-sm cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              {!videoUrl ? (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleUploadVideo(e.dataTransfer.files);
                  }}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50/60 hover:bg-zinc-100/60 p-8 text-center transition-all cursor-pointer"
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    className="hidden"
                    onChange={(e) => handleUploadVideo(e.target.files)}
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs border border-zinc-200">
                    <Film className="h-6 w-6 text-zinc-700" />
                  </div>
                  <div className="mt-2.5 text-xs font-semibold text-zinc-900">
                    Upload Video Walkthrough Tour
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Supports MP4, WebM, MOV files
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                      <FileVideo className="h-4 w-4 text-emerald-600" />
                      <span>Active Video Tour</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove Video</span>
                    </button>
                  </div>

                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md border border-zinc-200">
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* URL fallback */}
              <div className="pt-2 border-t border-zinc-100">
                <label className="block font-medium text-zinc-700 text-xs mb-1">
                  Or Direct Video Tour URL (MP4, YouTube, Vimeo)
                </label>
                <div className="relative">
                  <Film className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://assets.example.com/tour.mp4"
                    className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-950 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800 shadow-sm cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Media Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
