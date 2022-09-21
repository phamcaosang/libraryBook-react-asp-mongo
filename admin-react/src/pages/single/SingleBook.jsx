import React from 'react'
import './single.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { useState } from 'react'
import { useEffect } from 'react'
import { userRequest } from '../../requestMethods'
import { toast } from 'react-toastify'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";

const SingleBook = () => {
  const path = window.location.pathname.slice(1)
  const [item, setItem] = useState({})
  const [tempImgUrl, setTempImgUrl] = useState(null)
  const [file, setFile] = useState(null)
  useEffect(()=>{
    const getItemData = async()=>{
      const {data} = await userRequest.get(path)
      setItem(data)
    }
    getItemData()
  }, [path])
  
  const handleFile = (file)=>{
    setFile(file)
    setTempImgUrl(URL.createObjectURL(file))
  }

  const handleChange =(e)=>{
    if(e.target.name === "Genres"){
      const myArr = e.target.value.split(",").map(el => el.trim())
      setItem({...item, [e.target.name]: myArr})
    } else{
      setItem({...item, [e.target.name]: e.target.value})
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log(item)
    try{
      await userRequest.put("Books/" + item.Id, item)
      toast.success("Update Successfully", {autoClose: 1500})
    }catch(err){
      console.log(err)
      toast.error("Something went wrong", {autoClose: 1500})
    }
  }

  const updateCover =() => {
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
        console.log(error)
        toast("Update Avatar fail")
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          const updatedItem = {...item, CoverImg: downloadURL}
          try{
            await userRequest.put("Books/" + item.Id, updatedItem)
            setItem(updatedItem)
            setFile(null)
            setTempImgUrl(null)
            toast.success("Update Successfully", {autoClose: 1500})
          }catch(err){
            console.log(err)
            toast.error("Something went wrong", {autoClose: 1500})
          }    
        });
      }
    );
  }
  return (
    <div className='single'>
      <Sidebar />
        <form className="singleContainer" onSubmit={handleSubmit}>
            <Navbar/>
            <div className="top" >
              <div className="left">
                <button className="editButton" type='submit'>Save</button>
                <h1 className="title">Information</h1>
                <div className="item">
                  <div>
                    <label htmlFor="file" style={{cursor: "pointer"}} >
                      <img 
                        
                        src={tempImgUrl ? tempImgUrl : item.CoverImg || ""} 
                        alt="img" 
                        className="itemImg" 
                      />          
                    </label>
                    <input type="file" id="file" style={{display: "none"}} onChange={(e) => handleFile(e.target.files[0])}/>  
                      
                    {tempImgUrl && 
                        <div style={{width: "100px", backgroundColor: "#790", color: "white", padding: "5px 10px", borderRadius: "5px", margin: "20px auto", cursor: "pointer"}}
                          onClick = {updateCover}
                        >
                          Update Cover
                        </div>}     
                  </div>
                  
                  
                  <div className="details">
                    <div className="detailItem">
                      <span className="itemKey">Title:</span>
                      <span className="itemValue">
                        <input required type="text" name= "Title" defaultValue={item.Title} onChange={handleChange}/>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Series:</span>
                      <span className="itemValue">
                        <input required type="text" name= "Series" defaultValue={item.Series} onChange={handleChange}/>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Author:</span>
                      <span className="itemValue">
                        <input required type="text" name= "Author" defaultValue={item.Author} onChange={handleChange}/>    
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Pages:</span>
                      <span className="itemValue">
                        <input required type="text" name= "Pages" defaultValue={item.Pages} onChange={handleChange}/>           
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Price:</span>
                      <span className="itemValue">
                        <input required type="number" name= "Price" defaultValue={item.Price} onChange={handleChange}/>           
                      </span>
                    </div>
                    <div className="detailItem">
                        <span className="itemKey">Status:</span>
                        <span className="itemValue">
                          <select value={item.Status} name="Status" onChange = {handleChange}>
                            <option>Available</option>
                            <option>SoldOut</option>
                          </select>
                        </span>
                      </div>
                  </div>
                </div>
              </div>
              <div className="right">       
                <button className="editButton" type='submit'>Save</button>
                  <div className="details">
                    <div className="detailItem">
                      <span className="itemKey">Language:</span>
                      <span className="itemValue">
                        <input required type="text" name="Language" defaultValue={item.Language} onChange={handleChange}/>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Format:</span>
                      <span className="itemValue">
                        <input required type="text" name="BookFormat" defaultValue={item.BookFormat} onChange={handleChange}/>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Publisher:</span>
                      <span className="itemValue">
                        <input required type="text" name="Publisher" defaultValue={item.Publisher} onChange={handleChange}/>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Publish Date:</span>
                      <span className="itemValue">
                        <input required type="text" name="PublishDate" defaultValue={item.PublishDate} onChange={handleChange}/>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Rating:</span>
                      <span className="itemValue">
                      <input required type="text" name="Rating" defaultValue={item.Rating} onChange={handleChange}/>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Genres:</span>
                      <span className="itemValue">
                        <textarea required name="Genres" cols="70" rows="3" defaultValue={item.Genres?.join(", ")} onChange={handleChange}></textarea>
                      </span>
                    </div>
                  </div>
              </div>
            </div>
            <div className="bottom">
              <button className="editButton" type='submit'>Save</button>
              <span className="itemKey">Description:</span>
              <textarea required name="description" cols="145" rows="10" defaultValue={item.Description} onChange={handleChange}></textarea>
            </div>
        </form>
    </div>
  )
}

export default SingleBook