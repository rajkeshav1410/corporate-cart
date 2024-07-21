import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { throwError } from "../common";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.imageName || file.originalname);
  },
});

const upload = multer({ storage });

export const uploadImage = upload.single("image");
