'use client';
import { useState, FormEvent } from 'react';

export default function Home() {
  const [textareaValue, setTextareaValue] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('A name was submitted: ' + textareaValue);
    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: textareaValue }),
      });
    } catch (error) {
      console.error('İstek sırasında bir hata oluştu:', error);
    }
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(event.target.value);
  };

  return (
    <main className="">
      Home
      <form onSubmit={handleSubmit}>
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
