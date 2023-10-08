import { auth } from "@clerk/nextjs";
import { FileRouter, createUploadthing } from "uploadthing/next";

const f = createUploadthing();

// authentication
const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("unauthorized!");
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({
    image: { maxFileCount: 1, maxFileSize: "4MB" },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(["text", "pdf", "image", "video", "audio"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseVideo: f({ video: { maxFileCount: 1, maxFileSize: "2GB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
