export const users = [
  { id: 1, name: "HariVikram Paturu" },
  { id: 2, name: "Test1 Automation" },
  { id: 3, name: "Harish Rajamani" },
  { id: 4, name: "Nava Davuluri" },
  { id: 5, name: "Anurag Duddu" },
  { id: 6, name: "Saurabh Mahajan" },
  { id: 7, name: "Sonu Kumar" },
  { id: 8, name: "Anurag Vij" },
  { id: 9, name: "Aditi Chansoria" },
  { id: 10, name: "Navneet Soni" },
  { id: 11, name: "Amy Dev" },
  { id: 12, name: "Vivek Nimkarade" },
  { id: 13, name: "Rohan Purohit" },
  { id: 14, name: "Vishwamitra Ganji" },
  { id: 15, name: "praveena Dasamalla" },
  { id: 16, name: "Mallikarjuna Kamarthi" },
  { id: 17, name: "Ramesh Naik Banothu " },
];

export const docExists = (ids = []) => {
  const sumOfIds = ids.reduce((acc, id) => (acc += id), 0);
  return sumOfIds;
};
