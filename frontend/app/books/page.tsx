"use client";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { button, data, div, image } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import IntComSciBook from "./images/IntComSciBook.jpg";
import DatabaseManagementBook from "./images/DatabaseManagementSystem.png";
import IntroductionToTourismAndHospitalityInBC from "./images/IntroductionToTourismAndHospitalityinBC.jpg";
import { ChevronRight, Search } from "lucide-react";

interface BookType {
  id: number;
  title: string;
  description: string;
  images: string;
  author: string;
  courseCategory: string;
}

const page = () => {
  const [books, setBooks] = React.useState<BookType[]>([]);
  const [openSideBar, setOpenSideBar] = React.useState(true);

  useEffect(() => {
    setBooks([
      {
        id: 1,
        title: "Introduction to Computer Science",
        description: "A foundational book on computer science principles.",
        images: IntComSciBook.src,
        author: "Jerson Jay",
        courseCategory: "BSIT",
      },
      {
        id: 2,
        title: "Database Management Systems",
        description: "Comprehensive guide to database systems and SQL.",
        images: DatabaseManagementBook.src,
        author: "Cris Dyford",
        courseCategory: "BSIT",
      },
      {
        id: 3,
        title: "Introduction to Tourism and Hospitality in BC",
        description:
          "This is a free open-textbook covering tourism & hospitality fundamentals.",
        images: IntroductionToTourismAndHospitalityInBC.src,
        author: "JBRO",
        courseCategory: "BSHM",
      },
      {
        id: 4,
        title: "Introduction to Tourism and Hospitality in BC",
        description:
          "This is a free open-textbook covering tourism & hospitality fundamentals.",
        images: IntroductionToTourismAndHospitalityInBC.src,
        author: "JBRO",
        courseCategory: "BSHM",
      },
      {
        id: 5,
        title: "Introduction to Tourism and Hospitality in BC",
        description:
          "This is a free open-textbook covering tourism & hospitality fundamentals.",
        images: IntroductionToTourismAndHospitalityInBC.src,
        author: "JBRO",
        courseCategory: "BSHM",
      },
    ]);
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
              <ChevronRight
                className="w-6 h-6 hover:cursor-pointer hidden md:block"
                onClick={() => setOpenSideBar(!openSideBar)}
              />
            )}
            <h1 className="text-2xl font-bold">Books</h1>
          </div>

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
              <label htmlFor="course_category" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Course Category
              </label>
              <select 
                name="course_category" 
                id="course_category"
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm min-w-[140px] cursor-pointer hover:bg-gray-100"
              >
                <option value="" className="text-gray-500">All Categories</option>
                <option value="BSIT" className="text-gray-900">BSIT</option>
                <option value="BSED" className="text-gray-900">BSED</option>
                <option value="BEED" className="text-gray-900">BEED</option>
                <option value="BSHM" className="text-gray-900">BSHM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div>
            <h2 className="text-lg font-bold mb-4">Books Collections: {books.length}</h2>

          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="w-full">
              <div className="grid grid-cols-4 gap-4 p-2 border-b font-semibold text-sm text-gray-600">
                <div>Book</div>
                <div>Book Title</div>
                <div>Description</div>
                <div>Author</div>
              </div>
              
              <div className="h-full overflow-y-auto">
                {books.slice(0, bookLimitMap).map((book) => (
                  <div
                    key={book.id}
                    className="grid grid-cols-4 gap-4 p-2 border-b hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <img
                        src={book.images}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      {book.title}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      {book.description}
                    </div>
                    <div className="flex items-center text-sm">{book.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-center">
                      <img
                        src={book.images}
                        alt={book.title}
                        className="w-24 h-32 object-cover rounded shadow-sm"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {book.description}
                      </p>
                      <p className="text-xs font-medium text-blue-600">
                        by {book.author}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
