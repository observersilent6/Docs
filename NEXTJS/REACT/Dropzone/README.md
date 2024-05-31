**React-DropZone**


"use client"

import { Modal, Button, Tooltip } from "antd" ;
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import scenario_styles from "./DockerModelForm.module.css"
import { MdOutlineCancel } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import axios from 'axios';
import toast from 'react-hot-toast';
import { CATEGORIES_ROUTES } from "@/app/lib/urlpatterns"
import { useRouter } from 'next/navigation';
import { sleep } from "@/app/lib/utils";
import Cookies from "universal-cookie";
import {useDropzone} from 'react-dropzone'
import Image from "next/image"
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { RxCross2 } from "react-icons/rx";


// DropZone Styles
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#9fef00',
    borderStyle: 'dashed',
    backgroundColor: '#1a2332',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'

  };
  
  const focusedStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };

function MyDropzone({icon_path}) {
    const [paths, setPaths] = useState([]);
    const [errors, setErrors] = useState("");
    const removeAll = () => {
        setPaths([])
      }


    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        console.debug(acceptedFiles)
        if(acceptedFiles?.length === 0){
            fileRejections.forEach((file) => {
                file.errors.forEach((err) => {
                  if (err.code === "file-too-large") {
                    setErrors(`Error: ${err.message}`);
                  }
        
                  if (err.code === "file-invalid-type") {
                    setErrors(`Error: ${err.message}`);
                  }
                });
              });
              setPaths([])
        } else{
            setPaths(acceptedFiles.map(file => URL.createObjectURL(file)));
            setErrors("")
        }
        
        
          
        
    }, [setPaths])
    
    const {
        getRootProps,
        getInputProps,
        // fileRejections,
        isFocused,
        isDragAccept,
        isDragReject
      } = useDropzone({accept: {'image/png': ['.png'], 'image/svg+xml' : [".svg"]}, maxFiles:1,multiple: false,maxSize: 2000000,onDrop})
    // const fileRejectionItems = fileRejections.map(({ file, errors  }) => { 
    // return (
    // <li key={file.path}>
    //         {file.path} - {file.size} bytes
    //         <ul>
    //         {errors.map(e => <li key={e.code}>{e.message}</li>)}
    //     </ul>
    
    //     </li>
    // ) 
    // });
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isFocused,
        isDragAccept,
        isDragReject
      ]);
    return (
        <div className="container">
          <div {...getRootProps({style})}>
            <input {...getInputProps()} />
            <p className="text-2xl font-bolder text-green">{`Drop or select Icon`}</p>
          </div>
            <p style={{ color: "red", padding: 5, margin: 0, fontSize: 14 }}>
                {errors}
            </p>
            {paths.map(path =>  
                <div key={path} className=" mt-3 ">
                    <button className="bg-red-500 rounded-3xl text-2xl p-0 -mt-3 relative border-none hover-cursor-pointer z-10" style={{left:"180px", top : "-3px", zIndex: 99999}}><RxCross2 className="text-white p-0 m-0"  style={{width:"30px", height:"17px"}} onClick={removeAll} /></button>
                    <div className="relative" style={{marginTop : "-20px"}}>
                        <Zoom >
                            <Image  src={path} width={"200"} height={"200"} alt={path} className="rounded-3xl border-2 border-solid border-green" />
                        </Zoom>
                    </div>
                    
                </div>
             )}
        </div>
      );
  }


