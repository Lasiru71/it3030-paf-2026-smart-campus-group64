const INITIAL_RESOURCES = [
  {
    id: 1,
    name: "Grand Auditorium",
    category: "L Halls",
    capacity: 450,
    block: "Main Building",
    level: "Level 2",
    status: "Available",
    startTime: "08:00 AM",
    endTime: "08:00 PM",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Advanced Robotics Lab",
    category: "Labs",
    capacity: 25,
    block: "Engineering Block",
    level: "Level 3",
    status: "Maintenance",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Student Lounge B",
    category: "Common",
    capacity: 60,
    block: "Main Building",
    level: "Level 1",
    status: "Available",
    startTime: "07:00 AM",
    endTime: "11:00 PM",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Conference Room 104",
    category: "Meeting",
    capacity: 12,
    block: "Business Block",
    level: "Level 1",
    status: "Maintenance",
    startTime: "08:00 AM",
    endTime: "06:00 PM",
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "Organic Chem Lab",
    category: "Labs",
    capacity: 30,
    block: "Main Building",
    level: "Basement",
    status: "Available",
    startTime: "08:00 AM",
    endTime: "05:00 PM",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d39d998e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Mini Theater 2",
    category: "L Halls",
    capacity: 120,
    block: "Main Building",
    level: "Level 2",
    status: "Available",
    startTime: "08:00 AM",
    endTime: "10:00 PM",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800"
  }
];

const STORAGE_KEY = "campus_resources";

export const facilityService = {
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
      return INITIAL_RESOURCES.map(res => ({
        ...res,
        location: `${res.block}, ${res.level}`
      }));
    }
    return JSON.parse(data).map(res => ({
      ...res,
      location: `${res.block}, ${res.level}`
    }));
  },

  save: (facility) => {
    const facilities = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(INITIAL_RESOURCES));
    let updated;
    
    // Ensure it has a default image if none provided
    const facilityToSave = {
      ...facility,
      image: facility.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    };

    if (facility.id) {
      updated = facilities.map(f => f.id === facility.id ? facilityToSave : f);
    } else {
      updated = [...facilities, { ...facilityToSave, id: Date.now() }];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.map(res => ({
      ...res,
      location: `${res.block}, ${res.level}`
    }));
  },

  delete: (id) => {
    const facilities = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(INITIAL_RESOURCES));
    const updated = facilities.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.map(res => ({
      ...res,
      location: `${res.block}, ${res.level}`
    }));
  }
};
