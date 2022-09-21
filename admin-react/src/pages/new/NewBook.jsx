import React from 'react'
import './new.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { toast, ToastContainer } from 'react-toastify';
import { userRequest } from '../../requestMethods';

const NewBook = ({inputs, title}) => {
  const [file, setFile] = useState("")

  const uploadImageAndData = async(data) =>{
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toast("Upload is " + progress + "% done", {autoClose: 1500})
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        toast("Update Avatar fail")
        return error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          try{
            await userRequest.post("Books/", {...data, CoverImg: downloadURL})
            toast("New Book added successfully", {autoClose: 1500})
          } catch(err){
            console.log(err)
            toast("Something went wrong", {autoClose: 1500})
          }
         
        });
      }
    );
  }
  const handleSubmit = async (e)=>{
    e.preventDefault()
    let data = {}
    for (let i = 0; i< e.target.length; i++){
      if(e.target[i].name === "Genres"){
        data = {...data, [e.target[i].name]: e.target[i].value.split(",").map(el => el.trim())}
      } else if (e.target[i].name !== ""){
        data = {...data, [e.target[i].name]: e.target[i].value}
      }
      
    }
    if(data.CoverImg){
      uploadImageAndData(data)
    }else{
      try{
        await userRequest.post("Books/", data)
        toast("New user added", {autoClose: 1500})
      } catch(err){
        console.log(err)
        toast("Something went wrong", {autoClose: 1500})
      }
    }
  }
  return (
    <div className='new'>
      <Sidebar />
        <div class="newContainer" >
            <Navbar/>
            <form onSubmit={handleSubmit}>
              <div className="top">
                <h1>{title}</h1>
              </div>
              <div className="bottom">
                <div className="left">
                  <img 
                    src={file ? URL.createObjectURL(file): "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} 
                    alt="" 
                  />
                  <div className="formInput">
                      <label>Genres</label>
                      <textarea rows = {3}  cols = {50} required name = "Genres" placeholder="Genres" />
                  </div>
                  <div className="formInput">
                      <label>Description</label>
                      <textarea rows = {15}  cols = {50} required name = "Description" placeholder="Description" />
                  </div>
                </div>
                <div className="right">
                  <div className = "subform" >
                    <div className="formInput">
                      <label htmlFor='file'>
                        Image: <DriveFolderUploadOutlinedIcon className='icon'/>
                      </label>
                      <input 
                        type="file" 
                        id='file' style={{display: "none"}}
                        onChange = {e => setFile(e.target.files[0])}
                        name = "CoverImg"
                        />
                    </div>
                    {inputs.map(input => (
                      <div className="formInput" key = {input.id}>
                        <label>{input.label}</label>
                        <input type={input.type} required name = {input.label} placeholder={input.placeholder} />
                      </div>
                    ))}
                    <button type='submit'>Send</button>
                  </div>
                </div>
              </div>
            </form>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default NewBook