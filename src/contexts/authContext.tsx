import { IAuthContext } from "@smpm/models/contextModel"
import React from "react"

export const AuthContext = React.createContext<IAuthContext>({ isLogin: false })
