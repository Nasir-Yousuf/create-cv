import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePersonalInfo, updateDesign } from '../../../store/cvSlice';
import { showToast } from '../../../store/uiSlice';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  ZoomOut,
  Crop,
  Check,
  Circle,
  Square,
  Maximize2,
  RotateCcw,
  Sliders,
  Palette,
  Move,
} from 'lucide-react';

export const PhotoUploadCropModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { personalInfo = {}, design = {} } = useSelector((state) => state.cv.currentCV || {});
  const photoConfig = personalInfo?.photoConfig || {};

  const [rawImage, setRawImage] = useState(null);
  const [zoom, setZoom] = useState(photoConfig?.zoom || 1);
  const [aspect, setAspect] = useState(
    photoConfig?.aspect === 0.75 ? '3:4' : photoConfig?.aspect === 0.8 ? '4:5' : '1:1'
  );
  const [photoStyle, setPhotoStyle] = useState(personalInfo?.photoStyle || photoConfig?.shape || 'circle');
  const [photoSize, setPhotoSize] = useState(design?.photoSize || 'md');
  const [panX, setPanX] = useState(photoConfig?.panX || 0);
  const [panY, setPanY] = useState(photoConfig?.panY || 0);
  const [borderWidth, setBorderWidth] = useState(typeof photoConfig?.borderWidth === 'number' ? photoConfig.borderWidth : 2);
  const [borderColor, setBorderColor] = useState(photoConfig?.borderColor || '#e2e8f0');
  const [bgColor, setBgColor] = useState(photoConfig?.bgColor || '#ffffff');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(photoConfig?.zoom || 1);
      setAspect(photoConfig?.aspect === 0.75 ? '3:4' : photoConfig?.aspect === 0.8 ? '4:5' : '1:1');
      setPhotoStyle(personalInfo?.photoStyle || photoConfig?.shape || 'circle');
      setPhotoSize(design?.photoSize || 'md');
      setPanX(photoConfig?.panX || 0);
      setPanY(photoConfig?.panY || 0);
      setBorderWidth(typeof photoConfig?.borderWidth === 'number' ? photoConfig.borderWidth : 2);
      setBorderColor(photoConfig?.borderColor || '#e2e8f0');
      setBgColor(photoConfig?.bgColor || '#ffffff');
      setRawImage(null);
    }
  }, [isOpen]);

  const handleFile = (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      dispatch(showToast({ message: 'Please upload a JPEG, PNG, or WebP image.', type: 'error' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      dispatch(showToast({ message: 'Image size must be less than 5MB.', type: 'error' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setRawImage(e.target.result);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const currentDisplayPhoto = rawImage || personalInfo?.photo;

  const handleSaveCrop = () => {
    if (!currentDisplayPhoto) {
      onClose();
      return;
    }

    const aspectValue = aspect === '3:4' ? 0.75 : aspect === '4:5' ? 0.8 : 1.0;
    const targetW = 480;
    const targetH = Math.round(targetW / aspectValue);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentDisplayPhoto;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      // Background fill
      ctx.fillStyle = bgColor || '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);

      // Enforce object-fit: cover with zoom and pan
      const baseScale = Math.max(targetW / img.width, targetH / img.height);
      const finalScale = baseScale * zoom;
      const drawW = img.width * finalScale;
      const drawH = img.height * finalScale;

      const drawX = (targetW - drawW) / 2 + (panX / 100) * targetW;
      const drawY = (targetH - drawH) / 2 + (panY / 100) * targetH;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

      const newConfig = {
        shape: photoStyle,
        zoom,
        aspect: aspectValue,
        borderWidth,
        borderColor,
        bgColor,
        panX,
        panY,
      };

      dispatch(
        updatePersonalInfo({
          photo: croppedDataUrl,
          photoUrl: croppedDataUrl,
          photoStyle,
          photoConfig: newConfig,
        })
      );
      dispatch(
        updateDesign({
          showPhoto: true,
          photoSize,
        })
      );
      dispatch(showToast({ message: 'Profile photo optimized and saved!', type: 'success' }));
      onClose();
    };

    img.onerror = () => {
      // Fallback if image cannot be loaded into canvas
      const newConfig = {
        shape: photoStyle,
        zoom,
        aspect: aspectValue,
        borderWidth,
        borderColor,
        bgColor,
        panX,
        panY,
      };
      dispatch(
        updatePersonalInfo({
          photoStyle,
          photoConfig: newConfig,
        })
      );
      dispatch(
        updateDesign({
          showPhoto: true,
          photoSize,
        })
      );
      dispatch(showToast({ message: 'Photo configuration updated', type: 'info' }));
      onClose();
    };
  };

  const handleRemovePhoto = () => {
    dispatch(
      updatePersonalInfo({
        photo: '',
        photoUrl: '',
      })
    );
    dispatch(
      updateDesign({
        showPhoto: false,
      })
    );
    setRawImage(null);
    dispatch(showToast({ message: 'Profile photo removed', type: 'info' }));
    onClose();
  };

  // Preview box dimensions
  const previewBoxWidth = 140;
  const previewBoxHeight =
    aspect === '3:4'
      ? Math.round(previewBoxWidth / 0.75) // 187px
      : aspect === '4:5'
      ? Math.round(previewBoxWidth / 0.8) // 175px
      : previewBoxWidth; // 140px

  const previewRadius =
    photoStyle === 'circle' && aspect === '1:1'
      ? '9999px'
      : photoStyle === 'rounded'
      ? '18px'
      : '0px';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile Photo Studio"
      subtitle="High-fidelity cropping, zoom, position panning, and frame styling."
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 pt-2 text-xs">
        {/* Drag & Drop Upload Zone (when no image) */}
        {!currentDisplayPhoto ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              isDraggingOver
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 scale-[1.02]'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-900/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Drag & drop photo here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              or click to browse from device / gallery
            </p>
            <p className="text-[10px] text-slate-400 mt-3">
              Supports JPG, PNG, WebP (Max 5MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Interactive Studio Canvas */}
            <div className="relative flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl overflow-hidden min-h-[220px]">
              <div
                className="relative overflow-hidden shadow-2xl transition-all duration-200"
                style={{
                  width: `${previewBoxWidth}px`,
                  height: `${previewBoxHeight}px`,
                  borderRadius: previewRadius,
                  border: `${borderWidth}px solid ${borderColor}`,
                  backgroundColor: bgColor,
                }}
              >
                <img
                  src={currentDisplayPhoto}
                  alt="Crop Preview"
                  className="w-full h-full object-cover transition-transform origin-center pointer-events-none select-none"
                  style={{
                    transform: `translate(${panX}%, ${panY}%) scale(${zoom})`,
                  }}
                />
              </div>

              {/* Action Pills inside Preview */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPanX(0);
                    setPanY(0);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium backdrop-blur-sm transition-colors flex items-center gap-1"
                  title="Reset Zoom & Pan"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-[11px] font-bold shadow-sm transition-colors flex items-center gap-1"
                >
                  <UploadCloud className="w-3 h-3 text-indigo-600" /> Replace
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Controls Tabs / Sections */}
            <div className="space-y-3.5 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {/* 1. Aspect Ratio & Frame Shape */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Aspect Ratio
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: '1:1', label: '1:1 Sq' },
                      { id: '3:4', label: '3:4 BD' },
                      { id: '4:5', label: '4:5 Port' },
                    ].map((asp) => (
                      <button
                        key={asp.id}
                        type="button"
                        onClick={() => {
                          setAspect(asp.id);
                          if (asp.id !== '1:1' && photoStyle === 'circle') {
                            setPhotoStyle('rounded');
                          }
                        }}
                        className={`py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                          aspect === asp.id
                            ? 'border-indigo-600 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {asp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Frame Shape
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'circle', label: 'Circle', icon: Circle, disabled: aspect !== '1:1' },
                      { id: 'rounded', label: 'Rounded', icon: Square, disabled: false },
                      { id: 'square', label: 'Square', icon: Square, disabled: false },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        disabled={s.disabled}
                        onClick={() => setPhotoStyle(s.id)}
                        className={`py-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                          photoStyle === s.id
                            ? 'border-indigo-600 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                            : s.disabled
                            ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <s.icon className="w-3 h-3" />
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Zoom & Pan Controls */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-indigo-500" /> Zoom ({Math.round(zoom * 100)}%)
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))}
                      className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.1).toFixed(2))))}
                      className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Pan Horizontal</span>
                      <span className="font-mono">{panX}%</span>
                    </span>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={panX}
                      onChange={(e) => setPanX(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Pan Vertical</span>
                      <span className="font-mono">{panY}%</span>
                    </span>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="1"
                      value={panY}
                      onChange={(e) => setPanY(parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Border & Background Styling */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Border Thickness
                    </span>
                    <div className="grid grid-cols-5 gap-1">
                      {[0, 1, 2, 3, 4].map((bw) => (
                        <button
                          key={bw}
                          type="button"
                          onClick={() => setBorderWidth(bw)}
                          className={`py-1 rounded-lg border text-[11px] font-semibold ${
                            borderWidth === bw
                              ? 'border-indigo-600 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600'
                          }`}
                        >
                          {bw}px
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Border Color
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-full px-2 py-1 text-[11px] font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Fill Background
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                      />
                      <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                        {bgColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Size on Resume
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      {['sm', 'md', 'lg', 'xl'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setPhotoSize(sz)}
                          className={`py-1 rounded-lg border text-[11px] font-semibold uppercase ${
                            photoSize === sz
                              ? 'border-indigo-600 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {personalInfo?.photo ? (
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleRemovePhoto}
            >
              Remove Photo
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {currentDisplayPhoto && (
              <Button variant="primary" size="sm" icon={Check} onClick={handleSaveCrop}>
                Apply Photo
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PhotoUploadCropModal;
