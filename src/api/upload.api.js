import { storage, ref, uploadBytes, getDownloadURL } from '../firebase/storage';

export const uploadApi = {
  // Upload product image or file to Firebase Storage
  async uploadFile(file, path = 'uploads') {
    const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    const metadata = {
      contentType: file.type || (file.name?.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream')
    };
    const snapshot = await uploadBytes(fileRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return {
      name: file.name,
      url: downloadURL,
      fullPath: snapshot.metadata?.fullPath || ''
    };
  }
};
