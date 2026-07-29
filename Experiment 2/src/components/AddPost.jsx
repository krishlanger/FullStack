import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../features/postsSlice";

function AddPost() {
  const dispatch = useDispatch();

  const platforms = useSelector((state) => state.platforms.list);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);

  const handleAdd = () => {
    if (!title.trim()) return;

    dispatch(
      addPost({
        id: Date.now(),
        title,
        platform,
      })
    );

    setTitle("");
    setPlatform(platforms[0]);
  };

  return (
    <div className="form">
      <input
        type="text"
        placeholder="Enter Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        {platforms.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button onClick={handleAdd}>
        Add Post
      </button>
    </div>
  );
}

export default AddPost;