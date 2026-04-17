import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

/* 🔐 FIREBASE AUTH */
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";


/* =========================
FIREBASE CONFIG
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyBx_q2FB94zDFo6VcUm4CWTgG7XfK-GESE",
  authDomain: "game-world-3cd39.firebaseapp.com",
  databaseURL: "https://game-world-3cd39-default-rtdb.firebaseio.com",
  projectId: "game-world-3cd39",
  storageBucket: "game-world-3cd39.firebasestorage.app",
  messagingSenderId: "873634849624",
  appId: "1:873634849624:web:c65f3c08e0d1f0bbd4bb2d"
};


/* =========================
INIT FIREBASE
========================= */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const chatRef = ref(db, "chat");
const provider = new GoogleAuthProvider();


/* =========================
ESTADO DO USUÁRIO
========================= */
let currentUser = null;


/* =========================
LOGIN GOOGLE REAL
========================= */
function loginGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      currentUser = result.user;
      console.log("Logado:", currentUser.displayName);
    })
    .catch((error) => {
      console.error("Erro login:", error);
    });
}


/* =========================
MONITORA LOGIN
========================= */
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("Usuário ativo:", user.displayName);
  } else {
    currentUser = null;
  }
});


/* =========================
ENVIAR MENSAGEM
========================= */
function sendMessage() {
  const input = document.getElementById("messageInput");

  if (!currentUser) {
    alert("Você precisa fazer login primeiro!");
    return;
  }

  if (!input.value.trim()) return;

  push(chatRef, {
    nome: currentUser.displayName,
    foto: currentUser.photoURL,
    texto: input.value,
    hora: new Date().toLocaleTimeString()
  });

  input.value = "";
}


/* =========================
CARREGAR CHAT
========================= */
function loadMessages() {
  const chatBox = document.getElementById("chatBox");

  onValue(chatRef, (snapshot) => {
    chatBox.innerHTML = "";

    snapshot.forEach((child) => {
      const msg = child.val();

      const div = document.createElement("div");
      div.classList.add("msg");

      div.innerHTML = `
        <img src="${msg.foto || 'https://i.pravatar.cc/40'}">
        <div class="msg-content">
          <div class="msg-nome">${msg.nome}</div>
          <div class="msg-texto">${msg.texto}</div>
          <div class="msg-hora">${msg.hora}</div>
        </div>
      `;

      chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  });
}


/* =========================
EVENTOS
========================= */
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("loginBtn").addEventListener("click", loginGoogle);


/* START CHAT */
loadMessages();