import React from 'react'
import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
import {  useRouter } from "next/router";
import { useAuthContext } from '../hooks/useAuthContext'
import styles from '../styles/signup2.module.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setdisplayName] = useState('')
  const [mobileNumber, setMobileNumber] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [nationalIdError, setNationalIdError] = useState("");
  const {  user} = useAuthContext()
 const {error,signup}=useSignup()
 const router = useRouter();
 
 function handleInputChange(event) {
  const { value } = event.target;
  const regex = /^\d{0,14}$/; // regular expression to allow only numbers and a maximum of 14 digits
  if (regex.test(value)) {
    if (value.length < 14){
      "not enough"
    }
    setNationalID(value);
  }
}
  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password,displayName,mobileNumber,nationalID)
    if (!user) {
      router.push("/login");
       
      } else {
        alert('تم التسجيل بنجاح')
        router.push("/");
          
        
      }
    console.log(signup)
  }
  
  return (
    <div className={styles.container}>
      <h2>تسجيل حساب</h2>
      <form onSubmit={handleSubmit} >
        <label className={styles.label}>
          <span>email:</span>
          <input
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span>password:</span>
          <input
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          <span>National ID:</span>
          <input
            type="text"
            className={styles.input}
            name="nationalID"
            value={nationalID}
            onChange={handleInputChange}
            required
          />
          {nationalIdError && (
            <span style={{ color: "red" }}>{nationalIdError}</span>
          )}
        </label>
        <label className={styles.label}>
          <span>Mobile Number:</span>
          <input
            type="tel"
            className={styles.input}
            name="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          <span>displayName:</span>
          <input
            required
            type="displayName"
            onChange={(e) => setdisplayName(e.target.value)}
            value={displayName}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>sign up</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}