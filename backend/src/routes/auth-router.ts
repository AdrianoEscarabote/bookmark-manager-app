import express from "express"

import logoutRoute from "./auth/logout"
import signInRoute from "./auth/sign-in"
import signUpRoute from "./auth/sign-up"

const authRouter = express.Router()

authRouter.use("/sign-in", signInRoute)
authRouter.use("/sign-up", signUpRoute)
authRouter.use("/logout", logoutRoute)

export default authRouter
