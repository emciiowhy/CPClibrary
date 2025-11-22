"use client";
import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ChevronRight, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/useBooks";
import { addBookSchema, AddBookFormData } from "@/lib/validations";

export default function AddBookPage() {
  const [openSideBar, setOpenSideBar] = React.useState(true);
  const { addBook, loading, error, clearError } = useBooks();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    year: '',
    copies: '',
  });
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    const result = addBookSchema.safeParse(formData);
    if (!result.success) {
      result.error.issues.forEach((error) => {
        errors[error.path[0] as string] = error.message;
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await addBook(formData);
      setSuccess(true);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        year: '',
        copies: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Error is handled by the hook
    }
  };

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

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Add New Book</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700">Book added successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 md:gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Book Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.title && (
                  <p className="text-xs text-red-500">{validationErrors.title}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.author && (
                  <p className="text-xs text-red-500">{validationErrors.author}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="isbn">ISBN *</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="10 or 13 digits"
                  required
                />
                {validationErrors.isbn && (
                  <p className="text-xs text-red-500">{validationErrors.isbn}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="text"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023"
                />
                {validationErrors.year && (
                  <p className="text-xs text-red-500">{validationErrors.year}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="copies">Copies</Label>
                <Input
                  id="copies"
                  name="copies"
                  type="number"
                  value={formData.copies}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                />
                {validationErrors.copies && (
                  <p className="text-xs text-red-500">{validationErrors.copies}</p>
                )}
              </div>

              <div className="flex flex-col md:col-span-3 gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional book description"
                />
                {validationErrors.description && (
                  <p className="text-xs text-red-500">{validationErrors.description}</p>
                )}
              </div>
            </div>

            <div className="mt-10">
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding Book...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Add Book
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
