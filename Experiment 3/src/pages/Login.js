import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    let role = "";

    if (username === "admin" && password === "admin123") {
      role = "Admin";
    } else if (username === "editor" && password === "editor123") {
      role = "Editor";
    } else if (username === "viewer" && password === "viewer123") {
      role = "Viewer";
    } else {
      alert("Invalid Username or Password");
      return;
    }

    const userData = {
      username,
      role
    };

    const token = btoa(JSON.stringify(userData));

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    localStorage.setItem("loginTime", new Date().toLocaleString());

    window.location.href = "/dashboard";
  };

  const fillAccount = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="login-background">

      {/* Decorative shapes */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>
      <div className="glow glow-three"></div>

      <div className="login-wrapper">

        {/* LEFT SIDE */}
        <div className="login-intro">

          <div className="brand-icon">
            🔐
          </div>

          <h1>
            Post
            <span>Composer</span>
          </h1>

          <p className="intro-text">
            Create, manage and share your social media
            content with secure role-based access.
          </p>

          <div className="feature-list">

            <div className="feature">
              <div className="feature-icon blue">
                🛡️
              </div>

              <div>
                <strong>JWT Authentication</strong>
                <p>Secure token-based login</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon green">
                👥
              </div>

              <div>
                <strong>Role Based Access</strong>
                <p>Admin, Editor & Viewer permissions</p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon purple">
                ⚡
              </div>

              <div>
                <strong>Simple & Fast</strong>
                <p>Modern React application</p>
              </div>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="login-card-modern">

          <div className="login-header">

            <div className="mobile-brand">
              🔐
            </div>

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to continue to your dashboard
            </p>

          </div>


          {/* USERNAME */}

          <div className="input-group">

            <label>
              Username
            </label>

            <div className="input-box">

              <span>
                👤
              </span>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />

            </div>

          </div>


          {/* PASSWORD */}

          <div className="input-group">

            <label>
              Password
            </label>

            <div className="input-box">

              <span>
                🔑
              </span>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            className="premium-login-button"
            onClick={login}
          >

            <span>
              Sign In
            </span>

            <span className="arrow">
              →
            </span>

          </button>


          <div className="secure-text">
            🔒 Secure authentication • JWT protected
          </div>


          {/* DEMO ACCOUNTS */}

          <div className="demo-section">

            <div className="demo-heading">

              <div>
                <h3>
                  Quick Login
                </h3>

                <p>
                  Try a demo account
                </p>
              </div>

              <span className="demo-badge">
                DEMO
              </span>

            </div>


            <div className="account-list">

              {/* ADMIN */}

              <div
                className="account-card admin-account"
                onClick={() =>
                  fillAccount("admin", "admin123")
                }
              >

                <div className="account-icon">
                  👑
                </div>

                <div className="account-info">

                  <strong>
                    Administrator
                  </strong>

                  <span>
                    admin
                  </span>

                </div>

                <button
                  className="account-use"
                  onClick={(e) => {
                    e.stopPropagation();
                    fillAccount("admin", "admin123");
                  }}
                >
                  Use
                </button>

              </div>


              {/* EDITOR */}

              <div
                className="account-card editor-account"
                onClick={() =>
                  fillAccount("editor", "editor123")
                }
              >

                <div className="account-icon">
                  ✏️
                </div>

                <div className="account-info">

                  <strong>
                    Editor
                  </strong>

                  <span>
                    editor
                  </span>

                </div>

                <button
                  className="account-use"
                  onClick={(e) => {
                    e.stopPropagation();
                    fillAccount("editor", "editor123");
                  }}
                >
                  Use
                </button>

              </div>


              {/* VIEWER */}

              <div
                className="account-card viewer-account"
                onClick={() =>
                  fillAccount("viewer", "viewer123")
                }
              >

                <div className="account-icon">
                  👁️
                </div>

                <div className="account-info">

                  <strong>
                    Viewer
                  </strong>

                  <span>
                    viewer
                  </span>

                </div>

                <button
                  className="account-use"
                  onClick={(e) => {
                    e.stopPropagation();
                    fillAccount("viewer", "viewer123");
                  }}
                >
                  Use
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="copyright">
        JWT Authentication & RBAC • React Application
      </div>

    </div>
  );
}

export default Login;