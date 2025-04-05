import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
} from "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Debug environment variables
const env = import.meta.env;
console.log('Environment check:', {
    mode: env.MODE,
    dev: env.DEV,
    prod: env.PROD,
    base: env.BASE_URL
});

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
};

// Debug Firebase config
console.log('Firebase Config Check:', {
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
    storageBucket: !!firebaseConfig.storageBucket,
    messagingSenderId: !!firebaseConfig.messagingSenderId,
    appId: !!firebaseConfig.appId
});

// Validate environment variables
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Missing required Firebase configuration. Available config:', {
        apiKey: !!firebaseConfig.apiKey,
        projectId: !!firebaseConfig.projectId
    });
    document.getElementById('error-message').style.display = 'block';
} else {
    try {
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        console.log("Firebase initialized successfully");

        // Define helper functions
        function sanitize(string) {
          const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "/": "/",
          };
          const reg = /[&<>"'/]/gi;
          return string.replace(reg, (match) => map[match]);
        }

        function linkify(text) {
          var urlRegex =
            /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
          return text.replace(urlRegex, function (url) {
            return `<a href="${url}" class="underline decoration-blue-500 decoration-2" target="_blank">${url}</a>`;
          });
        }

        async function deleteContent(db, id) {
          try {
            await deleteDoc(doc(db, "contents", id));
            console.log("Document deleted successfully:", id);
          } catch (error) {
            console.error("Error deleting document:", error);
            throw error;
          }
        }

        async function postContent(db, content) {
          try {
            const docRef = doc(collection(db, "contents"));
            await setDoc(docRef, {
              id: docRef.id,
              content: sanitize(content),
              createdAt: serverTimestamp(),
            });
            console.log("Document written successfully:", docRef.id);
            return docRef;
          } catch (error) {
            console.error("Error adding document:", error);
            throw error;
          }
        }

        // Define renderSnapshot outside jQuery ready function
        const renderSnapshot = (snapshot) => {
          console.log("Rendering snapshot with", snapshot.size, "documents");
          const contentsDiv = document.getElementById('contents');
          if (!contentsDiv) {
            console.error('Contents div not found');
            return;
          }
          
          contentsDiv.innerHTML = ''; // Clear existing messages
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Document data:", data);
            const { id, content, createdAt } = data;
            
            const messageHtml = `
              <div data-id="${id}" class="bg-white p-6 shadow-sm sm:rounded-md w-full mb-4">
                <div>
                  <div class="text-sm leading-5 text-slate-600 overflow-auto font-medium prose">
                    <pre>${linkify(content)}</pre>
                  </div>
                  <div class="flex items-center justify-between mt-3">
                    <p class="text-sm leading-5 text-slate-500">
                      ${createdAt ? dayjs(createdAt.toDate()).fromNow() : "just now"}
                    </p>
                    <div>
                      <button class="copy-btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 rounded-sm mr-2" 
                              data-id="${id}" 
                              data-content="${content}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-slate-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                      </button>
                      <button class="delete-btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-sm"
                              data-id="${id}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-red-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
            contentsDiv.insertAdjacentHTML('beforeend', messageHtml);
          });

          // Add event listeners for copy and delete buttons
          document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', async function() {
              const content = this.getAttribute('data-content');
              try {
                await navigator.clipboard.writeText(content);
                document.getElementById('toast-copy').classList.add('show');
                setTimeout(() => document.getElementById('toast-copy').classList.remove('show'), 3000);
              } catch (error) {
                console.error("Error copying to clipboard:", error);
              }
            });
          });

          document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async function() {
              const id = this.getAttribute('data-id');
              try {
                await deleteContent(db, id);
                document.querySelector(`div[data-id="${id}"]`).remove();
                document.getElementById('toast-delete').classList.add('show');
                setTimeout(() => document.getElementById('toast-delete').classList.remove('show'), 3000);
              } catch (error) {
                console.error("Error deleting content:", error);
              }
            });
          });
        };

        // Load messages function
        const loadMessages = async () => {
          $("#loader").show();
          try {
            console.log("Loading messages...");
            const first = query(
              collection(db, "contents"),
              orderBy("createdAt", "desc"),
              limit(16)
            );
            const querySnapshot = await getDocs(first);
            console.log("Messages loaded:", querySnapshot.size);
            renderSnapshot(querySnapshot);
          } catch (error) {
            console.error("Error loading messages:", error);
          } finally {
            $("#loader").hide();
          }
        };

        // Load messages immediately after Firebase initialization
        loadMessages();

        // jQuery document ready handler
        $(async function () {
          dayjs.extend(relativeTime);

          // Form submit handler
          $("form").on("submit", async function (e) {
            e.preventDefault();
            const content = $("#content").val();
            if (content !== "") {
              $("#loader").show();
              try {
                const { id } = await postContent(db, content);
                console.log("Saved with id: ", id);
                $("#content").val("");
                await loadMessages();
              } catch (error) {
                console.error("Error posting content:", error);
              } finally {
                $("#loader").hide();
              }
            }
          });
        });
    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
}
