**Integration with React Redux**

-   Install NPM Packages

```

    npm i universal-cookie jose @reduxjs/toolkit react-redux

```


-   Create Store `/app/GlobalRedux/store.js`

```

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';


const rootReducer = combineReducers({
    auth: authReducer,
    //add all your reducers here
  },);

const store = configureStore({
  reducer: rootReducer,
});

export default store;

```

-   Create Provider `/app/GlobalRedux/provider.js`

```

"use client";
import { Provider } from "react-redux";
import store from "@/app/GlobalRedux/store";

export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

```

-   Create Provider `/app/GlobalRedux/slices/authSlice.js`

```

import { createSlice } from '@reduxjs/toolkit';
// import { cookies } from 'next/headers';

import Cookies from "universal-cookie";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    // accessToken: null,
    // refreshToken: null,
    user: null
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      
      // cookies.
      const cookies = new Cookies();
      cookies.remove("token")
      
      state.isAuthenticated = false;
      state.user = null;
      
    },
  },
});

export const { login, logout } = authSlice.actions;


export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;


export default authSlice.reducer;

```



-   Create useAuth hook : `/app/hooks/useAuth.js`


```

"use client";

import React from "react";
import Cookies from "universal-cookie";
import { verifyJwtToken } from "@/app/lib/auth";

// redux-toolit dispatch function to update store states
import { useDispatch, useSelector } from 'react-redux';

// Authentication Reducers functions 
import { login, selectUser, selectIsAuthenticated } from '@/app/GlobalRedux/slices/authSlice';


// To set Global Auth State in redux-toolkit so that components can get global access to the authentication state or any other defined state.
// By doing so, it allows other components to access and utilize the authenticated user's information. This is essential for scenarios like making UI updates based on authentication status, making subsequent API requests, or rendering different content based on user roles.
export function useAuth() {

    // Redux toolkit dispatch function
    const dispatch = useDispatch();

    // select user
    const user = useSelector(selectUser);

    // check user is authenticated or not
    const isAuthenticated = useSelector(selectIsAuthenticated);



    
    // set global state using redux-toolkit
    // const [auth, setAuth] = React.useState(null);

    // Get Verified token from browser secured cookie
    const getVerifiedtoken = async () => {

        // Create a cookies context
        const cookies = new Cookies();
        
        // console.debug("All cookies :: ", cookies.getAll())
        // Get a cookie value by cookie-name
        const token = cookies.get("token") ?? null;
        // console.debug("Token from cookie in useAuth :: ", token)

        // verified saved token
        const verifiedToken = await verifyJwtToken(token);
        
        // console.debug(verifiedToken)
        // set global state (redux-toolkit)
        // setAuth(verifiedToken);

        dispatch(login(verifiedToken));
    };
    

    // get token on loading
    React.useEffect(() => {
        getVerifiedtoken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // return global state values 
    return {
        isAuthenticated : isAuthenticated,
        user : user
    };
}


```


-   verify jwt token : `/app/lib/auth.js`


```
import { jwtVerify } from "jose";
// import jwt from 'jsonwebtoken';

export function getJwtSecretKey() {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT Secret key is not matched");
  }
  return new TextEncoder().encode(secret);
}

export async function verifyJwtToken(token) {
  // console.debug(token);
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload
  } catch (error) {
    // console.error('Token verification failed:');
    console.debug("Token Verification Failed", error)

    // console.debug(error)
    return null;
  }
}

```


-   user store provider (`Update layout.tsx file`)

```

import { Providers } from "@/app/GlobalRedux/provider";

<Providers>
    <AntdRegistry>
    <ConfigProvider theme={theme}>
        <main className="relative z-10 flex flex-1 flex-col">
            <Header />
            {children}
        </main>
    </ConfigProvider>
    </AntdRegistry>
</Providers>
```


-   Nextjs Middleware (`middleware.js` at root folder)

```
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/app/lib/auth";



const AUTH_PAGES = [
  "/login", "/register", "/password/reset", "/"];
const URL_AFTER_LOGIN = "/dashboard"
// const URL_AFTER_LOGOUT = "/"


const isAuthPages = (url) => AUTH_PAGES.some((page) => page.startsWith(url));

export async function middleware(request) {

  const { url, nextUrl, cookies } = request;
  const { value: token } = cookies.get("token") ?? { value: null };
  const hasVerifiedToken = token && (await verifyJwtToken(token));
  const isAuthPageRequested = isAuthPages(nextUrl.pathname);

  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      // console.debug("Token Verification Failed")
      const response = NextResponse.next();
      // const response = NextResponse.redirect(new URL(URL_AFTER_LOGOUT, url));
      response.cookies.delete("token");
      return response;
    }
    // console.debug(url, nextUrl)
    // console.debug(cookies.get("token"))
    // console.debug("Token Verification Passed")
    const response = NextResponse.redirect(new URL(URL_AFTER_LOGIN, url));
    return response;
  }

  if (!hasVerifiedToken) {
    // console.debug("Redirected to login page")
    const searchParams = new URLSearchParams(nextUrl.searchParams);
    searchParams.set("next", nextUrl.pathname);
    const response = NextResponse.redirect(
      new URL(`/login?${searchParams}`, url)
    );
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();

}
// export const config = { 
//   matcher: [

//     // Auth Pages
//     URL_PATTERN?.LOGIN, 
//     URL_PATTERN?.REGISTER,
//     URL_PATTERN?.PASSWORD_RESET,

//     // Protected Pages
//     URL_PATTERN?.DASHBOARD
//   ] 
// };

export const config = { matcher: ["/", "/login", "/register", "/password/reset","/dashboard/:path*", "/scenarios/:path*", "/profile"] };



```


-   Verify Everything is integrated successfully (Create a sperate page and test following code)


```

"use client"

// import { useSelector } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';

// import { selectUser, selectIsAuthenticated } from '@/app/GlobalRedux/slices/authSlice';

import { useAuth } from "@/app/hooks/useAuth";

import { useEffect } from "react";
import axios from 'axios';
import { API_SERVER_URLS } from "@/app/lib/urlpatterns"

import Cookies from "universal-cookie";


// Dashboard Page
export default function Page(){
    // const dispatch = useDispatch();

    // const user = useSelector(selectUser);
    // // const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);
    // const isAuthenticated = useSelector(selectIsAuthenticated);
    // console.debug(isAuthenticated)
    const auth =  useAuth();

    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;

    useEffect(() => {
        axios({
            method: "GET",
            url: `${API_SERVER_URLS.CURRENT_USER}`,
            // data: bodyFormData,
            headers: { 
                "Content-Type": "multipart/form-data" ,
                "Access-Control-Allow-Origin" : process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
                "Authorization" : `Bearer ${token}`
            },
            withCredentials: true
        }).then((res) => {
            console.debug(res)
        }).catch((err) => {
            console.error(err)
        })
    }, [auth])

    return (
        <>
            <div>
                {auth?.isAuthenticated ? (
                    <div>
                    <h2>Welcome, {auth?.user?.username}!</h2>
                    <button>Update Profile</button>
                    </div>
                ) : (
                    <div>
                    <h2>Please log in to access this page.</h2>
                    <button>Log In</button>
                    </div>
                )}
            </div>
        </>
    )
}

```

