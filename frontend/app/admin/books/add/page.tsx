"use client";
import React, { useState } from "react";
import Sidebar from "@/components/layout/admin/SidebarAdmin";
import Header from "@/components/layout/admin/HeaderAdmin";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { desc } from "framer-motion/client";
import {toast} from "sonner";
import { ButtonSubmit } from "@/components/button";
import { Button } from "@/components/ui/button";

export default function AddBookPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);

  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState(0);
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [course, setCourse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);
    try {
      const formData = new FormData();
      formData.append("bookTitle", bookTitle);
      formData.append("author", author);
      formData.append("year", String(year));
      formData.append("description", description);
      formData.append("copies", String(copies));
      formData.append("course", course);
      if (image) formData.append("image", image);

      const response = await api.post('/api/books/add', formData, {
        headers: {
          "Content-Type" : "multipart/form-data"
        }
      }
    );

    setSubmitted(false);
    toast.success("Book added successfully!");
    console.log(response.data);

    setBookTitle("");
    setAuthor("");
    setYear(0);
    setDescription("");
    setCopies(0);
    setImage(null);
    setCourse("");
      
    } catch(error) {
      setSubmitted(false);
      console.log("Error submit");
      toast.error("Error adding book");
    }
  }


  return (
    <div className="flex-col md:flex-row flex h-screen overflow-hidden">
      <Header />
      {openSideBar && (
        <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
      )}

      <main className="flex-1 flex flex-col p-6 bg-gray-100 overflow-y-auto gap-4">
        <div className="flex justify-center items-center flex-row w-fit gap-3 mb-6">
          {!openSideBar && (
            <ChevronRight
              className="w-6 h-6 hover:cursor-pointer hidden md:block"
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          )}
          <h1 className="text-2xl font-bold">Add Book</h1>
        </div>

        <form className="bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 md:gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="input_bookTitle">Book Title</Label>
              <Input 
                id="input_bookTitle" 
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="input_bookAuthor">Author</Label>
              <Input 
                id="input_bookAuthor" 
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="input_bookYear">Year</Label>
              <Input 
                id="input_bookYear" 
                type="number" 
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required />
            </div>

            <div className="flex flex-col md:col-span-3 gap-2">
              <Label htmlFor="input_bookDesc">Description</Label>
              <Input 
                id="input_bookDesc" 
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="picture">Book Photo</Label>
              <Input 
                id="picture" 
                type="file"
                accept="image/*"
                onChange={(e) => setImage(((e.target) as HTMLInputElement).files?.[0] || null)}
                />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="copies">Copies</Label>
              <Input 
                id="copies" 
                type="number" 
                value={copies}
                onChange={(e) => setCopies(Number(e.target.value))}
                required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="copies">Course</Label>
              <select 
                aria-label="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                >
                <option value="">All Categories</option>
                <option value="BSIT">BSIT</option>
                <option value="BSED">BSED</option>
                <option value="BEED">BEED</option>
                <option value="BSHM">BSHM</option>
              </select>
            </div>
          </div>

          <div className="mt-10">
            <ButtonSubmit props={{
              submitted: submitted,
              buttonType: 'submit',
              className: 'text-md w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors',
              btnText: 'Submit',
              btnLoadingText: 'Submitting',
            }} />
          </div>
        </form>
      </main>
    </div>
  );
}


