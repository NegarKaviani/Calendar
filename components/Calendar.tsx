'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Interface for storing notes for each date
interface Notes {
  [key: string]: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Notes>({});
  const [currentNote, setCurrentNote] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Load notes from localStorage when the component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(notes).length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Handle saving the note for a specific day
  const handleSaveNote = () => {
    if (selectedDate) {
      const newNotes = { ...notes, [format(selectedDate, 'yyyy-MM-dd')]: currentNote };
      setNotes(newNotes);
      setCurrentNote('');
      setSelectedDate(null);
    }
  };

  // Handle clicking a day in the calendar
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setCurrentNote(notes[format(day, 'yyyy-MM-dd')] || ''); // Load existing note if any
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-semibold mb-4">Calendar</h1>

      {/* Navigation buttons */}
      <div className="mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mr-4 hover:bg-blue-400 transition"
        >
          Previous
        </button>
        <span className="text-2xl">{format(currentDate, 'MMMM yyyy')}</span>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4 hover:bg-blue-400 transition"
        >
          Next
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mt-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="font-semibold">{day}</div>
        ))}

        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className="text-center py-2 px-4 border border-gray-200 rounded-md hover:bg-blue-100 transition cursor-pointer"
            onClick={() => handleDayClick(day)}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>

      {/* Modal for adding notes */}
      {selectedDate && (
        <div className="mt-6 p-4 border rounded-md shadow-md bg-white max-w-xs mx-auto">
          <h2 className="text-xl font-semibold mb-2">
            Notes for {format(selectedDate, 'MMMM dd, yyyy')}
          </h2>
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Write a note..."
            className="w-full p-2 border rounded-md mb-4"
          />
          <button
            onClick={handleSaveNote}
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition"
          >
            Save Note
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
