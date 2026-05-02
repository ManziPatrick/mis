// src/database/seeders/library.ts
import { LibraryTable } from "../model/libraryTable";

export const seedLibrary = async () => {
  const books = [
    {
      isbn: '978-3-16-148410-0',
      book_name: 'The Great Gatsby',
      quantity: 5,
      author: 'F. Scott Fitzgerald',
      shelf_number: 'A-12',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-452-28423-4',
      book_name: '1984',
      quantity: 8,
      author: 'George Orwell',
      shelf_number: 'B-04',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-7432-7356-5',
      book_name: 'To Kill a Mockingbird',
      quantity: 3,
      author: 'Harper Lee',
      shelf_number: 'C-08',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-141-03614-4',
      book_name: 'Brave New World',
      quantity: 4,
      author: 'Aldous Huxley',
      shelf_number: 'B-05',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-140-44913-6',
      book_name: 'The Odyssey',
      quantity: 6,
      author: 'Homer',
      shelf_number: 'D-01',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-140-44926-6',
      book_name: 'The Iliad',
      quantity: 5,
      author: 'Homer',
      shelf_number: 'D-02',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-140-44919-8',
      book_name: 'Crime and Punishment',
      quantity: 7,
      author: 'Fyodor Dostoevsky',
      shelf_number: 'E-10',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-140-44789-7',
      book_name: 'The Brothers Karamazov',
      quantity: 4,
      author: 'Fyodor Dostoevsky',
      shelf_number: 'E-11',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-142-43723-0',
      book_name: 'Don Quixote',
      quantity: 3,
      author: 'Miguel de Cervantes',
      shelf_number: 'F-01',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-141-43951-8',
      book_name: 'Pride and Prejudice',
      quantity: 10,
      author: 'Jane Austen',
      shelf_number: 'G-05',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-141-43958-7',
      book_name: 'Emma',
      quantity: 6,
      author: 'Jane Austen',
      shelf_number: 'G-06',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-141-43960-0',
      book_name: 'Sense and Sensibility',
      quantity: 5,
      author: 'Jane Austen',
      shelf_number: 'G-07',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-140-43072-1',
      book_name: 'Moby Dick',
      quantity: 4,
      author: 'Herman Melville',
      shelf_number: 'H-01',
      request_status: 'Approved'
    },
    {
      isbn: '978-0-140-43054-7',
      book_name: 'Gulliver\'s Travels',
      quantity: 8,
      author: 'Jonathan Swift',
      shelf_number: 'I-01',
      request_status: 'Approved'
    }
  ];

  for (const book of books) {
    const existingBook = await LibraryTable.findOne({ isbn: book.isbn });
    if (existingBook) {
      continue;
    }
    await LibraryTable.create(book);
    console.log(`Book ${book.book_name} seeded`);
  }
};
