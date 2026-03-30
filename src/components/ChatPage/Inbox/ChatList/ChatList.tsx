/* eslint-disable @typescript-eslint/no-explicit-any */
import MessageCard from "../MessageCard/MessageCard";

// Sample data
const chatList: any = [
  {
    id: "1",
    name: "Antonio Banderas",
    message: "You're welcome",
    time: "9:23",
    status: "sent",
  },
  {
    id: "2",
    name: "Annette Black",
    message: "✔ Hello there?",
    time: "8:45",
    status: "read",
  },
  {
    id: "3",
    name: "Bessie Cooper",
    message: "Thanks ray!",
    time: "9:23",
    status: "delivered",
    unreadCount: 2,
  },
  {
    id: "4",
    name: "Darlene Robertson",
    message: "✔ Okay thank you robbert",
    time: "9:23",
    status: "read",
  },
  {
    id: "1",
    name: "Antonio Banderas",
    message: "You're welcome",
    time: "9:23",
    status: "sent",
  },
  {
    id: "2",
    name: "Annette Black",
    message: "✔ Hello there?",
    time: "8:45",
    status: "read",
  },
  {
    id: "3",
    name: "Bessie Cooper",
    message: "Thanks ray!",
    time: "9:23",
    status: "delivered",
    unreadCount: 2,
  },
  {
    id: "4",
    name: "Darlene Robertson",
    message: "✔ Okay thank you robbert",
    time: "9:23",
    status: "read",
  },
  {
    id: "1",
    name: "Antonio Banderas",
    message: "You're welcome",
    time: "9:23",
    status: "sent",
  },
  {
    id: "2",
    name: "Annette Black",
    message: "✔ Hello there?",
    time: "8:45",
    status: "read",
  },
  {
    id: "3",
    name: "Bessie Cooper",
    message: "Thanks ray!",
    time: "9:23",
    status: "delivered",
    unreadCount: 2,
  },
  {
    id: "4",
    name: "Darlene Robertson",
    message: "✔ Okay thank you robbert",
    time: "9:23",
    status: "read",
  },
];

const ChatList = () => {
  return (
    <div className="overflow-hidden">
      <div className="divide-y divide-neutral-50 space-y-2">
        {chatList.map((message:any) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
