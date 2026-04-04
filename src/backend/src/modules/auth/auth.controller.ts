import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

export async function register(req: Request, res: Response) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    const status = error?.statusCode ?? error?.status;

    if (status === 401) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}
