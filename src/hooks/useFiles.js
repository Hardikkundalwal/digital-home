import { useState, useEffect } from 'react';
import {
  ref as storageRef, uploadBytesResumable, getDownloadURL, listAll, deleteObject
} from 'firebase/storage';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useAuth } from './useAuth';

export function useFiles(roomId) {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !roomId) return;
    const ref = collection(db, 'users', user.uid, 'rooms', roomId, 'files');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = [];
        snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
        setFiles(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('useFiles error:', err);
        setLoading(false);
        setError(err);
      }
    );
    return unsub;
  }, [user, roomId]);

  const uploadFile = async (file, folderId = null) => {
    if (!user || !roomId || !file) return;
    setUploading(true);
    setUploadProgress(0);

    const path = `users/${user.uid}/rooms/${roomId}/${file.name}`;
    const fileRef = storageRef(storage, path);
    const task = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        (err) => { setUploading(false); reject(err); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, 'users', user.uid, 'rooms', roomId, 'files'), {
            name: file.name,
            url,
            size: file.size,
            type: file.type,
            folderId,
            createdAt: serverTimestamp()
          });
          setUploading(false);
          setUploadProgress(0);
          resolve(url);
        }
      );
    });
  };

  const deleteFile = async (fileId, fileName) => {
    const path = `users/${user.uid}/rooms/${roomId}/${fileName}`;
    try {
      await deleteObject(storageRef(storage, path));
    } catch (err) {
      console.warn('Failed to delete storage file:', path, err);
    }
    await deleteDoc(doc(db, 'users', user.uid, 'rooms', roomId, 'files', fileId));
  };

  return { files, loading, error, uploading, uploadProgress, uploadFile, deleteFile };
}
