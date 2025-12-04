"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Plus, X } from "lucide-react";

interface Holiday {
  date: string;
  name: string;
  type: "government" | "religious" | "cultural";
}

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  time: string;
  type: "meeting" | "event" | "reminder";
  description?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  holiday?: Holiday;
  events?: CalendarEvent[];
}

export function CalendarHolidays() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    type: "meeting" as "meeting" | "event" | "reminder",
    description: ""
  });

  // Tripura Government Holidays 2025 (sample list)
  const tripuraHolidays2025: Holiday[] = [
    { date: "2025-01-26", name: "Republic Day", type: "government" },
    { date: "2025-01-28", name: "Birthday of Maharani Tulsabati", type: "cultural" },
    { date: "2025-02-12", name: "Mahashivratri", type: "religious" },
    { date: "2025-03-14", name: "Holi", type: "religious" },
    { date: "2025-03-31", name: "Utkram Durga Puja", type: "cultural" },
    { date: "2025-04-14", name: "Bengali New Year", type: "cultural" },
    { date: "2025-04-18", name: "Good Friday", type: "religious" },
    { date: "2025-05-01", name: "May Day", type: "government" },
    { date: "2025-08-15", name: "Independence Day", type: "government" },
    { date: "2025-08-16", name: "Birthday of Bir Bikram Kishore", type: "cultural" },
    { date: "2025-10-02", name: "Gandhi Jayanti", type: "government" },
    { date: "2025-10-20", name: "Durga Puja - Maha Saptami", type: "religious" },
    { date: "2025-10-21", name: "Durga Puja - Maha Ashtami", type: "religious" },
    { date: "2025-10-22", name: "Durga Puja - Maha Navami", type: "religious" },
    { date: "2025-10-23", name: "Durga Puja - Vijaya Dashami", type: "religious" },
    { date: "2025-11-01", name: "Kali Puja", type: "religious" },
    { date: "2025-11-12", name: "Diwali", type: "religious" },
    { date: "2025-12-25", name: "Christmas", type: "religious" },
  ];

  useEffect(() => {
    // Filter holidays for current year
    const currentYear = new Date().getFullYear();
    const filteredHolidays = tripuraHolidays2025.filter(holiday => 
      holiday.date.startsWith(currentYear.toString())
    );
    setHolidays(filteredHolidays);
    generateCalendarDays(selectedMonth, filteredHolidays, events);
  }, [selectedMonth, events]);

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title || !newEvent.time) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: dateStr,
      title: newEvent.title,
      time: newEvent.time,
      type: newEvent.type,
      description: newEvent.description
    };

    setEvents([...events, event]);
    setNewEvent({ title: "", time: "", type: "meeting", description: "" });
    setIsAddEventOpen(false);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleDayClick = (day: CalendarDay, month: Date) => {
    if (day.isCurrentMonth) {
      const date = new Date(month.getFullYear(), month.getMonth(), day.date);
      setSelectedDate(date);
      setIsAddEventOpen(true);
    }
  };

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateCalendarDays = (month: Date, holidayList: Holiday[], eventList: CalendarEvent[]) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const prevLastDay = new Date(year, monthIndex, 0);
    
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevLastDay.getDate();

    const days: CalendarDay[] = [];
    const today = new Date();

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const holiday = holidayList.find(h => h.date === dateStr);
      const dayEvents = eventList.filter(e => e.date === dateStr);
      const isToday = 
        i === today.getDate() && 
        monthIndex === today.getMonth() && 
        year === today.getFullYear();

      days.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        holiday,
        events: dayEvents,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    setCalendarDays(days);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getHolidayTypeColor = (type: Holiday["type"]) => {
    switch (type) {
      case "government": return "bg-blue-500";
      case "religious": return "bg-orange-500";
      case "cultural": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getUpcomingHolidays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return holidays
      .filter(holiday => new Date(holiday.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  return (
    <div className="space-y-4">
      {/* Current Date and Time */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(currentDate)}
            </div>
            <div className="text-sm text-gray-600">
              {formatDate(currentDate)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              Agartala, Tripura, India
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
          </CardTitle>
          <CardDescription>
            Tripura Government Holidays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-500">
              {weekDays.map(day => (
                <div key={day} className="text-center p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleDayClick(day, selectedMonth)}
                  className={`
                    relative p-2 text-center rounded-md transition-colors cursor-pointer min-h-[60px]
                    ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${day.isToday ? 'bg-blue-100 font-bold' : 'hover:bg-gray-50'}
                  `}
                >
                  <div className="text-sm">{day.date}</div>
                  {day.holiday && (
                    <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${getHolidayTypeColor(day.holiday.type)}`} />
                  )}
                  {day.events && day.events.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {day.events.slice(0, 2).map((event, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            event.type === 'meeting' ? 'bg-blue-500' :
                            event.type === 'event' ? 'bg-green-500' : 'bg-purple-500'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Government</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span>Religious</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Cultural</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Meeting</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Event</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Reminder</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>
              {selectedDate && `Add event for ${selectedDate.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value: "meeting" | "event" | "reminder") => 
                  setNewEvent({ ...newEvent, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Add event description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upcoming Holidays */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Holidays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getUpcomingHolidays().length > 0 ? (
              getUpcomingHolidays().map((holiday, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{holiday.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(holiday.date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${getHolidayTypeColor(holiday.type)}`}
                  >
                    {holiday.type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">
                No upcoming holidays in the current year
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.length > 0 ? (
              events
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          event.type === 'meeting' ? 'bg-blue-500' :
                          event.type === 'event' ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <div className="font-medium text-sm">{event.title}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })} at {event.time}
                        {event.description && ` - ${event.description}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-sm text-gray-500">
                No events scheduled. Click on any date to add an event.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
