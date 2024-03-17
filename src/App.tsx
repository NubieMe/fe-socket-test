import { useEffect, useState } from "react";
import io from "socket.io-client";

interface Users {
    id: string;
    username: string;
    room: string;
}

interface data {
    username: string;
    choice: string;
    room: string;
}

const socket = io("http://localhost:3000");
function App() {
    const [username, setUsername] = useState("");
    const [choice, setChoice] = useState("");
    const [users, setUsers] = useState<Users[]>([]);
    const [index, setIndex] = useState(0);
    const [room, setRoom] = useState("");
    const [data, setData] = useState<data | null>(null);
    // console.log(index);

    socket.on("usersList", (data) => {
        setUsers(data);
    });

    socket.on("receiveChoice", (data) => {
        console.log(data);
        const choiceList = document.createElement("p");
        choiceList.textContent = `${data.username}: ${data.choice}`;
        document.getElementById("choices")!.appendChild(choiceList);
    });

    useEffect(() => {
        if (!username) return;
        if (users.length === 0) return;

        const iUser = JSON.stringify(users.findIndex((val) => val.username === username));
        console.log(iUser);
        setIndex(Number(iUser));
    }, [users]);

    useEffect(() => {
        if (!users[0]) return;
        setRoom(users[index].room);
    }, [index]);

    useEffect(() => {
        setData({
            username,
            choice,
            room,
        });
    }, [room, choice]);

    // const data = {
    //     username,
    //     choice,
    //     room,
    // };
    console.log(data);
    console.log(users);

    const joinRoom = () => {
        socket.emit("joinRoom", { username });
    };

    const sendChoice = () => {
        socket.emit("sendChoice", data);
    };

    return (
        <>
            <input placeholder="username..." onChange={(e) => setUsername(e.target.value)} />
            <input type="submit" value="enter" onClick={joinRoom} />

            <input placeholder="choice..." onChange={(e) => setChoice(e.target.value)} />
            <input type="submit" value="send" onClick={sendChoice} />
            <ul>{users.length === 0 ? null : users?.map((user) => <li key={user.id}>{user.username}</li>)}</ul>
            <div id="choices" style={{ height: "500px" }}></div>
        </>
    );
}

export default App;
