import React from 'react'
import { useState } from 'react'
import axios from "axios"

const Register = () => {

    const [ email, setEmail ] = useState("")
     const [ name, setName ] = useState("")
      const [ password, setPassword ] = useState("")

    
    const submitHandler = async (e) => {
        e.preventDefault();
    
        try{
        const response = await axios.post("http://localhost:3000/api/auth/register", 
            {
            name, email, password
        }, {
            withCredentials:true,
        })

        console.log("Register Successfull:", response.data)
    }catch (error) {
            console.error(
                "Registration error:",
                error.response?.data?.message || error.message
            );
        }
    }


  return (
    <div>
        <form onSubmit={submitHandler}>
            <input
                type='email'
                placeholder='enter email'
                value={email}
                onChange={ (e) => setEmail(e.target.value) }
            />
            <input
                type='text'
                placeholder='enter name'
                value={name}
                onChange={ (e) => 
                    setName(e.target.value)
                 }
            />
            <input
                type='text'
                placeholder='enter password'
                value={password}
                onChange={ (e) => 
                    setPassword(e.target.value)
                 }
            />

            <button type="submit">Register</button>
            
        </form>
    </div>
  )
}

export default Register