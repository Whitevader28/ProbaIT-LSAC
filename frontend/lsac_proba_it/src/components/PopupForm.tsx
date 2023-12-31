import { useState } from "react";
import axios from "axios";

interface Props {
  name: "Register" | "Login" | "Create Poll" | "Logout";
  toggle: any;
}

function PopupForm({ name, toggle }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repass, setRepass] = useState("");

  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", "", ""]);

  async function handleLogin(e: any) {
    e.preventDefault();

    if (name == "Login") {
      axios
        .post("http://localhost:5000/login", {
          email: username,
          password: password,
        })
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_id", response.data.user_id);
          localStorage.setItem("user_email", response.data.user_email);
          alert(response.data.message);
          window.location.reload();
        })
        .catch((error) => {
          alert(error.response.data);
          console.log(error);
        });
    } else if (name == "Register") {
      axios
        .post("http://localhost:5000/register", {
          email: username,
          password: password,
          confirmPassword: repass,
        })
        .then((response) => {
          alert(response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error.response.data);
          alert(error.response.data);
        });
    }

    toggle();
  }

  async function handleCreatePoll(e: any) {
    e.preventDefault();

    axios
      .post("http://localhost:5000/polls", {
        owner: localStorage.getItem("user_email"),
        question: title,
        options: options,
      })
      .then((response) => {
        alert(response.data);
        window.location.reload();
      })
      .catch((error) => {
        alert(error.response.data);
        console.log("There was an error", error);
      });
  }

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>{name}</h2>
        {name == "Register" || name == "Login" ? (
          <form onSubmit={handleLogin}>
            <label>
              <input
                placeholder="Email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <div>
              {name == "Register" ? (
                <label>
                  <input
                    placeholder="Confirm Password"
                    type="password"
                    value={repass}
                    onChange={(e) => setRepass(e.target.value)}
                  ></input>
                </label>
              ) : null}
            </div>
            <button type="submit" onClick={handleLogin}>
              {name == "Login" ? "Login" : "Create account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreatePoll}>
            <label>
              <input
                placeholder="Type your question here"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  console.log(e.target.value);
                }}
              />
            </label>
            {/* TODO: add radiobutton for type of question, but I only have single answer question */}
            <p className="answer-options">Answer Options</p>
            <label>
              <input
                placeholder="Option 1"
                type="text"
                value={options[0]}
                onChange={(e) =>
                  setOptions([e.target.value, options[1], options[2]])
                }
              />
            </label>
            <label>
              <input
                placeholder="Option 2"
                type="text"
                value={options[1]}
                onChange={(e) =>
                  setOptions([options[0], e.target.value, options[2]])
                }
              />
            </label>
            <label>
              <input
                placeholder="Option 3"
                type="text"
                value={options[2]}
                onChange={(e) =>
                  setOptions([options[0], options[1], e.target.value])
                }
              />
            </label>
            <button type="submit" onClick={handleCreatePoll}>
              Create Poll
            </button>
          </form>
        )}

        <button onClick={toggle}>Close</button>
      </div>
    </div>
  );
}

export default PopupForm;
