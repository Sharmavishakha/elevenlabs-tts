'use client'
import { useEffect, useState } from 'react'

export default function WallOfPositivity() {
  const [entries, setEntries] = useState([])
  const [quote, setQuote] = useState('')
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  // Fetch from MongoDB
  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/positive-posts')
      const data = await res.json()
      if (data.success) {
        setEntries(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])


// const handleSubmit = async (e) => {
//   e.preventDefault()

//   // Show alert if both quote and image are missing
//   if (!quote && !image) {
//     alert('Please add a positive thought or an image before posting!')
//     return
//   }

//   // Show alert if image is uploaded but no quote
//   if (image && !quote) {
//     alert('Please enter a description or quote along with the image.')
//     return
//   }

//   try {
//     const formData = new FormData()
//     formData.append('quote', quote)
//     if (image) formData.append('image', image)

//     // Optional: Show loading state or disable button
//     const imageUrl = image ? URL.createObjectURL(image) : null

//     const res = await fetch('/api/positive-posts', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         user: 'Vishakha', // or get from session
//         content: quote,
//         imageUrl,
//       }),
//     })

//     const result = await res.json()
//     if (result.success) {
//       setEntries([{ quote, image: imageUrl }, ...entries])
//       setQuote('')
//       setImage(null)
//     } else {
//       alert('Failed to post! ' + result.error)
//     }
//   } catch (err) {
//     console.error('Submit error:', err)
//     alert('An error occurred while posting. Please try again.')
//   }
// }

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!quote || !image) {
    alert("Please provide both quote and image.");
    return;
  }

  const formData = new FormData();
  formData.append("quote", quote);
  formData.append("image", image);

  try {
    const res = await fetch("/api/positive-posts", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      // Save entry with permanent image URL
      setEntries([{ quote: result.quote, image: result.imageUrl }, ...entries]);
      setQuote("");
      setImage(null);
    } else {
      alert("Upload failed");
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred");
  }
};

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">🌟 Wall of Positivity</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-gray-800 p-4 rounded space-y-4">
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Share a positive thought or quote..."
          className="w-full p-3 rounded text-black"
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-white"
        />
        {previewImage && (
          <img src={previewImage} alt="Preview" className="w-full rounded" />
        )}
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500">
          Post
        </button>
      </form>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry._id} className="bg-gray-700 p-4 rounded">
            {entry.content && <p className="text-white mb-2">📝 {entry.content}</p>}
            {entry.imageUrl && <img src={entry.imageUrl} alt="User shared" className="w-full rounded" />}
            <p className="text-sm text-gray-400 mt-2">— {entry.user}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
