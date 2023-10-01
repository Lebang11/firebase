import { upload } from '@testing-library/user-event/dist/upload';
import './App.css';
import { useState, useEffect } from 'react';
import { storage } from './firebase';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import {v4} from 'uuid';

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);

  const imageListRef = ref(storage, 'images/')
  
  const uploadImage = () => {
    if (imageUpload === null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert('Image Uploaded')
    })
  }

  useEffect(() => {
      listAll(imageListRef)
      .then((res) => {
        res.items.forEach((item) => {
          getDownloadURL(item)
          .then((url) => {
            setImageList((prev) => [...prev, url])
          })
        })
      })
  }, []);


  return (
    <div>
      <input type='file' onChange={(event) => {
        setImageUpload(event.target.files[0]);
        }}/>
      <button onClick={uploadImage}>Upload Image</button>
      {imageList.map((url) => {
        return (
          <div>
            <a href={url}>Download</a>
          </div>
      )})}
    </div>
  )
}

export default App;
