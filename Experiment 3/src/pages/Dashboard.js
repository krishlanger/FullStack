import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  const storedUsername = localStorage.getItem("username");

  const [user, setUser] = useState({
    username: storedUsername || "User",
    role: storedRole || "Viewer",
    exp: null
  });

  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);

  const [loginTime, setLoginTime] = useState(
    localStorage.getItem("loginTime") || new Date().toLocaleString()
  );


  /* ============================= */
  /* DECODE JWT */
  /* ============================= */

  useEffect(() => {

    if (!token) {
      navigate("/");
      return;
    }

    try {

      const parts = token.split(".");

      if (parts.length === 3) {

        const payload = JSON.parse(
          atob(
            parts[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );

        setUser({
          username: payload.username || storedUsername || "User",
          role: payload.role || storedRole || "Viewer",
          exp: payload.exp || null
        });

      }

    } catch (error) {

      console.log("JWT decoding failed.");

    }

  }, [token, navigate, storedRole, storedUsername]);


  /* ============================= */
  /* LOAD POSTS */
  /* ============================= */

  useEffect(() => {

    const savedPosts = localStorage.getItem("posts");

    if (savedPosts) {

      try {

        setPosts(JSON.parse(savedPosts));

      } catch {

        setPosts([]);

      }

    }

  }, []);


  /* ============================= */
  /* SAVE LOGIN TIME */
  /* ============================= */

  useEffect(() => {

    if (!localStorage.getItem("loginTime")) {

      const currentTime = new Date().toLocaleString();

      localStorage.setItem("loginTime", currentTime);

      setLoginTime(currentTime);

    }

  }, []);


  /* ============================= */
  /* CREATE POST */
  /* ============================= */

  const createPost = () => {

    if (user.role === "Viewer") {
      alert("Viewer cannot create posts.");
      return;
    }

    if (!title.trim() || !content.trim()) {

      alert("Please enter title and content.");

      return;

    }

    const newPost = {

      id: Date.now(),

      title: title,

      content: content,

      author: user.username,

      role: user.role,

      createdAt: new Date().toLocaleString()

    };


    const updatedPosts = [...posts, newPost];

    setPosts(updatedPosts);

    localStorage.setItem(
      "posts",
      JSON.stringify(updatedPosts)
    );

    setTitle("");
    setContent("");

    alert("Post created successfully.");

  };


  /* ============================= */
  /* EDIT POST */
  /* ============================= */

  const startEdit = (index) => {

    if (user.role === "Viewer") {

      alert("Viewer cannot edit posts.");

      return;

    }

    setEditingIndex(index);

    setTitle(posts[index].title);

    setContent(posts[index].content);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  /* ============================= */
  /* UPDATE POST */
  /* ============================= */

  const updatePost = () => {

    if (user.role === "Viewer") {

      alert("Viewer cannot edit posts.");

      return;

    }

    if (editingIndex === null) {
      return;
    }

    if (!title.trim() || !content.trim()) {

      alert("Please enter title and content.");

      return;

    }

    const updatedPosts = [...posts];

    updatedPosts[editingIndex] = {

      ...updatedPosts[editingIndex],

      title: title,

      content: content,

      updatedAt: new Date().toLocaleString(),

      updatedBy: user.username

    };


    setPosts(updatedPosts);

    localStorage.setItem(
      "posts",
      JSON.stringify(updatedPosts)
    );

    setEditingIndex(null);

    setTitle("");

    setContent("");

    alert("Post updated successfully.");

  };


  /* ============================= */
  /* DELETE POST */
  /* ============================= */

  const deletePost = (index) => {

    if (user.role !== "Admin") {

      alert("Only Admin can delete posts.");

      return;

    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedPosts = posts.filter(
      (_, i) => i !== index
    );

    setPosts(updatedPosts);

    localStorage.setItem(
      "posts",
      JSON.stringify(updatedPosts)
    );

  };


  /* ============================= */
  /* CANCEL EDIT */
  /* ============================= */

  const cancelEdit = () => {

    setEditingIndex(null);

    setTitle("");

    setContent("");

  };


  /* ============================= */
  /* LOGOUT */
  /* ============================= */

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("username");

    localStorage.removeItem("loginTime");

    navigate("/");

  };


  /* ============================= */
  /* JWT EXPIRY */
  /* ============================= */

  const getExpiry = () => {

    if (!user.exp) {

      return "Not available";

    }

    return new Date(
      user.exp * 1000
    ).toLocaleString();

  };


  /* ============================= */
  /* PERMISSIONS */
  /* ============================= */

  const canCreate =
    user.role === "Admin" ||
    user.role === "Editor";

  const canEdit =
    user.role === "Admin" ||
    user.role === "Editor";

  const canDelete =
    user.role === "Admin";


  return (

    <div className="dashboard-page">


      {/* ============================= */}
      {/* NAVBAR */}
      {/* ============================= */}

      <nav className="dashboard-navbar">

        <div className="navbar-logo">
          Post Composer
        </div>


        <div className="navbar-links">

          <Link
            to="/dashboard"
            className="active-link"
          >
            Dashboard
          </Link>


          <a href="#posts">
            Posts
          </a>


          {canCreate && (
            <a href="#create">
              Create Post
            </a>
          )}


          <a href="#analytics">
            Analytics
          </a>


          {user.role === "Admin" && (

            <Link to="/admin">
              Admin Panel
            </Link>

          )}

        </div>


        <button
          className="navbar-logout"
          onClick={logout}
        >
          Logout
        </button>

      </nav>


      {/* ============================= */}
      {/* MAIN CONTENT */}
      {/* ============================= */}

      <main className="dashboard-main">


        {/* WELCOME */}

        <section className="welcome-section">

          <div>

            <h1>
              Welcome {user.role}
            </h1>

            <p>
              Role: <strong>{user.role}</strong>
            </p>

          </div>


          <div className={`role-badge ${user.role.toLowerCase()}`}>
            {user.role}
          </div>

        </section>


        {/* ============================= */}
        {/* AUTHENTICATION DETAILS */}
        {/* ============================= */}

        <section className="auth-card">

          <h2>
            Authentication Details
          </h2>


          <div className="auth-grid">

            <div className="auth-item">

              <span>
                Username
              </span>

              <strong>
                {user.username}
              </strong>

            </div>


            <div className="auth-item">

              <span>
                Role
              </span>

              <strong>
                {user.role}
              </strong>

            </div>


            <div className="auth-item">

              <span>
                Login Time
              </span>

              <strong>
                {loginTime}
              </strong>

            </div>


            <div className="auth-item">

              <span>
                Token Expiry
              </span>

              <strong>
                {getExpiry()}
              </strong>

            </div>

          </div>


          <h3 className="jwt-heading">
            JWT Token
          </h3>


          <textarea
            className="jwt-token"
            value={token || ""}
            readOnly
          />

        </section>


        {/* ============================= */}
        {/* STATISTICS */}
        {/* ============================= */}

        <section
          className="stats-grid"
          id="analytics"
        >

          <div className="stat-card blue">

            <div className="stat-icon">
              📄
            </div>

            <div>

              <span>
                Total Posts
              </span>

              <strong>
                {posts.length}
              </strong>

            </div>

          </div>


          <div className="stat-card green">

            <div className="stat-icon">
              👤
            </div>

            <div>

              <span>
                Current User
              </span>

              <strong>
                {user.username}
              </strong>

            </div>

          </div>


          <div className="stat-card purple">

            <div className="stat-icon">
              🔐
            </div>

            <div>

              <span>
                Access Level
              </span>

              <strong>
                {user.role}
              </strong>

            </div>

          </div>


          <div className="stat-card orange">

            <div className="stat-icon">
              🛡️
            </div>

            <div>

              <span>
                Authentication
              </span>

              <strong>
                JWT Active
              </strong>

            </div>

          </div>

        </section>


        {/* ============================= */}
        {/* CREATE POST */}
        {/* ============================= */}

        {canCreate && (

          <section
            className="create-card"
            id="create"
          >

            <div className="section-heading">

              <div>

                <h2>
                  {editingIndex === null
                    ? "Create New Post"
                    : "Edit Post"}
                </h2>

                <p>
                  {editingIndex === null
                    ? "Create a new social media post."
                    : "Update the selected post."}
                </p>

              </div>

              <span className="permission-badge">
                {user.role} Access
              </span>

            </div>


            <input
              className="post-input"
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />


            <textarea
              className="post-textarea"
              placeholder="Write your post content..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
            />


            <div className="form-buttons">

              {editingIndex === null ? (

                <button
                  className="create-button"
                  onClick={createPost}
                >
                  + Create Post
                </button>

              ) : (

                <>

                  <button
                    className="update-button"
                    onClick={updatePost}
                  >
                    ✓ Update Post
                  </button>

                  <button
                    className="cancel-button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>

                </>

              )}

            </div>

          </section>

        )}


        {/* ============================= */}
        {/* POSTS */}
        {/* ============================= */}

        <section
          className="posts-section"
          id="posts"
        >

          <div className="posts-heading">

            <div>

              <h2>
                Recent Posts
              </h2>

              <p>
                Posts created by Admin and Editor.
              </p>

            </div>


            <span className="post-count">
              {posts.length} Posts
            </span>

          </div>


          {posts.length === 0 ? (

            <div className="empty-posts">

              <div className="empty-icon">
                📝
              </div>

              <h3>
                No Posts Yet
              </h3>

              <p>
                {user.role === "Viewer"
                  ? "There are no posts available yet."
                  : "Create your first post using the form above."}
              </p>

            </div>

          ) : (

            <div className="posts-grid">

              {posts.map((post, index) => (

                <article
                  className="post-card-modern"
                  key={post.id || index}
                >

                  <div className="post-top">

                    <span className="post-role">
                      {post.role || "User"}
                    </span>

                    <span className="post-date">
                      {post.createdAt}
                    </span>

                  </div>


                  <h3>
                    {post.title}
                  </h3>


                  <p className="post-content">
                    {post.content}
                  </p>


                  <div className="post-author">

                    <div className="author-avatar">
                      {(post.author || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <span>
                        Created by
                      </span>

                      <strong>
                        {post.author || "Unknown"}
                      </strong>

                    </div>

                  </div>


                  {(post.updatedAt) && (

                    <div className="updated-info">

                      Last updated:
                      {" "}
                      {post.updatedAt}

                    </div>

                  )}


                  {/* ACTIONS */}

                  {(canEdit || canDelete) && (

                    <div className="post-actions">

                      {canEdit && (

                        <button
                          className="edit-button"
                          onClick={() =>
                            startEdit(index)
                          }
                        >
                          ✎ Edit
                        </button>

                      )}


                      {canDelete && (

                        <button
                          className="delete-button"
                          onClick={() =>
                            deletePost(index)
                          }
                        >
                          🗑 Delete
                        </button>

                      )}

                    </div>

                  )}


                  {user.role === "Viewer" && (

                    <div className="view-only">

                      👁 View Only

                    </div>

                  )}

                </article>

              ))}

            </div>

          )}

        </section>


        {/* ============================= */}
        {/* PERMISSION INFORMATION */}
        {/* ============================= */}

        <section className="permission-card">

          <h2>
            Your Permissions
          </h2>


          <div className="permission-list">

            <div className={canCreate ? "allowed" : "blocked"}>
              {canCreate ? "✓" : "✕"} Create Posts
            </div>


            <div className={canEdit ? "allowed" : "blocked"}>
              {canEdit ? "✓" : "✕"} Edit Posts
            </div>


            <div className={canDelete ? "allowed" : "blocked"}>
              {canDelete ? "✓" : "✕"} Delete Posts
            </div>


            <div className="allowed">
              ✓ View Posts
            </div>

          </div>

        </section>


      </main>

    </div>

  );

}

export default Dashboard;