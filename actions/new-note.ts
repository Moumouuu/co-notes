"use client";
import axios from "axios";
export default async function newNote(router: any) {
  try {
    const res = await axios.post("/api/note", {});
    router.push(`/app/note/${res.data.id}`);
  } catch (e) {
    console.log(`Error while creating new note: ${e}`);
  }
}
