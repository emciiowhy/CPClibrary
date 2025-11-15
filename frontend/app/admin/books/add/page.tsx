"use client";
import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddBookPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);
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

        <form className="bg-white p-6 rounded-lg shadow">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 md:gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="input_bookTitle">Book Title</Label>
              <Input id="input_bookTitle" type="text" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="input_bookAuthor">Author</Label>
              <Input id="input_bookAuthor" type="text" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="input_bookYear">Year</Label>
              <Input id="input_bookYear" type="text" required />
            </div>

            <div className="flex flex-col md:col-span-3 gap-2">
              <Label htmlFor="input_bookDesc">Description</Label>
              <Input id="input_bookDesc" type="text" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="picture">Book Photo</Label>
              <Input id="picture" type="file" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="copies">Copies</Label>
              <Input id="copies" type="number" required />
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Add Book
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}



