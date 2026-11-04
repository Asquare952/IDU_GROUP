import {
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface MediaProps {
  images: File[];
  imagePreviews: string[];
  videos: File[];
  videoPreviews: string[];
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  removeVideo: (index: number) => void;
}

const MediaStep = ({images, imagePreviews, videos, videoPreviews, handleImageChange, handleVideoChange, removeImage, removeVideo}: MediaProps) => {
  return (
    <section className=" flex flex-col gap-3">
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 text-pink-500">
          <div className="bg-pink-50 p-2 rounded-full">
            <ImageIcon size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Property Images</h3>
        </div>

        {/* Image Upload Area */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all">
            <Upload size={24} className="text-slate-400 mb-2" />
            <p className="text-[10px] font-bold text-slate-500 uppercase">
              Click to upload or drag images
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {images.length} image(s) selected • Max 5MB each
            </p>
          </div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Property Videos */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 text-pink-500">
          <div className="bg-pink-50 p-2 rounded-full">
            <ImageIcon size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Property Videos</h3>
        </div>
        {/* Video Upload Area */}
        <div className="relative">
          <input
            type="file"
            multiple
            accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,video/mpeg"
            onChange={handleVideoChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all">
            <Upload size={24} className="text-slate-400 mb-2" />
            <p className="text-[10px] font-bold text-slate-500 uppercase">
              Click to upload or drag videos (MP4, MOV, WebM)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {videos.length} video(s) selected • Max 50MB each
            </p>
          </div>
        </div>
        {videoPreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {videoPreviews.map((preview, index) => {
              const isLargeFile = preview.includes("LARGE_FILE");
              const fileName = videos[index]?.name || `Video ${index + 1}`;
              const fileSize = videos[index]
                ? `${(videos[index].size / 1024 / 1024).toFixed(1)}MB`
                : "";

              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                >
                  {isLargeFile ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 p-2">
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-700 truncate">
                          {fileName}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{fileSize}</p>
                        <p className="text-[10px] text-gray-500 mt-2">
                          Large file
                        </p>
                      </div>
                    </div>
                  ) : (
                    <video
                      src={preview}
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
};

export default MediaStep;
