/*
 *
 *
 ------->Title: uploadthing handler
 ->Description: this file is to create uploadthing components
 ------>Author: Shawon Talukder
 -------->Date: 10/08/2023
 *
 *
 */

import { generateComponents } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
