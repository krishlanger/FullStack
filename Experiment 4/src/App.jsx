import React, {
  useState,
  useMemo,
  useCallback,
  memo
} from "react";

import "./App.css";

/* =====================================================
   INITIAL CALENDAR EVENTS
===================================================== */

const initialEvents = [
  {
    id: 1,
    day: "Mon",
    time: "10:00",
    title: "Design review",
    type: "Meeting"
  },
  {
    id: 2,
    day: "Mon",
    time: "16:00",
    title: "Ship v2.3",
    type: "Deadline"
  },
  {
    id: 3,
    day: "Tue",
    time: "09:30",
    title: "1:1 with Sam",
    type: "Meeting"
  },
  {
    id: 4,
    day: "Wed",
    time: "13:00",
    title: "Write proposal",
    type: "Focus block"
  },
  {
    id: 5,
    day: "Thu",
    time: "15:00",
    title: "Client demo",
    type: "Meeting"
  },
  {
    id: 6,
    day: "Thu",
    time: "18:00",
    title: "Portfolio review",
    type: "Focus block"
  },
  {
    id: 7,
    day: "Sat",
    time: "10:00",
    title: "Grocery run",
    type: "Personal"
  },
  {
    id: 8,
    day: "Sun",
    time: "11:00",
    title: "Sprint planning",
    type: "Meeting"
  }
];

const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];

/* =====================================================
   MEMOIZED EVENT CARD
===================================================== */

const MemoEventCard = memo(function MemoEventCard({
  event,
  onDragStart,
  onEdit
}) {
  return (
    <div
      className={`event-card ${event.type
        .toLowerCase()
        .replace(" ", "-")}`}
      draggable
      onDragStart={(e) =>
        onDragStart(e, event)
      }
    >
      <div
        className="event-main"
        onClick={() => onEdit(event)}
      >
        <div className="event-time">
          {event.time}
        </div>

        <div className="event-title">
          {event.title}
        </div>
      </div>

      <div className="event-footer">

        <span className="render-dot"></span>

        <span className="event-type">
          {event.type}
        </span>

        <button
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
        >
          Edit
        </button>

      </div>
    </div>
  );
});

/* =====================================================
   NORMAL EVENT CARD
   Used when React.memo is OFF
===================================================== */

function NormalEventCard({
  event,
  onDragStart,
  onEdit
}) {
  return (
    <div
      className={`event-card ${event.type
        .toLowerCase()
        .replace(" ", "-")}`}
      draggable
      onDragStart={(e) =>
        onDragStart(e, event)
      }
    >
      <div
        className="event-main"
        onClick={() => onEdit(event)}
      >
        <div className="event-time">
          {event.time}
        </div>

        <div className="event-title">
          {event.title}
        </div>
      </div>

      <div className="event-footer">

        <span className="render-dot"></span>

        <span className="event-type">
          {event.type}
        </span>

        <button
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
        >
          Edit
        </button>

      </div>
    </div>
  );
}

/* =====================================================
   MAIN APP
===================================================== */

