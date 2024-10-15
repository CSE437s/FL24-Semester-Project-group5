import * as React from 'react';
import { signOut, useSession } from 'next-auth/react';

const signedOut = () => {


    const res = await signOut({
        callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/furniture`, 
        redirect: true,
      });

      

return (
);
}

export default signOut;
