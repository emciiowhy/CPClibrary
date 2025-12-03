"use client";
import Sidebar from "@/components/layout/admin/SidebarAdmin";
import Header from "@/components/layout/admin/HeaderAdmin";
import React, { useEffect, useState } from "react";
import IntComSciBook from "@/app/admin/books/images/IntComSciBook.jpg";
import DatabaseManagementBook from "@/app/admin/books/images/DatabaseManagementSystem.png";
import IntroductionToTourismAndHospitalityInBC from "@/app/admin/books/images/IntroductionToTourismAndHospitalityinBC.jpg";
import PrincipleOfTeaching1 from "@/app/admin/books/images/PrincipleOfTeaching1.jpg";
import PrincipleOfTeaching2 from "@/app/admin/books/images/PrincipleOfTeaching2.jpg";
import { Search, PanelRightClose } from "lucide-react";
import BookCard from "@/components/books/BookCard";
import { toast } from "sonner";
import api from "@/lib/api";
import { ButtonSubmit } from "@/components/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BookCardModal from "@/components/books/BookCardModal"

interface BookType {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  author: string;
  course: string;
  available: boolean,
  year: string,
  copies: number
}

const Books = () => {
  const [books, setBooks] = React.useState<BookType[]>([]);
  const [openSideBar, setOpenSideBar] = React.useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await api.get('/api/books');

        setBooks(response.data);
      } catch (error) {
        toast.error("Error in getting books");
        console.log("Error getting books " + error);
        return;
      }
    }

    getBooks();
  }, []);

  const [bookLimitMap, setBookLimitMap] = useState(5);

  return (
    <div className="flex-col md:flex-row flex h-screen overflow-hidden">
      <Header />
      {openSideBar && (
        <Sidebar onClickBtnOpenSideBar={() => setOpenSideBar(!openSideBar)} />
      )}

      <main className="flex-1 flex flex-col p-6 bg-gray-100 overflow-y-auto gap-2">
        <div className="flex justify-center items-center flex-row w-fit gap-3 mb-6">
          {!openSideBar && (
            <PanelRightClose
              className="w-6 h-6 hover:cursor-pointer hidden md:block"
              onClick={() => setOpenSideBar(!openSideBar)}
            />
          )}
          <h1 className="text-2xl font-bold">Browse Book</h1>
        </div>

        {/* SEARCH BOOK */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Form */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Course Category Filter */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <label
                htmlFor="course_category"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Course Category
              </label>
              <select
                name="course_category"
                id="course_category"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm min-w-[140px] cursor-pointer hover:bg-gray-100"
              >
                <option value="" className="text-gray-500">
                  All Categories
                </option>
                <option value="BSIT" className="text-gray-900">
                  BSIT
                </option>
                <option value="BSED" className="text-gray-900">
                  BSED
                </option>
                <option value="BEED" className="text-gray-900">
                  BEED
                </option>
                <option value="BSHM" className="text-gray-900">
                  BSHM
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div>
            <h2 className="text-lg font-bold mb-4">
              All Books: {books.length}
            </h2>
          </div>

          <div>
            <div className="w-full">
              <div className="hidden md:block">
                <div className="grid grid-cols-6 gap-4 p-2 border-b font-semibold text-sm text-gray-600">
                  <div>Book</div>
                  <div>Book Title</div>
                  <div>Author</div>
                  <div>Category</div>
                  <div>Release Year</div>
                  <div>Status</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                {books.slice(0, bookLimitMap).map((book) => (
                  <Dialog key={book.id}>
                    <DialogTrigger>
                      <div>
                        <BookCard
                          key={book.id}
                          bookId={book.id}
                          bookTitle={book.title}
                          bookImages={book.cover_image_url}
                          bookAuthor={book.author}
                          bookYear={book.year}
                          bookStatus={book.available}
                          bookCourse={book.course}
                          bookDescription={book.description}
                          bookCopies={book.copies}
                        />
                      </div>
                    </DialogTrigger>

                    <BookCardModal 
                      book_title={book.title}
                      book_cover_url={book.cover_image_url}
                      author={book.author} 
                      year={book.year}
                      description={book.description}
                      copies={book.copies}
                      user="admin"
                    />
                  </Dialog>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Books;


