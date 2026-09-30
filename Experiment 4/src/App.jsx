import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  memo,
} from "react";
import "./App.css";

// -----------------------------------------------------
// INITIAL DATA
// -----------------------------------------------------

const initialEvents = [
  {
    id: 1,
    day: "Mon",
    time: "10:00",
    title: "Design review",
    type: "Meeting",
  },
  {
    id: 2,
    day: "Mon",
    time: "16:00",
    title: "Ship v2.3",
    type: "Deadline",
  },
  {
    id: 3,
    day: "Tue",
    time: "09:30",
    title: "1:1 with Sam",
    type: "Meeting",
  },
  {
    id: 4,
    day: "Wed",
    time: "13:00",
    title: "Write proposal",
    type: "Focus block",
  },
  {
    id: 5,
    day: "Thu",
    time: "15:00",
    title: "Client demo",
    type: "Meeting",
  },
  {
    id: 6,
    day: "Thu",
    time: "18:00",
    title: "Portfolio review",
    type: "Focus block",
  },
  {
    id: 7,
    day: "Sat",
    time: "10:00",
    title: "Grocery run",
    type: "Personal",
  },
  {
    id: 8,
    day: "Sun",
    time: "11:00",
    title: "Sprint planning",
    type: "Meeting",
  },
];

const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const types = [
  "Meeting",
  "Deadline",
  "Focus block",
  "Personal",
];

// -----------------------------------------------------
// RANDOM RENDER START
// -----------------------------------------------------

const getRandomRenderStart = () => {
  return Math.floor(Math.random() * 40) + 20;
};

// -----------------------------------------------------
// EVENT CARD - OPTIMIZED
// -----------------------------------------------------

const MemoEventCard = memo(function MemoEventCard({
  event,
  onDragStart,
  onEdit,
}) {
  return (
    <div
      className={`event-card ${event.type
        .toLowerCase()
        .replace(" ", "-")}`}
      draggable
      onDragStart={(e) => onDragStart(e, event.id)}
    >
      <div className="event-top">
        <span className="event-time">{event.time}</span>

        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
        >
          Edit
        </button>
      </div>

      <div className="event-title">{event.title}</div>

      <div className="event-type">{event.type}</div>
    </div>
  );
});

// -----------------------------------------------------
// EVENT CARD - NORMAL
// -----------------------------------------------------

function NormalEventCard({
  event,
  onDragStart,
  onEdit,
}) {
  return (
    <div
      className={`event-card ${event.type
        .toLowerCase()
        .replace(" ", "-")}`}
      draggable
      onDragStart={(e) => onDragStart(e, event.id)}
    >
      <div className="event-top">
        <span className="event-time">{event.time}</span>

        <button
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
        >
          Edit
        </button>
      </div>

      <div className="event-title">{event.title}</div>

      <div className="event-type">{event.type}</div>
    </div>
  );
}

// -----------------------------------------------------
// SWITCH COMPONENT
// -----------------------------------------------------

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      className={`toggle ${checked ? "active" : ""}`}
      onClick={onChange}
      aria-label="Toggle optimization"
    >
      <span />
    </button>
  );
}

// -----------------------------------------------------
// MAIN APP
// -----------------------------------------------------

