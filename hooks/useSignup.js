import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useAuthContext } from '../hooks/useAuthContext'




export const useSignup = () => {
    
    
    const [error, setError] = useState(null)
    const [isCancelled, setIsCancelled] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    const signup = (email, password, displayName,mobileNumber,nationalID) => {
        setError(null)
        setIsPending(true)
        createUserWithEmailAndPassword(auth, email, password)

            .then((res) => {

                updateProfile(auth.currentUser, { displayName: displayName })

                console.log(auth.currentUser.email)
                dispatch({ type: 'LOGIN', payload: res.user })
                

                if (!isCancelled) {
                    setIsPending(false)
                    setError(null)
                }
            })
            .catch((err) => {
                if (!isCancelled) {
                    console.log(err.message)
                    setError(err.message)
                    setIsPending(false)
                }
                setError(err.message)
            })
           
    }
    

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])
    return { signup, error, isPending }
}


