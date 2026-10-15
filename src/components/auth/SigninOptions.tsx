import React from 'react'
import AuthUsingGoogle from './AuthUsingGoogle'
import AuthUsingFacebook from './AuthUsingFacebook'
import AuthUsingApple from './AuthUsingApple'

export default function SigninOptions() {
    return (
        <div className='flex gap-5'>
            <AuthUsingGoogle />
            {/* <AuthUsingFacebook />
            <AuthUsingApple /> */}
        </div>
    )
}
