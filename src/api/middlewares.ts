import { 
    authenticate,
  } from "@medusajs/medusa"
  import type { 
    MedusaNextFunction, 
    MedusaRequest, 
    MedusaResponse,
    MiddlewaresConfig, 
    UserService,
  } from "@medusajs/medusa"
  import * as cors from 'cors' // ⚠️ Make sure you import it like this
  import { parseCorsOrigins } from 'medusa-core-utils'
import { User } from "../models/user"


  const registerUserAuthenticated = async (
    req: MedusaRequest, 
    res: MedusaResponse, 
    next: MedusaNextFunction
  ) => {
    let authenticatedUser: User | null = null
  
    if (req.user && req.user.userId) {
      const userService = 
        req.scope.resolve("userService") as UserService
      authenticatedUser = await userService.retrieve(req.user.userId)
    }
  
    req.scope.register({
      authenticatedUser: {
        resolve: () => authenticatedUser,
       },
     })
  
    next()
  }
  
  export const config: MiddlewaresConfig = {
    routes: [
      {

        matcher: /^\/admin\/(?!auth|batch-jobs|analytics-config|users\/reset-password|users\/password-token|invites\/accept).*/,
        middlewares: [
          cors.default({ credentials: true, origin: parseCorsOrigins(process.env.ADMIN_CORS ?? '') }),
          authenticate(),
          registerUserAuthenticated
        ],
        // method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      }   
      
    ],
  }
  