function App() {

  /* ---------------- CALENDAR STATE ---------------- */

  const [events, setEvents] =
    useState(initialEvents);

  /* ---------------- OPTIMIZATION SWITCHES ---------------- */

  const [useReactMemo, setUseReactMemo] =
    useState(true);

  const [
    useCallbackOptimization,
    setUseCallbackOptimization
  ] = useState(true);

  const [
    useMemoOptimization,
    setUseMemoOptimization
  ] = useState(true);

  /* ---------------- LIVE CLOCK ---------------- */

  const [liveClock, setLiveClock] =
    useState(false);

  /* ---------------- FILTER ---------------- */

  const [selectedType, setSelectedType] =
    useState("All");

  /* ---------------- RENDER MONITOR ---------------- */

  const [renderScore, setRenderScore] =
    useState(0);

  const [cardRenders, setCardRenders] =
    useState({});

  /* ---------------- EDIT ---------------- */

  const [editingEvent, setEditingEvent] =
    useState(null);

  /* ---------------- ADD POST ---------------- */

  const [showAddPost, setShowAddPost] =
    useState(false);

  const [newPost, setNewPost] =
    useState({
      title: "",
      day: "Mon",
      time: "10:00",
      type: "Meeting"
    });

  /* =====================================================
     OPTIMAL MODE
  ===================================================== */

  const isOptimal =
    useReactMemo &&
    useCallbackOptimization &&
    useMemoOptimization;

  /* =====================================================
     RENDER WORK FUNCTION

     IMPORTANT:
     This function is called ONLY when
     user performs an action.

     It never runs automatically.
  ===================================================== */

  const recordRenderWork = (
    eventId = null
  ) => {

    if (isOptimal) {

      /*
        OPTIMAL MODE

        Only one render unit is counted.
      */

      setRenderScore(
        (previous) =>
          previous + 1
      );

      if (eventId !== null) {

        setCardRenders(
          (previous) => ({
            ...previous,
            [eventId]:
              (previous[eventId] || 0) + 1
          })
        );

      }

    } else {

      /*
        NON-OPTIMAL MODE

        Every existing card is considered
        part of the rendering work.
      */

      setRenderScore(
        (previous) =>
          previous + events.length
      );

      setCardRenders(
        (previous) => {

          const updated = {
            ...previous
          };

          events.forEach((event) => {

            updated[event.id] =
              (updated[event.id] || 0) + 1;

          });

          return updated;

        }
      );
    }
  };

  /* =====================================================
     USEMEMO
  ===================================================== */

  const filteredEvents = useMemo(() => {

    if (selectedType === "All") {
      return events;
    }

    return events.filter(
      (event) =>
        event.type === selectedType
    );

  }, [
    events,
    selectedType,
    useMemoOptimization
  ]);

  /* =====================================================
     USECALLBACK - DRAG START
  ===================================================== */

  const optimizedDragStart =
    useCallback(
      (e, event) => {

        e.dataTransfer.setData(
          "eventId",
          event.id.toString()
        );

      },
      []
    );

  const normalDragStart = (
    e,
    event
  ) => {

    e.dataTransfer.setData(
      "eventId",
      event.id.toString()
    );

  };

  const handleDragStart =
    useCallbackOptimization
      ? optimizedDragStart
      : normalDragStart;

  /* =====================================================
     DRAG & DROP
  ===================================================== */

  const handleDrop = (
    e,
    day
  ) => {

    e.preventDefault();

    const eventId = Number(
      e.dataTransfer.getData(
        "eventId"
      )
    );

    if (!eventId) {
      return;
    }

    setEvents(
      (currentEvents) =>
        currentEvents.map(
          (event) =>
            event.id === eventId
              ? {
                  ...event,
                  day: day
                }
              : event
        )
    );

    /*
      Increase rendering score
      because user moved an event.
    */

    recordRenderWork(eventId);
  };

  const handleDragOver =
    (e) => {
      e.preventDefault();
    };

  /* =====================================================
     EDIT
  ===================================================== */

  const optimizedEdit =
    useCallback(
      (event) => {

        setEditingEvent({
          ...event
        });

      },
      []
    );

  const normalEdit = (
    event
  ) => {

    setEditingEvent({
      ...event
    });

  };

  const handleEdit =
    useCallbackOptimization
      ? optimizedEdit
      : normalEdit;

  /* =====================================================
     SAVE EDIT
  ===================================================== */

  const saveEdit = () => {

    if (!editingEvent) {
      return;
    }

    setEvents(
      (currentEvents) =>
        currentEvents.map(
          (event) =>
            event.id ===
            editingEvent.id
              ? editingEvent
              : event
        )
    );

    /*
      Editing causes rendering.
    */

    recordRenderWork(
      editingEvent.id
    );

    setEditingEvent(null);
  };

  /* =====================================================
     ADD POST
  ===================================================== */

  const addPost = () => {

    if (!newPost.title.trim()) {

      alert(
        "Please enter a post title."
      );

      return;
    }

    const post = {
      id: Date.now(),
      title: newPost.title,
      day: newPost.day,
      time: newPost.time,
      type: newPost.type
    };

    setEvents(
      (currentEvents) => [
        ...currentEvents,
        post
      ]
    );

    /*
      Adding a post causes rendering.
    */

    if (isOptimal) {

      setRenderScore(
        (previous) =>
          previous + 1
      );

      setCardRenders(
        (previous) => ({
          ...previous,
          [post.id]: 1
        })
      );

    } else {

      setRenderScore(
        (previous) =>
          previous +
          events.length +
          1
      );

      setCardRenders(
        (previous) => {

          const updated = {
            ...previous
          };

          events.forEach(
            (event) => {

              updated[event.id] =
                (updated[event.id] || 0) +
                1;

            }
          );

          updated[post.id] = 1;

          return updated;

        }
      );
    }

    /* Clear form */

    setNewPost({
      title: "",
      day: "Mon",
      time: "10:00",
      type: "Meeting"
    });

    setShowAddPost(false);
  };

  /* =====================================================
     FILTER ACTION
  ===================================================== */

  const handleFilterChange = (
    value
  ) => {

    setSelectedType(value);

    /*
      Filtering also changes the UI,
      therefore count render work.
    */

    recordRenderWork();
  };

  /* =====================================================
     RESET CALENDAR
  ===================================================== */

  const resetCalendar = () => {

    setEvents(
      initialEvents
    );

    setSelectedType(
      "All"
    );

    setEditingEvent(
      null
    );

    /*
      We intentionally DO NOT reset
      the render monitor here.
    */
  };

  /* =====================================================
     RESET COUNTERS
  ===================================================== */

  const resetCounters = () => {

    setRenderScore(0);

    setCardRenders({});
  };

  /* =====================================================
     GET EVENTS FOR DAY
  ===================================================== */

  const getEventsForDay = (
    day
  ) => {

    return filteredEvents.filter(
      (event) =>
        event.day === day
    );

  };

  /* =====================================================
     SELECT CARD TYPE
  ===================================================== */

  const CardComponent =
    useReactMemo
      ? MemoEventCard
      : NormalEventCard;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="app">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">

        <h1>
          Interactive Calendar
        </h1>

        <p>
          Drag events between days, then
          flip the switches below to see,
          in real time, what React.memo,
          useCallback, and useMemo
          actually do to re-renders.
        </p>

      </header>

      {/* =================================================
          CONTROL PANEL
      ================================================= */}

      <section className="control-panel">

        <div className="optimization-row">

          {/* React.memo */}

          <div className="optimization-item">

            <div className="optimization-top">

              <button
                className={`switch ${
                  useReactMemo
                    ? "on"
                    : ""
                }`}
                onClick={() =>
                  setUseReactMemo(
                    (value) =>
                      !value
                  )
                }
              >
                <span></span>
              </button>

              <div>

                <h3>
                  React.memo on cards
                </h3>

                <p>
                  Skip a card's re-render
                  when its own props
                  haven't changed.
                </p>

              </div>

            </div>

          </div>

          {/* useCallback */}

          <div className="optimization-item">

            <div className="optimization-top">

              <button
                className={`switch ${
                  useCallbackOptimization
                    ? "on"
                    : ""
                }`}
                onClick={() =>
                  setUseCallbackOptimization(
                    (value) =>
                      !value
                  )
                }
              >
                <span></span>
              </button>

              <div>

                <h3>
                  useCallback for handlers
                </h3>

                <p>
                  Keep drag handlers
                  referentially stable
                  so memo isn't fooled.
                </p>

              </div>

            </div>

          </div>

          {/* useMemo */}

          <div className="optimization-item">

            <div className="optimization-top">

              <button
                className={`switch ${
                  useMemoOptimization
                    ? "on"
                    : ""
                }`}
                onClick={() =>
                  setUseMemoOptimization(
                    (value) =>
                      !value
                  )
                }
              >
                <span></span>
              </button>

              <div>

                <h3>
                  useMemo for agenda filter
                </h3>

                <p>
                  Cache the filtered list;
                  recompute only when
                  events or filter change.
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="divider"></div>

        {/* Live Clock */}

        <div className="bottom-controls">

          <div className="live-control">

            <div className="optimization-top">

              <button
                className={`switch ${
                  liveClock
                    ? "on"
                    : ""
                }`}
                onClick={() =>
                  setLiveClock(
                    (value) =>
                      !value
                  )
                }
              >
                <span></span>
              </button>

              <div>

                <h3>
                  Live clock
                </h3>

                <p>
                  Ticks every 450ms to
                  simulate unrelated
                  state elsewhere in
                  the app.
                </p>

              </div>

            </div>

          </div>

          <div className="control-buttons">

            <button
              className="reset-counter"
              onClick={
                resetCounters
              }
            >
              Reset counters
            </button>

            <button
              className="add-post-top"
              onClick={() =>
                setShowAddPost(
                  true
                )
              }
            >
              + Add Post
            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          MODE STATUS
      ================================================= */}

      <div
        className={`mode-banner ${
          isOptimal
            ? "optimal"
            : "non-optimal"
        }`}
      >

        <strong>

          {isOptimal
            ? "✓ OPTIMAL RENDERING"
            : "⚠ NON-OPTIMAL RENDERING"}

        </strong>

        <span>

          {isOptimal
            ? "All three React optimizations are enabled."
            : "One or more optimizations are disabled. More rendering work occurs on each action."}

        </span>

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main>

        {/* =================================================
            WEEK VIEW
        ================================================= */}

        <section className="calendar-section">

          <div className="section-heading">

            <h2>
              WEEK VIEW
            </h2>

            <div className="legend">

              <span className="meeting">
                Meeting
              </span>

              <span className="deadline">
                Deadline
              </span>

              <span className="focus">
                Focus block
              </span>

              <span className="personal">
                Personal
              </span>

            </div>

          </div>

          {/* Calendar */}

          <div className="calendar">

            {days.map(
              (day) => (

                <div
                  className="day-column"
                  key={day}
                  onDrop={(e) =>
                    handleDrop(
                      e,
                      day
                    )
                  }
                  onDragOver={
                    handleDragOver
                  }
                >

                  <div className="day-header">
                    {day}
                  </div>

                  <div className="events">

                    {getEventsForDay(
                      day
                    ).map(
                      (event) => (

                        <CardComponent
                          key={
                            event.id
                          }
                          event={
                            event
                          }
                          onDragStart={
                            handleDragStart
                          }
                          onEdit={
                            handleEdit
                          }
                        />

                      )
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            RENDER MONITOR
        ================================================= */}

        <section className="monitor">

          <h2>
            RENDER MONITOR
          </h2>

          <div className="monitor-stats">

            <div className="stat">

              <strong>
                {renderScore}
              </strong>

              <span>
                total renders logged
              </span>

            </div>

            <div className="stat">

              <strong>
                {
                  filteredEvents.length
                }
                /
                {
                  events.length
                }
              </strong>

              <span>
                cards that have rendered
              </span>

            </div>

          </div>

          <div className="render-list">

            {events.map(
              (event) => {

                const count =
                  cardRenders[
                    event.id
                  ] || 0;

                const width =
                  Math.min(
                    count * 12,
                    100
                  );

                return (

                  <div
                    className="render-row"
                    key={
                      event.id
                    }
                  >

                    <span className="render-name">
                      {event.title}
                    </span>

                    <div className="render-bar">

                      <div
                        className="render-progress"
                        style={{
                          width:
                            `${width}%`
                        }}
                      ></div>

                    </div>

                    <span className="render-number">
                      {count}
                    </span>

                  </div>

                );

              }
            )}

          </div>

          <div className="monitor-explanation">

            <div>

              <span className="status-dot"></span>

              <span>
                Optimal:
                only necessary render
                work is counted.
              </span>

            </div>

            <div>

              <span className="status-dot warning"></span>

              <span>
                Non-optimal:
                more cards receive
                render work.
              </span>

            </div>

          </div>

        </section>

      </main>

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingEvent && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Edit Post
            </h2>

            <label>
              Post Title
            </label>

            <input
              type="text"
              value={
                editingEvent.title
              }
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  title:
                    e.target.value
                })
              }
            />

            <label>
              Day
            </label>

            <select
              value={
                editingEvent.day
              }
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  day:
                    e.target.value
                })
              }
            >

              {days.map(
                (day) => (

                  <option
                    key={day}
                    value={day}
                  >
                    {day}
                  </option>

                )
              )}

            </select>

            <label>
              Time
            </label>

            <input
              type="time"
              value={
                editingEvent.time
              }
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  time:
                    e.target.value
                })
              }
            />

            <label>
              Type
            </label>

            <select
              value={
                editingEvent.type
              }
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  type:
                    e.target.value
                })
              }
            >

              <option value="Meeting">
                Meeting
              </option>

              <option value="Deadline">
                Deadline
              </option>

              <option value="Focus block">
                Focus block
              </option>

              <option value="Personal">
                Personal
              </option>

            </select>

            <div className="modal-buttons">

              <button
                className="cancel-button"
                onClick={() =>
                  setEditingEvent(
                    null
                  )
                }
              >
                Cancel
              </button>

              <button
                className="save-button"
                onClick={
                  saveEdit
                }
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          ADD POST MODAL
      ================================================= */}

      {showAddPost && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Add New Post
            </h2>

            <label>
              Post Title
            </label>

            <input
              type="text"
              placeholder="Enter post title"
              value={
                newPost.title
              }
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  title:
                    e.target.value
                })
              }
            />

            <label>
              Day
            </label>

            <select
              value={
                newPost.day
              }
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  day:
                    e.target.value
                })
              }
            >

              {days.map(
                (day) => (

                  <option
                    key={day}
                    value={day}
                  >
                    {day}
                  </option>

                )
              )}

            </select>

            <label>
              Time
            </label>

            <input
              type="time"
              value={
                newPost.time
              }
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  time:
                    e.target.value
                })
              }
            />

            <label>
              Type
            </label>

            <select
              value={
                newPost.type
              }
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  type:
                    e.target.value
                })
              }
            >

              <option value="Meeting">
                Meeting
              </option>

              <option value="Deadline">
                Deadline
              </option>

              <option value="Focus block">
                Focus block
              </option>

              <option value="Personal">
                Personal
              </option>

            </select>

            <div className="modal-buttons">

              <button
                className="cancel-button"
                onClick={() =>
                  setShowAddPost(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="save-button"
                onClick={
                  addPost
                }
              >
                Add Post
              </button>

            </div>

          </div>

        </div>

      )}

      <footer>
        Interactive Calendar • React
        Performance Optimization
      </footer>

    </div>
  );
}

export default App;