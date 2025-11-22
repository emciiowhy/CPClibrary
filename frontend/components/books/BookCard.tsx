"use client";

interface BookCardProps {
  bookId: number;
  bookTitle: string;
  bookDescription: string;
  bookImages: string;
  bookAuthor: string;
}

export default function BookCard(props: BookCardProps) {
  return (
    <>
      <div className="hidden md:block">
        <div
          key={props.bookId}
          className="grid grid-cols-4 gap-4 p-2 border-b hover:bg-gray-50"
        >
          <div className="flex items-center">
            <img
              src={props.bookImages}
              alt={props.bookTitle}
              className="w-20 h-28 object-cover rounded"
            />
          </div>
          <div className="flex items-center text-sm font-medium">
            {props.bookTitle}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            {props.bookDescription}
          </div>
          <div className="flex items-center text-sm">{props.bookAuthor}</div>
        </div>
      </div>

      <div className="block md:hidden">
        <div
      key={props.bookId}
      className="flex gap-4 bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow"
    >
      {/* IMAGE LEFT */}
      <img
        src={props.bookImages}
        alt={props.bookTitle}
        className="w-24 h-32 object-cover rounded shadow-sm flex-shrink-0"
      />

      {/* TEXT RIGHT */}
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">
            {props.bookTitle}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {props.bookDescription}
          </p>
        </div>
        <p className="text-xs font-medium text-blue-600">
          by {props.bookAuthor}
        </p>
      </div>
    </div>
      </div>
    </>
  );
}
