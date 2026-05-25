import { useRef } from 'react';
import { Plus } from 'lucide-react';

export default function FileUpload({ onUpload, uploading, progress }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  return (
    <div className="file-upload">
      <input ref={inputRef} type="file" onChange={handleChange} hidden />
      <button className="btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? `Uploading... ${progress}%` : <><Plus size={18} /> Upload file</>}
      </button>
      {uploading && <div className="upload-bar"><div className="upload-fill" style={{ width: `${progress}%` }} /></div>}
    </div>
  );
}
