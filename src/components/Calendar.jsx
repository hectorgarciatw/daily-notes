import React, { useState, useEffect, useRef } from 'react';

const DatePicker = () => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState('');
  const [datePickerFormat, setDatePickerFormat] = useState('M d, Y');
  const [datePickerMonth, setDatePickerMonth] = useState('');
  const [datePickerYear, setDatePickerYear] = useState('');
  const [datePickerDay, setDatePickerDay] = useState('');
  const [datePickerDaysInMonth, setDatePickerDaysInMonth] = useState([]);
  const [datePickerBlankDaysInMonth, setDatePickerBlankDaysInMonth] = useState([]);
  const datePickerMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const datePickerDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const datePickerInputRef = useRef(null);

  const datePickerDayClicked = (day) => {
    const selectedDate = new Date(datePickerYear, datePickerMonth, day);
    setDatePickerDay(day);
    setDatePickerValue(datePickerFormatDate(selectedDate));
    datePickerIsSelectedDate(day);
    setDatePickerOpen(false);
  };

  const datePickerPreviousMonth = () => {
    if (datePickerMonth === 0) {
      setDatePickerYear(datePickerYear - 1);
      setDatePickerMonth(11);
    } else {
      setDatePickerMonth(datePickerMonth - 1);
    }
    datePickerCalculateDays();
  };

  const datePickerNextMonth = () => {
    if (datePickerMonth === 11) {
      setDatePickerMonth(0);
      setDatePickerYear(datePickerYear + 1);
    } else {
      setDatePickerMonth(datePickerMonth + 1);
    }
    datePickerCalculateDays();
  };

  const datePickerIsSelectedDate = (day) => {
    const d = new Date(datePickerYear, datePickerMonth, day);
    return datePickerValue === datePickerFormatDate(d);
  };

  const datePickerIsToday = (day) => {
    const today = new Date();
    const d = new Date(datePickerYear, datePickerMonth, day);
    return today.toDateString() === d.toDateString();
  };

  const datePickerCalculateDays = () => {
    const daysInMonth = new Date(datePickerYear, datePickerMonth + 1, 0).getDate();
    const dayOfWeek = new Date(datePickerYear, datePickerMonth).getDay();
    const blankdaysArray = Array.from({ length: dayOfWeek }, (_, i) => i + 1);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    setDatePickerBlankDaysInMonth(blankdaysArray);
    setDatePickerDaysInMonth(daysArray);
  };

  const datePickerFormatDate = (date) => {
    const formattedDay = datePickerDays[date.getDay()];
    const formattedDate = ('0' + date.getDate()).slice(-2);
    const formattedMonth = datePickerMonthNames[date.getMonth()];
    const formattedMonthShortName = datePickerMonthNames[date.getMonth()].substring(0, 3);
    const formattedMonthInNumber = ('0' + (date.getMonth() + 1)).slice(-2);
    const formattedYear = date.getFullYear();

    if (datePickerFormat === 'M d, Y') {
      return `${formattedMonthShortName} ${formattedDate}, ${formattedYear}`;
    }
    if (datePickerFormat === 'MM-DD-YYYY') {
      return `${formattedMonthInNumber}-${formattedDate}-${formattedYear}`;
    }
    if (datePickerFormat === 'DD-MM-YYYY') {
      return `${formattedDate}-${formattedMonthInNumber}-${formattedYear}`;
    }
    if (datePickerFormat === 'YYYY-MM-DD') {
      return `${formattedYear}-${formattedMonthInNumber}-${formattedDate}`;
    }
    if (datePickerFormat === 'D d M, Y') {
      return `${formattedDay} ${formattedDate} ${formattedMonthShortName} ${formattedYear}`;
    }
    return `${formattedMonth} ${formattedDate}, ${formattedYear}`;
  };

  useEffect(() => {
    let currentDate = new Date();
    if (datePickerValue) {
      currentDate = new Date(Date.parse(datePickerValue));
    }
    setDatePickerMonth(currentDate.getMonth());
    setDatePickerYear(currentDate.getFullYear());
    setDatePickerDay(currentDate.getDay());
    setDatePickerValue(datePickerFormatDate(currentDate));
    datePickerCalculateDays();
  }, []);

  return (
    <div className="container px-4 py-2 mx-auto md:py-10">
      <div className="w-full mb-5">
        <label htmlFor="datepicker" className="block mb-1 text-sm font-medium text-neutral-500">Select Date</label>
        <div className="relative w-[17rem]">
          <input
            ref={datePickerInputRef}
            type="text"
            onClick={() => setDatePickerOpen(!datePickerOpen)}
            value={datePickerValue}
            onKeyDown={(e) => e.key === 'Escape' && setDatePickerOpen(false)}
            className="flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-md text-neutral-600 border-neutral-300 ring-offset-background placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Select date"
            readOnly
          />
          <div
            onClick={() => {
              setDatePickerOpen(!datePickerOpen);
              if (datePickerOpen) {
                datePickerInputRef.current.focus();
              }
            }}
            className="absolute top-0 right-0 px-3 py-2 cursor-pointer text-neutral-400 hover:text-neutral-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {datePickerOpen && (
            <div
              className="absolute top-0 left-0 max-w-lg p-4 mt-12 antialiased bg-white border rounded-lg shadow w-[17rem] border-neutral-200/70"
              onClick={() => setDatePickerOpen(false)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-lg font-bold text-gray-800">{datePickerMonthNames[datePickerMonth]}</span>
                  <span className="ml-1 text-lg font-normal text-gray-600">{datePickerYear}</span>
                </div>
                <div>
                  <button
                    onClick={datePickerPreviousMonth}
                    type="button"
                    className="inline-flex p-1 transition duration-100 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline hover:bg-gray-100"
                  >
                    <svg className="inline-flex w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={datePickerNextMonth}
                    type="button"
                    className="inline-flex p-1 transition duration-100 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline hover:bg-gray-100"
                  >
                    <svg className="inline-flex w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 mb-3">
                {datePickerDays.map((day, index) => (
                  <div key={index} className="px-0.5">
                    <div className="text-xs font-medium text-center text-gray-800">{day}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {datePickerBlankDaysInMonth.map((blankDay, index) => (
                  <div key={index} className="p-1 text-sm text-center border border-transparent"></div>
                ))}
                {datePickerDaysInMonth.map((day, dayIndex) => (
                  <div key={dayIndex} className="px-0.5 mb-1 aspect-square">
                    <div
                      onClick={() => datePickerDayClicked(day)}
                      className={`flex items-center justify-center text-sm leading-none text-center rounded-full cursor-pointer h-7 w-7 ${
                        datePickerIsToday(day)
                          ? 'bg-neutral-200'
                          : datePickerIsSelectedDate(day)
                          ? 'bg-neutral-800 text-white hover:bg-opacity-75'
                          : 'text-gray-600 hover:bg-neutral-200'
                      }`}
                    >
                      {day}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