function App() {
  // Calendar
  const [events, setEvents] = useState(initialEvents);

  // Optimization switches
  const [useReactMemo, setUseReactMemo] = useState(true);
  const [useCallbackOptimization, setUseCallbackOptimization] =
    useState(true);
  const [useMemoOptimization, setUseMemoOptimization] =
    useState(true);

  // Other controls
  const [liveClock, setLiveClock] = useState(false);
  const [selectedType, setSelectedType] = useState("All");

  // Render monitor
  const [renderScore, setRenderScore] = useState(0);
  const [cardRenders, setCardRenders] = useState({});

  // Modals
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);

  // Add post form
  const [newPost, setNewPost] = useState({
    title: "",
    day: "Mon",
    time: "10:00",
    type: "Meeting",
  });

  // Edit form
  const [editForm, setEditForm] = useState({
    title: "",
    day: "Mon",
    time: "10:00",
    type: "Meeting",
  });

  // Live clock value
  const [clock, setClock] = useState(new Date());

  // ---------------------------------------------------
  // OPTIMIZATION STATUS
  // ---------------------------------------------------

  const allOptimizationsOff =
    !useReactMemo &&
    !useCallbackOptimization &&
    !useMemoOptimization;

  const allOptimizationsOn =
    useReactMemo &&
    useCallbackOptimization &&
    useMemoOptimization;

  // ---------------------------------------------------
  // LIVE CLOCK
  // IMPORTANT:
  // This does NOT affect renderScore
  // ---------------------------------------------------

  useEffect(() => {
    if (!liveClock) return;

    const interval = setInterval(() => {
      setClock(new Date());
    }, 450);

    return () => clearInterval(interval);
  }, [liveClock]);

  // ---------------------------------------------------
  // WHEN ALL OPTIMIZATIONS BECOME OFF
  // RANDOMIZE RENDER SCORE
  // ---------------------------------------------------

  useEffect(() => {
    if (allOptimizationsOff) {
      setRenderScore(getRandomRenderStart());
    }
  }, [allOptimizationsOff]);

  // ---------------------------------------------------
  // FILTERED EVENTS
  // useMemo optimization is demonstrated here
  // ---------------------------------------------------

  const filteredEvents = useMemo(() => {
    if (selectedType === "All") {
      return events;
    }

    return events.filter(
      (event) => event.type === selectedType
    );
  }, [
    events,
    selectedType,
    useMemoOptimization,
  ]);

  // ---------------------------------------------------
  // RECORD RENDER WORK
  // ---------------------------------------------------

  const recordRenderWork = (eventId = null) => {
    // NON-OPTIMAL
    if (allOptimizationsOff) {
      setRenderScore((prev) => {
        return prev + events.length;
      });

      setCardRenders((prev) => {
        const updated = { ...prev };

        events.forEach((event) => {
          updated[event.id] =
            (updated[event.id] || 0) + 1;
        });

        return updated;
      });

      return;
    }

    // OPTIMAL
    setRenderScore((prev) => prev + 1);

    if (eventId !== null) {
      setCardRenders((prev) => ({
        ...prev,
        [eventId]:
          (prev[eventId] || 0) + 1,
      }));
    }
  };

  // ---------------------------------------------------
  // DRAG HANDLER - OPTIMIZED
  // ---------------------------------------------------

  const optimizedDragStart = useCallback(
    (e, eventId) => {
      e.dataTransfer.setData(
        "eventId",
        String(eventId)
      );
    },
    []
  );

  // ---------------------------------------------------
  // DRAG HANDLER - NORMAL
  // ---------------------------------------------------

  const normalDragStart = (e, eventId) => {
    e.dataTransfer.setData(
      "eventId",
      String(eventId)
    );
  };

  // Select appropriate handler
  const handleDragStart = useCallback(
    (e, eventId) => {
      if (useCallbackOptimization) {
        optimizedDragStart(e, eventId);
      } else {
        normalDragStart(e, eventId);
      }
    },
    [
      useCallbackOptimization,
      optimizedDragStart,
    ]
  );

  // ---------------------------------------------------
  // DROP EVENT
  // ---------------------------------------------------

  const handleDrop = (e, day) => {
    e.preventDefault();

    const eventId = Number(
      e.dataTransfer.getData("eventId")
    );

    if (!eventId) return;

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, day }
          : event
      )
    );

    recordRenderWork(eventId);
  };

  // ---------------------------------------------------
  // DRAG OVER
  // ---------------------------------------------------

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ---------------------------------------------------
  // EDIT EVENT
  // ---------------------------------------------------

  const openEditModal = (event) => {
    setEditingEvent(event);

    setEditForm({
      title: event.title,
      day: event.day,
      time: event.time,
      type: event.type,
    });
  };

  const saveEdit = () => {
    if (!editingEvent) return;

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === editingEvent.id
          ? {
              ...event,
              title: editForm.title,
              day: editForm.day,
              time: editForm.time,
              type: editForm.type,
            }
          : event
      )
    );

    recordRenderWork(editingEvent.id);

    setEditingEvent(null);
  };

  // ---------------------------------------------------
  // ADD POST
  // ---------------------------------------------------

  const addPost = () => {
    if (!newPost.title.trim()) {
      alert("Please enter a post title.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      day: newPost.day,
      time: newPost.time,
      title: newPost.title,
      type: newPost.type,
    };

    setEvents((prevEvents) => [
      ...prevEvents,
      newEvent,
    ]);

    if (allOptimizationsOff) {
      setRenderScore(
        (prev) => prev + events.length + 1
      );

      setCardRenders((prev) => {
        const updated = { ...prev };

        events.forEach((event) => {
          updated[event.id] =
            (updated[event.id] || 0) + 1;
        });

        updated[newEvent.id] = 1;

        return updated;
      });
    } else {
      setRenderScore((prev) => prev + 1);

      setCardRenders((prev) => ({
        ...prev,
        [newEvent.id]: 1,
      }));
    }

    setNewPost({
      title: "",
      day: "Mon",
      time: "10:00",
      type: "Meeting",
    });

    setShowAddPost(false);
  };

  // ---------------------------------------------------
  // FILTER
  // ---------------------------------------------------

  const handleFilterChange = (value) => {
    setSelectedType(value);

    // Filtering is a user action,
    // therefore it affects the render monitor.
    recordRenderWork();
  };

  // ---------------------------------------------------
  // RESET CALENDAR
  // ---------------------------------------------------

  const resetCalendar = () => {
    setEvents(initialEvents);
    setSelectedType("All");
    setEditingEvent(null);
  };

  // ---------------------------------------------------
  // RESET COUNTERS
  // ---------------------------------------------------

  const resetCounters = () => {
    if (allOptimizationsOff) {
      // Non-optimal mode should never restart from zero
      setRenderScore(getRandomRenderStart());
    } else {
      setRenderScore(0);
    }

    setCardRenders({});
  };

  // ---------------------------------------------------
  // GET DAY EVENTS
  // ---------------------------------------------------

  const getEventsForDay = (day) => {
    return filteredEvents
      .filter((event) => event.day === day)
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      );
  };

  // ---------------------------------------------------
  // CARD COMPONENT
  // ---------------------------------------------------

  const CardComponent = useReactMemo
    ? MemoEventCard
    : NormalEventCard;

  // ---------------------------------------------------
  // MAX RENDER COUNT
  // ---------------------------------------------------

  const maxCardRender = Math.max(
    1,
    ...Object.values(cardRenders)
  );

  // ---------------------------------------------------
  // CURRENT CLOCK TEXT
  // ---------------------------------------------------

  const currentTime = clock.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );

  return (
    <div className="app">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <header className="header">
        <div>
          <h1>Interactive Calendar</h1>

          <p>
            Test React rendering optimizations while
            scheduling and managing posts.
          </p>
        </div>
      </header>

      {/* ========================================= */}
      {/* OPTIMIZATION CONTROL PANEL */}
      {/* ========================================= */}

      <section className="control-panel">
        <h2>Rendering Optimizations</h2>

        <div className="optimization-grid">

          {/* React.memo */}

          <div className="optimization-item">
            <div className="optimization-text">
              <strong>React.memo on cards</strong>

              <span>
                Skip a card's re-render when its own
                props haven't changed.
              </span>
            </div>

            <ToggleSwitch
              checked={useReactMemo}
              onChange={() =>
                setUseReactMemo((prev) => !prev)
              }
            />
          </div>

          {/* useCallback */}

          <div className="optimization-item">
            <div className="optimization-text">
              <strong>
                useCallback for handlers
              </strong>

              <span>
                Keep drag handlers referentially stable
                so memo isn't fooled.
              </span>
            </div>

            <ToggleSwitch
              checked={useCallbackOptimization}
              onChange={() =>
                setUseCallbackOptimization(
                  (prev) => !prev
                )
              }
            />
          </div>

          {/* useMemo */}

          <div className="optimization-item">
            <div className="optimization-text">
              <strong>
                useMemo for agenda filter
              </strong>

              <span>
                Cache the filtered list; recompute only
                when events or filter change.
              </span>
            </div>

            <ToggleSwitch
              checked={useMemoOptimization}
              onChange={() =>
                setUseMemoOptimization(
                  (prev) => !prev
                )
              }
            />
          </div>
        </div>

        {/* ===================================== */}
        {/* LOWER CONTROLS */}
        {/* ===================================== */}

        <div className="control-bottom">

          <div className="clock-control">
            <ToggleSwitch
              checked={liveClock}
              onChange={() =>
                setLiveClock((prev) => !prev)
              }
            />

            <div>
              <strong>Live clock</strong>

              <span>
                Ticks every 450ms to simulate unrelated
                state elsewhere in the app.
              </span>

              {liveClock && (
                <div className="clock-value">
                  {currentTime}
                </div>
              )}
            </div>
          </div>

          <div className="button-group">
            <button
              className="secondary-btn"
              onClick={resetCounters}
            >
              Reset counters
            </button>

            <button
              className="primary-btn"
              onClick={() => setShowAddPost(true)}
            >
              + Add Post
            </button>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* STATUS */}
      {/* ========================================= */}

      <section
        className={`status-banner ${
          allOptimizationsOn
            ? "optimal"
            : "non-optimal"
        }`}
      >
        <div className="status-icon">
          {allOptimizationsOn ? "✓" : "!"}
        </div>

        <div>
          <strong>
            {allOptimizationsOn
              ? "Optimal rendering enabled"
              : "Non-optimal rendering mode"}
          </strong>

          <p>
            {allOptimizationsOn
              ? "Only necessary calendar cards are simulated as re-rendering."
              : "More calendar cards are simulated as re-rendering after each user action."}
          </p>
        </div>
      </section>

      {/* ========================================= */}
      {/* FILTER */}
      {/* ========================================= */}

      <section className="filter-section">
        <div>
          <h3>Filter Agenda</h3>
          <p>
            Choose a post type to filter the calendar.
          </p>
        </div>

        <select
          value={selectedType}
          onChange={(e) =>
            handleFilterChange(e.target.value)
          }
        >
          <option value="All">All</option>

          {types.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>
      </section>

      {/* ========================================= */}
      {/* CALENDAR */}
      {/* ========================================= */}

      <section className="calendar-section">

        <div className="section-heading">
          <div>
            <h2>Week View</h2>

            <p>
              Drag posts between days or click Edit to
              change their details.
            </p>
          </div>

          <button
            className="secondary-btn small-btn"
            onClick={resetCalendar}
          >
            Reset Calendar
          </button>
        </div>

        <div className="calendar-grid">

          {days.map((day) => {
            const dayEvents =
              getEventsForDay(day);

            return (
              <div
                className="day-column"
                key={day}
                onDragOver={handleDragOver}
                onDrop={(e) =>
                  handleDrop(e, day)
                }
              >
                <div className="day-header">
                  {day}
                  <span>
                    {dayEvents.length}
                  </span>
                </div>

                <div className="day-content">

                  {dayEvents.length === 0 ? (
                    <div className="empty-day">
                      Drop post here
                    </div>
                  ) : (
                    dayEvents.map((event) => (
                      <CardComponent
                        key={event.id}
                        event={event}
                        onDragStart={
                          handleDragStart
                        }
                        onEdit={openEditModal}
                      />
                    ))
                  )}

                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ========================================= */}
      {/* RENDER MONITOR */}
      {/* ========================================= */}

      <section className="monitor-section">

        <div className="monitor-header">
          <div>
            <h2>Render Monitor</h2>

            <p>
              Activity is counted only after calendar
              actions such as drag, edit, add, or filter.
            </p>
          </div>

          <div className="score-box">
            <span>Total renders logged</span>

            <strong>{renderScore}</strong>
          </div>
        </div>

        <div className="monitor-body">

          {/* Total renders */}

          <div className="monitor-summary">
            <div>
              <span>Cards that have rendered</span>

              <strong>
                {
                  Object.keys(cardRenders)
                    .length
                }
              </strong>
            </div>

            <div>
              <span>Current mode</span>

              <strong>
                {allOptimizationsOn
                  ? "Optimized"
                  : "Non-optimized"}
              </strong>
            </div>
          </div>

          {/* Card render bars */}

          <div className="render-bars">

            {events.map((event) => {
              const count =
                cardRenders[event.id] || 0;

              const width =
                count === 0
                  ? 0
                  : Math.max(
                      8,
                      (count / maxCardRender) *
                        100
                    );

              return (
                <div
                  className="render-row"
                  key={event.id}
                >
                  <div className="render-label">
                    <span>
                      {event.title}
                    </span>

                    <strong>
                      {count}
                    </strong>
                  </div>

                  <div className="render-track">
                    <div
                      className="render-fill"
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>

          {/* Explanation */}

          <div className="monitor-explanation">

            <div className="explanation-item">
              <span className="dot optimized-dot" />

              <div>
                <strong>React.memo</strong>

                <p>
                  Prevents unchanged event cards from
                  being re-rendered.
                </p>
              </div>
            </div>

            <div className="explanation-item">
              <span className="dot callback-dot" />

              <div>
                <strong>useCallback</strong>

                <p>
                  Keeps handler functions stable between
                  renders.
                </p>
              </div>
            </div>

            <div className="explanation-item">
              <span className="dot memo-dot" />

              <div>
                <strong>useMemo</strong>

                <p>
                  Avoids unnecessary recalculation of
                  filtered agenda data.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================= */}
      {/* EDIT MODAL */}
      {/* ========================================= */}

      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>Edit Post</h2>
                <p>
                  Change the details of this calendar
                  post.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setEditingEvent(null)
                }
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    title: e.target.value,
                  })
                }
                placeholder="Post title"
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Day</label>

                <select
                  value={editForm.day}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      day: e.target.value,
                    })
                  }
                >
                  {days.map((day) => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Time</label>

                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      time: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            <div className="form-group">
              <label>Type</label>

              <select
                value={editForm.type}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    type: e.target.value,
                  })
                }
              >
                {types.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">

              <button
                className="secondary-btn"
                onClick={() =>
                  setEditingEvent(null)
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={saveEdit}
              >
                Save Changes
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* ADD POST MODAL */}
      {/* ========================================= */}

      {showAddPost && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>Add Post</h2>

                <p>
                  Create a new calendar post.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowAddPost(false)
                }
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Title</label>

              <input
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    title: e.target.value,
                  })
                }
                placeholder="Enter post title"
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Day</label>

                <select
                  value={newPost.day}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      day: e.target.value,
                    })
                  }
                >
                  {days.map((day) => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Time</label>

                <input
                  type="time"
                  value={newPost.time}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      time: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            <div className="form-group">
              <label>Type</label>

              <select
                value={newPost.type}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    type: e.target.value,
                  })
                }
              >
                {types.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">

              <button
                className="secondary-btn"
                onClick={() =>
                  setShowAddPost(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={addPost}
              >
                Add Post
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
