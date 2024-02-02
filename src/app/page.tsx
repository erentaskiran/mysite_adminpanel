"use client";


import { useState, FormEvent } from "react";

export default function Home() {
  const [textareaValue, setTextareaValue] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [language, setLanguage] = useState("");
  const [details, setDetails] = useState("");


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {

      const formData= new FormData();
      formData.append("content", textareaValue);
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("language", language);
      formData.append("details", details);

      const response = await fetch("/api/create", {
        method: "POST",
        body: formData,
      });

    } catch (error) {
      console.error("İstek sırasında bir hata oluştu:", error);
    }
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(event.target.value);
  };
  

  return (
    <main className="bg-slate-100">
      Home
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="message">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <br />
        <label htmlFor="slug">Slug:</label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value);
          }}
        />
        <br />
        <label htmlFor="message">Language(tr,en etc.):</label>
        <input
          type="text"
          id="language"
          name="language"
          value={language}
          onChange={(event) => {
            setLanguage(event.target.value);
          }}
        />
        <br />
        <label htmlFor="details">Details:</label>
        <input type="text" id="details" name="details" value={details}  onChange={(event) => {
            setDetails(event.target.value);
          }}/>
        <br />
        <textarea
          cols={100}
          rows={10}
          className="border-3 bg-slate-500"
          placeholder="Enter your message here"
          value={textareaValue}
          onChange={handleTextareaChange}
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
