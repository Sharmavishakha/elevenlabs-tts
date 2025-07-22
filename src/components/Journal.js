// "use client";
// import { useState } from "react";

// export default function Journal() {
//   const [entry, setEntry] = useState("");
//   const [savedEntries, setSavedEntries] = useState([]);

//     const handleSave = async () => {
//         if (entry.trim()) {
//             try {
//             const res = await fetch('/api/journal', {
//                 method: 'POST',
//                 headers: {
//                 'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                 user: 'Vishakha', // Or dynamic user from auth if integrated
//                 content: entry,
//                 }),
//             });

//             const data = await res.json();
//             if (data.success) {
//                 setSavedEntries([...savedEntries, { text: entry, date: new Date().toLocaleString() }]);
//                 setEntry("");
//                 alert("Journal saved to DB ✅");
//             } else {
//                 alert("Failed to save journal ❌");
//             }
//             } catch (error) {
//             console.error("Error saving journal:", error);
//             alert("An error occurred while saving.");
//             }
//         }
//     };


//   return (
//     <div style={styles.container}>
//       <h1>📝 Your Private Journal, let your thoughts come out...</h1>
//       <textarea
//         style={styles.textarea}
//         placeholder="Write your thoughts here..."
//         value={entry}
//         onChange={(e) => setEntry(e.target.value)}
//       />
//       <button onClick={handleSave} style={styles.button}>Save Entry</button>

//       <div style={styles.entriesContainer}>
//         {savedEntries.map((item, index) => (
//           <div key={index} style={styles.entryBox}>
//             <p><strong>{item.date}</strong></p>
//             <p>{item.text}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     padding: "2rem",
//     maxWidth: "700px",
//     margin: "auto",
//     textAlign: "center",
//   },
//   textarea: {
//     width: "100%",
//     height: "150px",
//     padding: "10px",
//     fontSize: "16px",
//     marginBottom: "1rem",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//   },
//   button: {
//     padding: "10px 20px",
//     backgroundColor: "#4f46e5",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   entriesContainer: {
//     marginTop: "2rem",
//     textAlign: "left",
//   },
//   entryBox: {
//     backgroundColor: "#5e3f3fff",
//     padding: "1rem",
//     borderRadius: "8px",
//     marginBottom: "1rem",
//   },
// };


"use client";
import { useEffect, useState } from "react";

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [savedEntries, setSavedEntries] = useState([]);

  // Load previous entries from DB
  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/journal");
        const data = await res.json();
        if (data.success) {
          setSavedEntries(
            data.data.map((entry) => ({
              text: entry.content,
              date: new Date(entry.createdAt).toLocaleString(),
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      }
    }

    fetchEntries();
  }, []);

  const handleSave = async () => {
    if (entry.trim()) {
      try {
        const res = await fetch("/api/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: "defaultUser", content: entry }),
        });

        const data = await res.json();
        if (data.success) {
          setSavedEntries([
            { text: entry, date: new Date().toLocaleString() },
            ...savedEntries,
          ]);
          setEntry("");
        }
      } catch (error) {
        console.error("Failed to save entry:", error);
      }
    }
  };
    const handleDelete = async (id) => {
    try {
        const res = await fetch(`/api/journal?id=${id}`, {
        method: "DELETE",
        });

        const result = await res.json();
        if (result.success) {
        // optionally update the UI
        console.log("Deleted successfully");
        } else {
        console.error("Delete failed:", result.error);
        }
    } catch (error) {
        console.error("Error deleting:", error);
    }
    };


  return (
    <div style={styles.container}>
      <h1>📝 Your Private Journal, let your thoughts come out...</h1>
      <textarea
        style={styles.textarea}
        placeholder="Write your thoughts here..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      <button onClick={handleSave} style={styles.button}>Save Entry</button>

      <div style={styles.entriesContainer}>
        {savedEntries.map((item, index) => (
          <div key={index} style={styles.entryBox}>
            <p><strong>{item.date}</strong></p>
            <p>{item.text}</p>
            <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>Delete</button>
          </div>
        ))}

        {/* {savedEntries.map((item) => (
        <div key={item._id} style={styles.entryBox}>
            <p><strong>{new Date(item.createdAt).toLocaleString()}</strong></p>
            <p>{item.content}</p> {/* Use content instead of text if saved that way }
            <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>Delete</button>
        </div>
        ))}  */}

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
    margin: "auto",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  entriesContainer: {
    marginTop: "2rem",
    textAlign: "left",
  },
  entryBox: {
    backgroundColor: "#5e3f3fff",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
};
