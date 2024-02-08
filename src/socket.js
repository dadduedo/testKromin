import { Server } from 'socket.io';

let io;

const initializeSocketIO = (server) => {
  io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Nuovo client connesso');
    console.log(socket.id)
    
    socket.on("connected", function (userId) {
      socket.userId = userId;
      console.log("socket.userId back end")
      console.log(socket.userId)
    });
    // Evento signup
    socket.on('signup', (message) => {
      console.log('Evento signup:', message);
      // Aggiungi qui le azioni da eseguire quando arriva l'evento 'signup'
    });

    // Evento login
    socket.on('login', (message) => {
      console.log('Evento login:', message);
      // Aggiungi qui le azioni da eseguire quando arriva l'evento 'login'
    });

    // Evento taskInserito
    socket.on('taskInserito', (message) => {
      console.log('Evento taskInserito:', message);
      // Aggiungi qui le azioni da eseguire quando arriva l'evento 'taskInserito'
    });

    // Evento taskCorretto
    socket.on('taskCorretto', (message) => {
      console.log('Evento taskCorretto:', message);
      // Aggiungi qui le azioni da eseguire quando arriva l'evento 'taskCorretto'
    });

    // Evento updateUtente
    socket.on('updateUtente', (message) => {
      console.log('Evento updateUtente:', message);
      // Aggiungi qui le azioni da eseguire quando arriva l'evento 'updateUtente'
    });

    // Evento TaskCancellato
    socket.on('TaskCancellato', (message) => {
      console.log('Evento TaskCancellato:', message);
      // Aggiungi qui le azioni da eseguire quando arriva l'evento 'TaskCancellato'
    });

    // Evento TaskOrdinati
    socket.on('TaskOrdinati', (message) => {
      console.log('Evento TaskOrdinati:', message);
      // Aggiungi qui le azioni da eseguire quando arriva l'evento 'TaskOrdinati'
    });

    // Evento TaskAssegnati
    socket.on('taskAssigned', (message) => {
    });
    // Gestisci la disconnessione di un client
    socket.on('disconnect', () => {
      console.log('Client disconnesso');
    });
  });
};
const getSocketIOInstance = () => {
  return io;
};

export { initializeSocketIO, getSocketIOInstance };

