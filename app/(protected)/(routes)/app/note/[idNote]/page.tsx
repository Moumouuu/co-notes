"use client";
import axios from "axios";
import { useEffect } from "react";

export default function page() {
  // todo : setup it as og:image for sharing

  useEffect(() => {
    generateScreenshot();
  }, []);

  const generateScreenshot = async () => {
    try {
      const res = await axios.post("/api/screenshot", {
        url: "https://www.google.com",
      });
      // todo : save screenshot in db and use it as og:image for sharing
      // todo : remove old screen for this note
    } catch (error) {
      console.error(`Error while generating screenshot: ${error}`);
    }
  };

  return <div>Page de note</div>;
}
