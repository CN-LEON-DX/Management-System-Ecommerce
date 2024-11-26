import { Request, Response } from "express";
import { io as _io } from "../../index"; // Adjust the import path as necessary
import { isObjectIdOrHexString } from "mongoose";
import Chat from "../../models/chats.model";
import User from "../../models/user.model";
import { Socket } from "socket.io";

interface ChatDocument {
  userID: string;
  content: string;
  deleted: boolean;
  inforUser?: { fullName: string };
}

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID: string = res.locals.user.id;
    const fullName: string = res.locals.user.fullName;

    // socket io
    _io.once("connection", (socket: Socket) => {
      socket.on("CLIENT_SEND_MESSAGE", async (content: string) => {
        // save in DB
        const chat = new Chat({
          userID: userID,
          content: content,
        });
        await chat.save();

        // after sending message, return this msg to client
        _io.emit("SERVER_RETURN_MESSAGE", {
          userID: userID,
          fullName: fullName,
          content: content,
        });
      });

      socket.on("CLIENT_SEND_TYPING", async () => {
        socket.broadcast.emit("SERVER_RETURN_TYPING", {
          userID: userID,
          fullName: fullName,
        });
      });

      socket.on("CLIENT_STOP_TYPING", async () => {
        socket.broadcast.emit("SERVER_STOP_TYPING", userID);
      });
    });
    // end socket io

    // get data from the database
    const chats: ChatDocument[] = await Chat.find({ deleted: false });

    // Loop through chats and find user info
    for (const chat of chats) {
      if (isObjectIdOrHexString(chat.userID)) {
        const inforUser = await User.findOne({
          _id: chat.userID,
        }).select("fullName");

        if (inforUser) {
          chat.inforUser = inforUser;
        }
      }
    }

    res.render("client/pages/chat/index", {
      pageTitle: "Chat",
      chats: chats,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};
