import { messageModel } from "../models/messageModel.js";

class MessageManagerDB {

    async sendMessages() {
        try {
            const messages = await messageModel.find();
            return messages;
        } catch (error) {
            return [];
        }
    }
    async addMessage(Newmessage) {
        const { user, message} = Newmessage;

        if (!user || !message) {
            return 'Error al crear el message';
        }

        const newMessage = {
            user,
            message,
        }

        try {
            const result = await messageModel.create(newMessage);

            return 'Mensage creado correctamente';
        } catch (error) {
            return 'Error al crear el mensage';
        }
    }
}

export default MessageManagerDB