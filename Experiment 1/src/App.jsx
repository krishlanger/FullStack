import { useState } from "react";
import "./App.css";

function App() {
  const limits = {
    Twitter: 280,
    Instagram: 2200,
    LinkedIn: 3000,
  };

  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const remaining = limits[platform] - post.length;

  const saveDraft = () => {
    if (post.trim() === "") {
      alert("Write something first!");
      return;
    }

    if (editIndex !== null) {
      const updated = [...drafts];
      updated[editIndex] = { platform, post };
      setDrafts(updated);
      setEditIndex(null);
    } else {
      setDrafts([...drafts, { platform, post }]);
    }

    setPost("");
  };

  const editDraft = (index) => {
    setPlatform(drafts[index].platform);
    setPost(drafts[index].post);
    setEditIndex(index);
  };

  const deleteDraft = (index) => {
    const updated = drafts.filter((_, i) => i !== index);
    setDrafts(updated);
  };

  return (
    <div className="container">

      <h1>Social Media Post Composer</h1>

      <label>Select Platform</label>

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option>Twitter</option>
        <option>Instagram</option>
        <option>LinkedIn</option>
      </select>

      <textarea
        placeholder="Write your post..."
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />

      <p>
        Characters :
        {post.length}/{limits[platform]}
      </p>

      {remaining < 0 ? (
        <p className="error">
          Character limit exceeded by {-remaining}
        </p>
      ) : (
        <p className="success">
          Remaining Characters : {remaining}
        </p>
      )}

      <button
        onClick={saveDraft}
        disabled={remaining < 0}
      >
        {editIndex !== null ? "Update Draft" : "Save Draft"}
      </button>

      <hr />

      <h2>Saved Drafts</h2>

      {drafts.length === 0 ? (
        <p>No Drafts Available</p>
      ) : (
        drafts.map((draft, index) => (
          <div className="draft" key={index}>

            <h3>{draft.platform}</h3>

            <p>{draft.post}</p>

            <button onClick={() => editDraft(index)}>
              Edit
            </button>

            <button onClick={() => deleteDraft(index)}>
              Delete
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default App;