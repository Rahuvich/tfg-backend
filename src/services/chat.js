import { Message, Room } from "../models/chat";
import UserService from "../services/user";
import AdService from "../services/ad";
import util from "util";

class ChatService {
  constructor() {}

  async createMessage(fromId, toId, text, ad) {
    const fromUser = await UserService.getUser(fromId);
    const toUser = await UserService.getUser(toId);

    if (!fromUser || !toUser) throw new Error("Message lacks users");
    if (!text) throw new Error("Message needs text");

    const message = await Message({
      text: text,
      ad: ad ? await AdService.getAd(ad) : undefined,
      adFromModel: ad ? ad.constructor.modelName : undefined,
      sender: fromUser,
      fromModel: fromUser.constructor.modelName,
    }).save();

    let room = await this.getRoom(fromId, toId);

    if (!room) {
      room = await this.createRoom(fromUser, toUser, message);
    } else {
      room.messages.push(message);
      await room.save();
    }

    await room
      .populate("user1")
      .populate("user2")
      .populate("messages")
      .execPopulate();

    await room.user1.populate("valuations.author").execPopulate();
    await room.user2.populate("valuations.author").execPopulate();
    await room.populate("messages.sender messages.ad").execPopulate();

    await Promise.all(
      room.messages.map(async (message) => {
        await message.sender.populate("valuations.author").execPopulate();
        return message;
      })
    );
    return room;
  }

  async getUserRooms(userId) {
    let rooms = await Room.find({
      $or: [{ user1: userId }, { user2: userId }],
    }).populate("user1 user2 messages");

    rooms = await Promise.all(
      rooms.map(async (room) => {
        await room.populate("messages.sender messages.ad").execPopulate();
        await room.user1.populate("valuations.author").execPopulate();
        await room.user2.populate("valuations.author").execPopulate();

        await Promise.all(
          room.messages.map(async (message) => {
            await message.sender.populate("valuations.author").execPopulate();
            return message;
          })
        );

        return room;
      })
    );

    return rooms;
  }

  async getRoom(fromId, toId) {
    return await Room.findOne({
      $or: [
        { user1: fromId, user2: toId },
        { user1: toId, user2: fromId },
      ],
    });
  }

  async createRoom(fromUser, toUser, message) {
    return await Room({
      user1: fromUser,
      user1FromModel: fromUser.constructor.modelName,
      user2: toUser,
      user2FromModel: toUser.constructor.modelName,
      messages: [message],
    }).save();
  }

  async isUserRoom(userId, roomId) {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Room does not exists");

    if (room.user1.toString() === userId || room.user2.toString() === userId) {
      return true;
    }
    return true;
  }
}

export default new ChatService();