export default function DockerModelForm(){
    const [cateogories, setCategories] = useState([]);
    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmit, setSubmit] = useState(false)
    const name = useRef("");
    const description = useRef("");
    const base_os = useRef("");
    const category = useRef("")
    const tags = useRef("")
    const is_active = useRef(false)
    const is_public = useRef(false)
    const is_paid = useRef(false)
    const price = useRef(0)
    const icon_path = useRef("")
    const url = useRef("")

    const router = useRouter();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const CategoriesList = (token) => {
        axios({
            method: "GET",
            url: `${CATEGORIES_ROUTES.LIST}`,
            headers: { 
                "Content-Type": "multipart/form-data" ,
                "Access-Control-Allow-Origin" : process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
                "Authorization" : `Bearer ${token}`
            },
            withCredentials: true
        }).then((res) => {
            setCategories(res?.data)
        }).catch((err) => {
            setCategories(0)
        })
    }




    useEffect(() => {
        CategoriesList(token)

        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // submitHandler
    const handleOk = async () => {
        console.log(name.current, description.current)
        if (name.current.trim() == "") {
            toast.error("All fields are required");
        } else {
            setSubmit(true);
            try {
                await axios
                .post(`${API_SERVER_URLS?.CREATE_SCENARIO}`, {
                    name: name.current,
                    images: "",
                })
                .then((response) => {
                    toast.success("Successfully created a scenario");
                    sleep(2000).then(() => { 
                        router.push(`${API_SERVER_URLS?.GET_SCENARIO}/${response.data.id}`);
                    }).catch((err) => {
                        console.debug(err)
                    });
                    
                })
                .catch((err) => {
                    console.debug(err);
                });
            } catch (err) {
                toast.error(`Please try again after sometime. Something went wrong.`);
                console.log(err);
            } finally {
                setLoading(false);
                setSubmit(false);
                setIsModalOpen(false);
            }
        }
    };
        
    const handleCancel = () => {
        setIsModalOpen(false);
    };




    return (
        <>
            <Tooltip title="New Docker Component" placement="left">
                <Button  className={scenario_styles.scenario_btn} onClick={showModal}>
                    <FaPlus className=""/>
                </Button>
            </Tooltip>
            <Modal 
                title={<p className="">{"New Docker Component"}</p>}  
                className="modalStyle"
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                okText={  <p className="m-0 p-0 flex justify-center items-center text-lg  font-bold"><IoCreateOutline  className="mr-2"  /> Add  </p>   }
                cancelText={<p className="m-0 p-0 flex justify-center items-center text-lg font-bold"><MdOutlineCancel  className="mr-2"  /> Cancel  </p>}
            >
                <div className="flex flex-col items-start justify-start pt-5 pl-0 pr-0 pb-10  bg-transparent  rounded-xl  z-10">
                    <div className=" m-0  space-y-4 w-full">
                        {/* Docker Name */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Name">
                                {"Name"}
                            </label>
                            <input placeholder="Sample Docker - 1" type="text" className=" custom-form-control w-full py-1 px-2" onChange={(e) => (name.current = e.target.value)} required />
                        </div>
                        
                        {/* Docker Description */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Name">
                                {"Description"}
                            </label>
                            <textarea placeholder="Testing Testing Testing..." rows="5" className=" custom-form-control w-full py-1 px-2" onChange={(e) => (description.current = e.target.value)} ></textarea>
                        </div>

                        {/* Docker Base-OS */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Name">
                                {"Base OS"}
                            </label>
                            <select id="countries" class="custom-form-control w-full py-1 px-2" onChange={(e) => (base_os.current = e.target.value)}>
                                <option selected>Choose a base operating system</option>
                                <option value="windows">Windows</option>
                                <option value="linux">Linux</option>
                            </select>
                        </div>



                        {/* Docker category */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Name">
                                {"Category"}
                            </label>
                            <select id="countries" class="custom-form-control w-full py-1 px-2" onChange={(e) => (category.current = e.target.value)}>
                                <option selected>Choose a category</option>
                                {
                                    cateogories.map((cat, index) => {
                                        return (
                                            <option value={cat.name} key={index}>{cat.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        {/* Docker Tags */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Name">
                                {"Tags"}
                            </label>
                            <input placeholder="Latest" type="text" className=" custom-form-control w-full py-1 px-2" onChange={(e) => (tags.current = e.target.value)} />
                        </div>

                        {/* Docker Is Active */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Name">
                                {"Is Active"}
                            </label>
                            <select id="countries" class="custom-form-control w-full py-1 px-2" onChange={(e) => (is_active.current = e.target.value)}>
                                
                                <option selected value={true}>Active</option>
                                <option value={false}>Disable</option>
                            </select>
                        </div>

                        {/* Docker is Public */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Name">
                                {"Is Public"}
                            </label>
                            <select id="countries" class="custom-form-control w-full py-1 px-2" onChange={(e) => (is_public.current = e.target.value)}>
                                <option value={true} selected>Public</option>
                                <option value={false}>Prive</option>
                            </select>
                        </div>

                        {/* Docker is Paid */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Name">
                                {"Is Piad"}
                            </label>
                            <select id="countries" class="custom-form-control w-full py-1 px-2" onChange={(e) => (is_paid.current = e.target.value)}>
                                <option value={true} selected>Paid</option>
                                <option value={false}>Free</option>
                            </select>
                        </div>

                        {/* Docker Price */}
                        {/* price */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Price">
                                {"Price"}
                            </label>
                            <input placeholder="Latest" type="text" className=" custom-form-control w-full py-1 px-2" onChange={(e) => (price.current = e.target.value)} />
                        </div>

                        {/* Docker Icon */}
                        {/* price */}
                        <div className="relative pr-6" >
                            <label className="block text-blue-gray text-sm font-medium mb-2" htmlFor="Docker Icon">
                                {"Icon"}
                            </label>
                            <MyDropzone icon_path={icon_path}/>
                        </div>
                        



                    </div>
                </div>
                
        </Modal>
        </>
    )
}