import React, { useState } from 'react'
import  axios  from 'axios'


const FIleUpload = () => {
    const [user, setUser] = useState({
        name: "",
        file: null
    })

    const handleInput = (e) => {
        // console.log(e.target.name + ', ' + e.target.value)
        const { name, value } = e.target
        setUser({
            // ...user,
            [name]: value
            
        })

    }

    const imageHandle = (e) => {
        const imageFile = e.target.files[0]
        console.log(e.target.files[0])
        setUser({
            ...user,
            image: imageFile
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', formData.name)
        formData.append('image', formData.image)

        try {
            await axios.post('http://localhost:3300/api/upload',
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                });

            console.log('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image', error);
        }
    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <input type='text' className='name' id='name' value={user.name} onChange={handleInput} />
                <input className='upFile' id='upFile' type="file" accept='image/*' onChange={imageHandle} />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default FIleUpload