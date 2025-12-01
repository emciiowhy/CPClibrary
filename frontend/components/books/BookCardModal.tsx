import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { button } from "framer-motion/client";
// import { DialogDescription } from "@radix-ui/react-dialog";

interface BookDialogProps {
  book_title: string;
  book_cover_url: string;
  author: string;
  year: string;
  description: string;
  copies: number;
  user: string;
  onClickBtn?: () => void;
}

export default function BookDialog({ book_title, book_cover_url, author, year, description, copies, user, onClickBtn }: BookDialogProps) {
  return (
    <DialogContent className="max-w-lg p-6 rounded-2xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{book_title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
        <img
          src={book_cover_url}
          alt={book_title}
          className="w-full h-64 object-cover rounded-lg border shadow"
        />

        <div className="flex flex-col gap-1">
          <p className="text-sm"><strong>Author:</strong> {author}</p>
          <p className="text-sm"><strong>Release Date:</strong> {year}</p>
          <p className="text-sm"><strong>Copies:</strong> {copies}</p>
        </div>

        {/* <p className="text-sm text-gray-700 leading-relaxed">
          {description}
        </p> */}
      </div>

      <DialogFooter className="flex justify-end gap-3 mt-4">
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
        {
          user === "student" &&
          <Button 
            className={`bg-indigo-800 hover:bg-blue-900 text-white`}
            onClick={onClickBtn}
            disabled={copies <= 0}
          >
            {copies <= 0 ? "Out of stock" : "Borrow Book"}
          </Button>
        }
      </DialogFooter>
    </DialogContent>
  );
}
