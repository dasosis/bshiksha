import React from 'react';
// import { connectAccount } from '../../../../app/src/scripts/metamask.js';
import { submitPost } from './../../scripts/post.js';
import { useStore } from '../../dataStore.js';

import './Upload.scss';

const Upload = () => {
  const currentAccount = useStore((state) => state.currentAccount);
  const title = React.useRef();
  const desc = React.useRef();
  const value = React.useRef();
  const file = React.useRef();

  const handleUpload = async (e) => {
    e.preventDefault();
    let responseData;
    let success_flag = false;
    try {
      const formData = new FormData();

      formData.append('title', title.current.value);
      formData.append('description', desc.current.value);

      const fileInput = document.getElementById('file');
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        formData.append('file', file);
      } else {
        console.error('No file selected');
        return;
      }
      formData.append('value', value.current.value);

      const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        body: formData,
      });
      responseData = await response.json();
    } catch (error) {
      console.error(error);
    }
    console.log('Fetch Data from Server...', responseData);
    console.log(currentAccount);
    success_flag = await submitPost(currentAccount, responseData);
  };

  return (
    <div className='Upload'>
      <div className='title'>Upload a Post </div>
      <form id='myForm' encType='multipart/form-data' onSubmit={handleUpload}>
        <div className='form-group'>
          <label htmlFor='title'>Title:</label>
          <input type='text' id='title' name='title' ref={title} />
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description:</label>
          <textarea id='description' name='description' ref={desc} rows={4}></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='value'>Enter Value in ETH:</label>
          <input type='number' id='value' step='any' name='value' ref={value} />
        </div>
        <div className='form-group'>
          <label htmlFor='file'>Upload File:</label>
          <input type='file' id='file' name='file' ref={file} />
        </div>
        <div className='form-group'>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
