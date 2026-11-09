import React, { useState, useRef } from 'react';
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
  Crop,
  Check,
  Circle,
  Square,
  Sparkles,
  Maximize2,
} from 'lucide-react';

export const PhotoUploadCropModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { personalInfo, design } = useSelector((state) => state.cv.currentCV);

  const [rawImage, setRawImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [photoStyle, setPhotoStyle] = useState(personalInfo?.photoStyle || 'circle');
  const [photoSize, setPhotoSize] = useState(design?.photoSize || 'md');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      dispatch(showToast({ message: 'Please upload a JPEG, PNG, or WebP image.', type: 'error' }));
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      dispatch(showToast({ message: 'Image size must be less than 5MB.', type: 'error' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setRawImage(e.target.result);
      setZoom(1);
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

  const handleSaveCrop = () => {
    if (!rawImage && !personalInfo?.photo) {
      onClose();
      return;
    }

    if (rawImage) {
      const img = new Image();
      img.src = rawImage;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 400; // Output high-res cropped resolution
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Center-crop and scale with zoom
        const minDim = Math.min(img.width, img.height);
        const cropDim = minDim / zoom;
        const startX = (img.width - cropDim) / 2;
        const startY = (img.height - cropDim) / 2;

        ctx.drawImage(img, startX, startY, cropDim, cropDim, 0, 0, size, size);
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

        dispatch(
          updatePersonalInfo({
            photo: croppedDataUrl,
            photoStyle,
          })
        );
        dispatch(
          updateDesign({
            showPhoto: true,
            photoSize,
          })
        );
        dispatch(showToast({ message: 'Profile photo updated successfully!', type: 'success' }));
        onClose();
      };
    } else {
      // Just updating style/size
      dispatch(
        updatePersonalInfo({
          photoStyle,
        })
      );
      dispatch(
        updateDesign({
          photoSize,
        })
      );
      dispatch(showToast({ message: 'Photo settings updated', type: 'success' }));
      onClose();
    }
  };

  const handleRemovePhoto = () => {
    dispatch(
      updatePersonalInfo({
        photo: null,
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

  const currentDisplayPhoto = rawImage || personalInfo?.photo;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile Photo Manager"
      subtitle="Upload, crop, resize, and style your professional headshot."
      maxWidth="max-w-md"
    >
      <div className="space-y-6 pt-2">
        {/* Drag and Drop Upload Zone */}
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
            {/* Live Crop & Style Preview Area */}
            <div className="relative flex items-center justify-center p-6 bg-slate-900 rounded-2xl overflow-hidden">
              <div
                className={`relative overflow-hidden border-4 border-indigo-500 shadow-2xl transition-all duration-300 ${
                  photoStyle === 'circle'
                    ? 'rounded-full'
                    : photoStyle === 'rounded'
                    ? 'rounded-3xl'
                    : 'rounded-none'
                }`}
                style={{
                  width: photoSize === 'sm' ? 100 : photoSize === 'lg' ? 160 : photoSize === 'xl' ? 190 : 130,
                  height: photoSize === 'sm' ? 100 : photoSize === 'lg' ? 160 : photoSize === 'xl' ? 190 : 130,
                }}
              >
                <img
                  src={currentDisplayPhoto}
                  alt="Crop Preview"
                  className="w-full h-full object-cover transition-transform origin-center"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 text-xs font-semibold shadow-md text-slate-800 dark:text-white hover:bg-white flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" /> Replace
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5" /> Zoom & Crop
                </span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Shape Style Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Photo Frame Shape
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'circle', label: 'Circle', icon: Circle },
                  { id: 'rounded', label: 'Rounded', icon: Square },
                  { id: 'square', label: 'Square', icon: Square },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPhotoStyle(s.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      photoStyle === s.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <s.icon className="w-3.5 h-3.5" /> {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Size Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Size on Resume
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'sm', label: 'Small' },
                  { id: 'md', label: 'Medium' },
                  { id: 'lg', label: 'Large' },
                  { id: 'xl', label: 'X-Large' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setPhotoSize(sz.id)}
                    className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                      photoSize === sz.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
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

